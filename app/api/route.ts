import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface OpenAIError {
  message: string;
  code?: string;
  response?: {
    status: number;
    data: {
      error: {
        message: string;
        code: string;
      };
    };
  };
}

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OpenAI API key not configured" },
      { status: 500 }
    );
  }

  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Invalid prompt provided" },
        { status: 400 }
      );
    }

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      style: "natural", // You can adjust this based on your needs
      quality: "standard", // Or "hd" for higher quality
    });

    // Extract image URL from response
    const imageUrl = response.data[0].url;

    if (!imageUrl) {
      throw new Error("No image URL received from OpenAI");
    }

    // Return successful response
    return NextResponse.json({ url: imageUrl });
  } catch (error: unknown) {
    console.error("Error generating image:", error);

    if (error instanceof Error) {
      const err = error as OpenAIError;

      if (err.message.includes("invalid_api_key")) {
        return NextResponse.json(
          { error: "Invalid API key provided" },
          { status: 401 }
        );
      }

      if (err.message.includes("content_policy_violation")) {
        return NextResponse.json(
          { error: "Content policy violation" },
          { status: 400 }
        );
      }

      if (err.message.includes("rate_limit_exceeded")) {
        return NextResponse.json(
          { error: "Rate limit exceeded" },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}
