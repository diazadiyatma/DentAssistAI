const { loadEnvConfig } = require('@next/env');
loadEnvConfig(process.cwd());

const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function run() {
  try {
    const user = await prisma.user.findFirst();
    if (!user) {
      console.log("No user found in the database. Cannot run verification.");
      return;
    }

    const userId = user.id;
    console.log("Found User ID:", userId);

    // Insert dummy explainer history
    const exp = await prisma.explainerHistory.create({
      data: {
        userId,
        prompt: "What is an endodontic treatment?",
        response: "Endodontic treatment, commonly known as root canal therapy, addresses issues within the tooth pulp.",
      }
    });
    console.log("Created ExplainerHistory record:", exp.id);

    // Insert activity log for explainer
    await prisma.activityLog.create({
      data: {
        userId,
        activityType: "AI_EXPLAINER"
      }
    });

    // Insert dummy summary history
    const sum = await prisma.summaryHistory.create({
      data: {
        userId,
        originalContent: "A randomized controlled trial of dental implants...",
        summaryResult: JSON.stringify({ overview: "Dental implants study.", keyPoints: ["Implant success rates", "Osseointegration rate"] }),
      }
    });
    console.log("Created SummaryHistory record:", sum.id);

    // Insert activity log for summary
    await prisma.activityLog.create({
      data: {
        userId,
        activityType: "AI_SUMMARY"
      }
    });

    // Query stats using the same logic as the API route
    const [explainerCount, summaryCount, activityCount, recentActivities] = await Promise.all([
      prisma.explainerHistory.count({
        where: { userId },
      }),
      prisma.summaryHistory.count({
        where: { userId },
      }),
      prisma.activityLog.count({
        where: { userId },
      }),
      prisma.activityLog.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    console.log("------------------------");
    console.log("VERIFIED STATS:");
    console.log("Total Explainer Usage:", explainerCount);
    console.log("Total Summary Usage:", summaryCount);
    console.log("Total Activities:", activityCount);
    console.log("Recent Activities Count (max 5):", recentActivities.length);
    recentActivities.forEach((act, idx) => {
      console.log(`  [${idx + 1}] Type: ${act.activityType}, CreatedAt: ${act.createdAt}`);
    });
    console.log("------------------------");

    // Clean up test data
    await prisma.explainerHistory.deleteMany({ where: { userId } });
    await prisma.summaryHistory.deleteMany({ where: { userId } });
    await prisma.activityLog.deleteMany({ where: { userId } });
    console.log("Cleaned up test records.");

  } catch (err) {
    console.error("Verification Error:", err);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

run();
