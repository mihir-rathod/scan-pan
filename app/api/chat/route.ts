import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { withRetry } from "@/lib/gemini-retry";

export async function POST(req: Request) {
  try {
    const { messages, recipeContext, ingredients } = await req.json();

    if (!messages || !recipeContext) {
      return NextResponse.json({ error: "Missing messages or recipe context" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3-flash-preview",
      generationConfig: { responseMimeType: "application/json" }
    });

    const systemContext = `You are Chef AI, a friendly and expert culinary assistant embedded inside the ScanPan app.
    
The user has just generated this recipe:
Title: ${recipeContext.title}
Description: ${recipeContext.description}
Ingredients: ${recipeContext.all_ingredients?.join(", ")}
Instructions: ${recipeContext.instructions}

The user's pantry contains: ${ingredients}

Your role is to:
- Answer questions about this specific recipe
- Suggest substitutions, variations, or tips
- Help make the recipe more suitable to dietary needs or taste preferences
- Be concise, warm, and helpful
- Keep responses short (2-4 sentences unless a longer answer is clearly needed)

CRITICAL INSTRUCTION: You MUST ALWAYS respond with a clean, raw JSON string containing two fundamental fields: "reply" and "updatedRecipe".
If the user asks a question that does NOT require changing the recipe (e.g. "how long does this take?", "what does sauté mean?"), return null for updatedRecipe.
If the user asks to modify the recipe (e.g. "make it vegan", "swap the milk for water", "make it spicy"), you MUST generate an entirely revised recipe and provide it in the updatedRecipe field.

Return exactly this JSON format (no markdown blocks, no \`\`\`json tags, just raw JSON):
{
  "reply": "Your conversational response here.",
  "updatedRecipe": {
    "title": "New Title (if applicable)",
    "description": "Updated description",
    "all_ingredients": ["new list", "of ingredients"],
    "instructions": "Full markdown numbered list of instructions"
  } // OR null if no changes are made to the recipe
}`;

    // Convert messages to Gemini's chat history format
    const history = [
      {
        role: "user" as const,
        parts: [{ text: "What recipe are we working with today?" }],
      },
      {
        role: "model" as const,
        parts: [{ text: systemContext }],
      },
      ...messages.slice(0, -1).map((m: { role: string; text: string }) => ({
        role: m.role as "user" | "model",
        parts: [{ text: m.text }],
      })),
    ];

    const chat = model.startChat({ history });

    const lastMessage = messages[messages.length - 1];
    const result = await withRetry(() => chat.sendMessage(lastMessage.text));
    let text = result.response.text();
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse chat JSON:", text);
      return NextResponse.json({ reply: text, updatedRecipe: null });
    }

    return NextResponse.json(parsedResponse);

  } catch (error: any) {
    console.error("Chat AI Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to get a response from the chef." },
      { status: 500 }
    );
  }
}
