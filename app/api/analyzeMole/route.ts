// File: app/api/analyzeMole/route.ts

import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { asymmetry, border, color, diameter } = await req.json();

    const messages = [
      {
        role: "system" as const,
        content: "You are an AI assistant that analyzes mole characteristics to determine type and likelihood of cancer risk. Respond only in JSON.",
      },
      {
        role: "user" as const,
        content: `Based on the following characteristics, determine the type of mole and the likelihood of cancer risk.
        - Asymmetry: ${asymmetry}
        - Border: ${border}
        - Color: ${color}
        - Diameter: ${diameter}
        Provide the result strictly in JSON format:
        {
          "type": "mole type",
          "likelihood": "likelihood of cancer"
        }`,
      },
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages,
      max_tokens: 150,
      temperature: 0.7,
    });

    // Attempt to parse response content
    const resultText = response.choices[0]?.message?.content || "No response";
    let result;

    try {
      const lastBracketIndex = resultText.lastIndexOf("}");
      if (lastBracketIndex !== -1) {
        result = JSON.parse(resultText.substring(0, lastBracketIndex + 1));
      } else {
        throw new Error("Invalid JSON structure.");
      }
      console.log("Parsed JSON result:", result); // Log parsed result for debugging
      return NextResponse.json({ result });
    } catch (parseError) {
      console.error("Error parsing JSON from OpenAI:", parseError, resultText);
      return NextResponse.json(
        { error: "Failed to parse JSON response", content: resultText },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Failed to analyze mole:", error);
    return NextResponse.json(
      { error: "Failed to analyze mole", details: String(error) },
      { status: 500 }
    );
  }
}
