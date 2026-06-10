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

    const history = await prisma.quizHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        originalContent: true,
        createdAt: true,
      },
    });

    // Extract topic from the stored prompt:
    // Format: "Generate a <difficulty> level multiple-choice quiz about <topic>."
    const parsed = history.map((record) => {
      const match = record.originalContent.match(/quiz about (.+?)\./i);
      const topic = match ? match[1].trim() : record.originalContent.slice(0, 80);
      const diffMatch = record.originalContent.match(/Generate a (\w+) level/i);
      const difficulty = diffMatch ? diffMatch[1] : null;
      return {
        id: record.id,
        topic,
        difficulty,
        createdAt: record.createdAt,
      };
    });

    return NextResponse.json({ success: true, history: parsed });
  } catch (error: any) {
    console.error("Quiz History API Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
