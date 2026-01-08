// import { NextResponse } from "next/server";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// export async function POST(req: Request) {
//   try {
//     const { image } = await req.json(); // Front-end sends base64 image

//     if (!image) {
//       return NextResponse.json({ error: "No image provided" }, { status: 400 });
//     }

//     // Initialize Gemini
//     const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     // The logic: Remove the data header "data:image/jpeg;base64," so we just have the raw string
//     const base64Data = image.split(",")[1];

//     const prompt = `
//       Analyze this receipt image. Extract the grocery items.
//       Return ONLY a JSON array with this structure:
//       [
//         { "name": "Item Name", "quantity": "Quantity found", "expiry": "Estimated expiry date (YYYY-MM-DD) based on item type" }
//       ]
//       Do not include markdown formatting like \`\`\`json. Just the raw JSON array.
//     `;

//     const result = await model.generateContent([
//       prompt,
//       {
//         inlineData: {
//           data: base64Data,
//           mimeType: "image/jpeg",
//         },
//       },
//     ]);

//     const response = await result.response;
//     const text = response.text();
    
//     // Clean up if the AI added markdown backticks despite instructions
//     const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();

//     return NextResponse.json({ data: JSON.parse(cleanedText) });

//   } catch (error) {
//     console.error("AI Error:", error);
//     return NextResponse.json({ error: "Failed to analyze receipt" }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 1. Simulate "Thinking" delay (2 seconds)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 2. Return fake data as if AI saw a receipt
    const mockData = [
      { name: "Organic Bananas", quantity: "1 bunch", expiry: "2025-01-15" },
      { name: "Sourdough Bread", quantity: "1 loaf", expiry: "2025-01-10" },
      { name: "Whole Milk", quantity: "1 gallon", expiry: "2025-01-18" },
      { name: "Eggs", quantity: "12 count", expiry: "2025-01-30" }
    ];

    return NextResponse.json({ data: mockData });

  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}