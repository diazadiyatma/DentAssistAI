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

    const [explainerCount, summaryCount, activityCount, quizCount, recentActivities] = await Promise.all([
      prisma.explainerHistory.count({
        where: { userId },
      }),
      prisma.summaryHistory.count({
        where: { userId },
      }),
      prisma.activityLog.count({
        where: { userId },
      }),
      prisma.quizHistory.count({
        where: { userId },
      }),
      prisma.activityLog.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        explainerCount,
        summaryCount,
        activityCount,
        quizCount,
      },
      recentActivities,
    });
  } catch (error: any) {
    console.error("Stats API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
