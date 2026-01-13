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
      
      Format the output cleanly in Markdown:
      ## Recipe Name
      **Time:** 30 mins
      
      ### Ingredients
      - Item 1
      - Item 2
      
      ### Instructions
      1. Step one
      2. Step two
      
      Keep it simple and delicious.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ recipe: text });

  } catch (error) {
    console.error("Recipe AI Error:", error);
    return NextResponse.json({ error: "Failed to generate recipe" }, { status: 500 });
  }
}