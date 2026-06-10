import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const raw = await prisma.quizHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        originalContent: true,
        quizResult: true,
        createdAt: true,
      },
    });

    const history = raw.map((record) => {
      const topicMatch = record.originalContent.match(/quiz about (.+?)\./i);
      const topic = topicMatch ? topicMatch[1].trim() : record.originalContent.slice(0, 80);
      const diffMatch = record.originalContent.match(/Generate a (\w+) level/i);
      const difficulty = diffMatch ? diffMatch[1] : null;

      // Parse quizResult JSON if possible
      let questions: any[] = [];
      try {
        const cleaned = record.quizResult.replace(/```json\n?|\n?```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        if (Array.isArray(parsed)) questions = parsed;
      } catch {
        // non-JSON result, leave questions empty
      }

      return {
        id: record.id,
        topic,
        difficulty,
        questions,
        createdAt: record.createdAt,
      };
    });

    return NextResponse.json({ success: true, history });
  } catch (error: any) {
    console.error("Quiz Full History API Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
