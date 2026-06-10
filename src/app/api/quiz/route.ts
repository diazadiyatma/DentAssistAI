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
    const { prompt } = await req.json();
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Prompt required" }, { status: 400 });
    }

    const completion = await client.chat.completions.create({
      model: "openai/gpt-oss-20b:free",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: `You are a dental AI assistant. Generate a concise multiple‑choice quiz (5 questions) about the given topic. Return ONLY a valid JSON array of objects with the shape { question: string, options: string[], correct: number } without any markdown or surrounding text.`,
        },
        { role: "user", content: prompt },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "";
    let quiz = "";
    try {
      const jsonStr = typeof raw === "string" ? raw.replace(/```json\n?|\n?```/g, "").trim() : "";
      quiz = JSON.stringify(JSON.parse(jsonStr), null, 2);
    } catch (e) {
      console.error("Quiz parse error", e);
      quiz = raw;
    }

    await prisma.$transaction([
      prisma.quizHistory.create({
        data: { userId, originalContent: prompt, quizResult: quiz },
      }),
      prisma.activityLog.create({
        data: { userId, activityType: "AI_QUIZ" },
      }),
    ]);

    return NextResponse.json({ success: true, quiz });
  } catch (error: any) {
    console.error("Quiz API error", error);
    return NextResponse.json({ success: false, error: error?.message || "Unexpected error" }, { status: 500 });
  }
}
