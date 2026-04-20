import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { ingredients, strictMode = true } = await req.json();

    if (!ingredients) {
      return NextResponse.json({ error: "No ingredients provided" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

    const strictPrompt = `
      I have ONLY these ingredients: ${ingredients}.
      Suggest one creative recipe I can make using ONLY these ingredients.
      Assume I have basic staples like salt, pepper, oil, water, butter.
      Do NOT include any ingredients that are not in my list (besides basic staples).
    `;

    const flexiblePrompt = `
      I have these ingredients: ${ingredients}.
      Suggest one creative and delicious recipe. You may include 1-2 additional common ingredients 
      that I might need to buy, but try to primarily use what I already have.
      Assume I have basic staples like salt, pepper, oil, water, butter.
      If the recipe needs extra ingredients not in my list, mark them with "(need to buy)" next to the ingredient.
    `;

    const prompt = `
      ${strictMode ? strictPrompt : flexiblePrompt}

      Return a JSON object with this exact schema:
      {
        "title": "Recipe Title",
        "description": "Brief 1-sentence description",
        "all_ingredients": ["2 cups Flour", "1 tsp Salt", "3 large Eggs (need to buy)"], 
        "instructions": "A properly formatted Markdown numbered list. Example:\\n1. First step\\n2. Second Step\\n\\nEnsure there are newlines between items."
      }
      
      Do NOT wrap the json in markdown code blocks.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const data = JSON.parse(text);

    return NextResponse.json({ recipe: data });

  } catch (error) {
    console.error("Recipe AI Error:", error);
    return NextResponse.json({ error: "Failed to generate recipe" }, { status: 500 });
  }
}