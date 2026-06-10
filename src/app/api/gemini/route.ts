import OpenAI from "openai";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt, type } = await req.json();

    console.log(
      "API Key exists:",
      !!process.env.OPENROUTER_API_KEY
    );

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    const completion = await client.chat.completions.create({
      model: "openai/gpt-oss-20b:free",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: `
You are DentAssist AI.

You are an intelligent dental and medical assistant.

Rules:
- Answer the user's exact question.
- Understand follow-up questions naturally.
- Do not switch topics.
- Do not output generic lists unless explicitly asked.
- If user asks for more detail, expand the previous topic.
- Use clear explanations.
- Use bullet points only when helpful.
- If the question is not dental related, answer normally.
- Respond in markdown.
          `,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const text =
      completion.choices[0]?.message?.content ||
      "No response generated.";

    if (type === "explainer") {
      if (!userId) {
        return NextResponse.json(
          { success: false, error: "Unauthorized" },
          { status: 401 }
        );
      }

      await prisma.$transaction([
        prisma.explainerHistory.create({
          data: {
            userId,
            prompt,
            response: text,
          },
        }),
        prisma.activityLog.create({
          data: {
            userId,
            activityType: "AI_EXPLAINER",
          },
        }),
      ]);
    }

    if (type === "quiz") {
      if (!userId) {
        return NextResponse.json(
          { success: false, error: "Unauthorized" },
          { status: 401 }
        );
      }

      await prisma.$transaction([
        prisma.quizHistory.create({
          data: {
            userId,
            originalContent: prompt,
            quizResult: text,
          },
        }),
        prisma.activityLog.create({
          data: {
            userId,
            activityType: "AI_QUIZ",
          },
        }),
      ]);
    }

    return NextResponse.json({
      success: true,
      text,
    });
  } catch (error: any) {
    console.error("FULL ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error?.message || String(error),
      },
      {
        status: 500,
      }
    );
  }
}