import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // 1. Setup Gemini
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-exp" });

    // 2. Prepare Image (Strip the "data:image/jpeg;base64," header if present)
    const base64Data = image.includes("base64,") ? image.split("base64,")[1] : image;

    const prompt = `
      Analyze this image of a receipt or grocery items. 
      Identify the food items.
      Return ONLY a valid JSON array. Each object must have:
      - "name": string (item name)
      - "quantity": string (e.g. "1 gal", "2 count")
      - "expiry": string (estimated expiry date YYYY-MM-DD based on item type. e.g. Milk = today + 7 days)
      
      Example output:
      [{"name": "Milk", "quantity": "1 gal", "expiry": "2025-01-20"}]
      
      Do NOT wrap in markdown code blocks. Just raw JSON.
    `;

    // 3. Call AI
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

    console.log("Raw AI Response:", text); // Debugging log

    // 4. Clean formatting (Gemini loves to add ```json ... ```)
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    // 5. Parse
    const items = JSON.parse(text);

    return NextResponse.json({ data: items });

  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: "Failed to analyze receipt" }, { status: 500 }); // Return 500 so frontend knows it failed
  }
}