import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

    const base64Data = image.includes("base64,") ? image.split("base64,")[1] : image;

    const prompt = `
      Analyze this image of a receipt or grocery items. 
      Identify the food items.
      Format item names nicely: Use Title Case, remove receipt codes/numbers, and fix abbreviations.
      (e.g. Convert "BANANA ORG 4011" to "Organic Bananas", "MLK 1GAL" to "Whole Milk").
      
      Return ONLY a valid JSON array. Each object must have:
      - "name": string (Clean, human-readable name)
      - "quantity": string (e.g. "1 gal", "2 count")
      - "expiry": string (estimated expiry date YYYY-MM-DD based on item type. e.g. Milk = today + 7 days, Bread = today + 5 days, Canned goods = today + 365 days)
      - "category": string (one of: "Produce", "Dairy", "Protein", "Grain", "Beverage", "Snack", "Other")
      
      Example output:
      [{"name": "Whole Milk", "quantity": "1 gal", "expiry": "2025-01-20", "category": "Dairy"}]
      
      Do NOT wrap in markdown code blocks. Just raw JSON.
    `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg",
        },
      },
    ]);

    const response = await result.response;
    let text = response.text();

    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const items = JSON.parse(text);

    return NextResponse.json({ data: items });

  } catch (error: any) {
    console.error("AI Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to analyze receipt. Please try again." },
      { status: 500 }
    );
  }
}