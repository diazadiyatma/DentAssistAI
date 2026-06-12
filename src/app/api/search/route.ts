import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    if (!query.trim()) {
      return NextResponse.json({
        success: true,
        results: [],
      });
    }

    // Search ExplainerHistory
    const explainerResults = await prisma.explainerHistory.findMany({
      where: {
        userId,
        OR: [
          { prompt: { contains: query, mode: "insensitive" } },
          { response: { contains: query, mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    // Search SummaryHistory
    const summaryResults = await prisma.summaryHistory.findMany({
      where: {
        userId,
        OR: [
          { originalContent: { contains: query, mode: "insensitive" } },
          { summaryResult: { contains: query, mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    // Search QuizHistory
    const quizResults = await prisma.quizHistory.findMany({
      where: {
        userId,
        OR: [
          { originalContent: { contains: query, mode: "insensitive" } },
          { quizResult: { contains: query, mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    // Format results to a unified structure
    const formattedExplainer = explainerResults.map((item) => ({
      id: item.id,
      type: "explainer",
      title: item.prompt,
      subtitle: item.response.substring(0, 100) + (item.response.length > 100 ? "..." : ""),
      createdAt: item.createdAt,
    }));

    const formattedSummary = summaryResults.map((item) => ({
      id: item.id,
      type: "summary",
      title: item.originalContent.substring(0, 80) + (item.originalContent.length > 80 ? "..." : ""),
      subtitle: item.summaryResult.substring(0, 100) + (item.summaryResult.length > 100 ? "..." : ""),
      createdAt: item.createdAt,
    }));

    const formattedQuiz = quizResults.map((item) => {
      const topicMatch = item.originalContent.match(/quiz about (.+?)\./i);
      const topic = topicMatch ? topicMatch[1].trim() : item.originalContent.slice(0, 80);
      const diffMatch = item.originalContent.match(/Generate a (\w+) level/i);
      const difficulty = diffMatch ? diffMatch[1] : "General";

      return {
        id: item.id,
        type: "quiz",
        title: topic,
        subtitle: `${difficulty} difficulty quiz`,
        createdAt: item.createdAt,
      };
    });

    // Combine and sort by date desc
    const allResults = [...formattedExplainer, ...formattedSummary, ...formattedQuiz]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);

    return NextResponse.json({
      success: true,
      results: allResults,
    });
  } catch (error: any) {
    console.error("Search API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
