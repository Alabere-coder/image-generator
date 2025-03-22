import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  // Validate API key
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OpenAI API key not configured' },
      { status: 500 }
    );
  }

  try {
    // Parse request body
    const { prompt } = await request.json();

    // Validate prompt
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Invalid prompt provided' },
        { status: 400 }
      );
    }

    // Call OpenAI API
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
      throw new Error('No image URL received from OpenAI');
    }

    // Return successful response
    return NextResponse.json({ url: imageUrl });

  } catch (error: any) {
    console.error('Error generating image:', error);

    // Handle different types of errors
    if (error.code === 'invalid_api_key') {
      return NextResponse.json(
        { error: 'Invalid API key provided' },
        { status: 401 }
      );
    }

    if (error.code === 'content_policy_violation') {
      return NextResponse.json(
        { error: 'Content policy violation' },
        { status: 400 }
      );
    }

    if (error.code === 'rate_limit_exceeded') {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    // Generic error response
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
}