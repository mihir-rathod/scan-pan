import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { ingredients } = await req.json();

    if (!ingredients) {
      return NextResponse.json({ error: "No ingredients provided" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      I have these ingredients: ${ingredients}.
      Suggest one creative recipe I can make. 
      Assume I have basic staples like salt, pepper, oil, water.

      Return a JSON object with this exact schema:
      {
        "title": "Recipe Title",
        "description": "Brief 1-sentence description",
        "all_ingredients": ["2 cups Flour", "1 tsp Salt", "3 large Eggs"], 
        "instructions": "A properly formatted Markdown numbered list. Example:\n1. First step\n2. Second Step\n\nEnsure there are newlines between items."
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