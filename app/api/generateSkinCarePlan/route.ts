// File: app/api/generateSkinCarePlan/route.ts

import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { age, gender, skinType, skinIssues } = await req.json();

  if (!age || !gender || !skinType) {
    console.error("Error: Missing required fields in request.");
    return NextResponse.json(
      { error: "Missing required fields: age, gender, or skin type" },
      { status: 400 }
    );
  }

  try {
    const messages = [
      {
        role: "system" as const,
        content: "You are an AI assistant providing skincare advice. Respond only in valid JSON.",
      },
      {
        role: "user" as const,
        content: `
          - Age: ${age}
          - Gender: ${gender}
          - Skin Type: ${skinType}
          - Skin Issues: ${skinIssues || "None"}

          Provide a concise JSON response:
          {
            "advice": "A short sentence.",
            "recommendedProducts": [
              {"name": "string", "type": "string", "description": "string"}
            ],
            "skinCarePlan": "One sentence."
          }

          Only respond with JSON and no extra text.
        `,
      },
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 200, // Keep it concise to avoid truncation
      temperature: 0.3,
      stream: true, // Enable streaming
    });

    // Stream processing
    const chunks: string[] = [];
    for await (const chunk of response) {
      if (chunk?.choices?.[0]?.delta?.content) {
        chunks.push(chunk.choices[0].delta.content);
      }
    }

    // Combine chunks into a single response
    const resultText = chunks.join("").trim();

    let result;
    try {
      const lastBracketIndex = resultText.lastIndexOf("}");
      if (lastBracketIndex !== -1) {
        result = JSON.parse(resultText.substring(0, lastBracketIndex + 1));
      } else {
        throw new Error("Invalid JSON structure.");
      }
      console.log("Parsed JSON result:", result);
      return NextResponse.json(result);
    } catch (parseError) {
      console.error("Error parsing JSON from OpenAI:", parseError, resultText);
      return NextResponse.json({ error: "Failed to parse JSON response", content: resultText }, { status: 500 });
    }
  } catch (error) {
    console.error("Error communicating with OpenAI:", error);
    return NextResponse.json(
      { error: "Failed to generate skincare plan", details: (error as Error).message },
      { status: 500 }
    );
  }
}
