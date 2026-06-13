import OpenAI from "openai";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import pdf from "pdf-parse";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();

    let textData = formData.get("text") as string | null;
    const file = formData.get("file") as File | null;

    if (file) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const textResult = await pdf(buffer);
        textData = textResult.text;
      } catch (pdfError: any) {
        console.error("PDF parsing error:", pdfError);
        return NextResponse.json(
          {
            error: "Failed to parse PDF file: " + (pdfError?.message || ""),
          },
          {
            status: 400,
          }
        );
      }
    }

    if (!textData?.trim()) {
      return NextResponse.json(
        {
          error: "No text provided.",
        },
        {
          status: 400,
        }
      );
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        {
          error: "OpenRouter API Key missing.",
        },
        {
          status: 500,
        }
      );
    }

    const prompt = `
You are DentAssist AI.

Summarize the following dental or medical content.

Return ONLY valid JSON.

{
  "overview": "A short 2-sentence overview.",
  "keyPoints": [
    "Point 1",
    "Point 2",
    "Point 3",
    "Point 4"
  ]
}

Content:

${textData.substring(0, 30000)}
`;

    const completion = await client.chat.completions.create({
      model: "openai/gpt-oss-20b:free",
      messages: [
        {
          role: "system",
          content:
            "You are a professional dental AI assistant. Always return valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const text =
      completion.choices[0]?.message?.content ||
      JSON.stringify({
        overview: "No summary generated.",
        keyPoints: [],
      });

    await prisma.$transaction([
      prisma.summaryHistory.create({
        data: {
          userId,
          originalContent: textData,
          summaryResult: text,
        },
      }),
      prisma.activityLog.create({
        data: {
          userId,
          activityType: "AI_SUMMARY",
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      text,
    });
  } catch (error: any) {
    console.error("Summary API Error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          "Something went wrong while generating summary.",
      },
      {
        status: 500,
      }
    );
  }
}