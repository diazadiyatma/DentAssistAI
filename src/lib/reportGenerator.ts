import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export async function generatePDFReport(
  stats: { explainerCount: number; summaryCount: number; activityCount: number; quizCount: number },
  profileName: string,
  profileEmail: string
) {
  // Fetch full data on-demand
  const [explainerRes, summaryRes, quizRes] = await Promise.all([
    fetch("/api/history/explainer").then((res) => res.json()),
    fetch("/api/history/summary").then((res) => res.json()),
    fetch("/api/history/quiz").then((res) => res.json()),
  ]);

  const explainerHistory = explainerRes.success ? explainerRes.history : [];
  const summaryHistory = summaryRes.success ? summaryRes.history : [];
  const quizHistory = quizRes.success ? quizRes.history : [];

  const doc = new jsPDF();

  // Helper for drawing headers/footers
  const addHeaderFooter = (pdf: jsPDF, pageNum: number, totalPages: number) => {
    if (pageNum === 1) return; // Skip cover page
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(148, 163, 184);

    // Header
    pdf.text("DentAssist AI - Professional Learning Report", 14, 10);
    pdf.line(14, 12, 196, 12);

    // Footer
    pdf.text(`Page ${pageNum} of ${totalPages}`, 196, 287, { align: "right" });
  };

  // --- PAGE 1: COVER PAGE ---
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 0, 210, 297, "F");

  // Accent bar on the left
  doc.setFillColor(45, 52, 210); // Indigo (#2D34D2)
  doc.rect(0, 0, 8, 297, "F");

  // Title & Subtitle
  doc.setFont("helvetica", "bold");
  doc.setFontSize(32);
  doc.setTextColor(45, 52, 210);
  doc.text("DentAssist AI", 25, 60);

  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text("PERSONAL LEARNING REPORT", 25, 72);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(
    "Clinical analytics, explanation logs, paper summaries, and quizzes.",
    25,
    80
  );

  // Metadata Panel
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.rect(25, 95, 160, 45, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("User Profile & Report Info", 32, 105);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text("Name:", 32, 115);
  doc.text("Email:", 32, 123);
  doc.text("Generated On:", 32, 131);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(profileName || "DentAssist User", 65, 115);
  doc.text(profileEmail || "N/A", 65, 123);
  doc.text(
    new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    65,
    131
  );

  // Stats Grid Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(45, 52, 210);
  doc.text("Learning Dashboard Overview", 25, 165);

  // Stats Cards
  const statsItems = [
    { name: "AI Explanations", value: stats.explainerCount },
    { name: "Summarized Papers", value: stats.summaryCount },
    { name: "Quizzes Taken", value: stats.quizCount },
    { name: "Total Interactions", value: stats.activityCount },
  ];

  statsItems.forEach((item, index) => {
    const x = 25 + (index % 2) * 83;
    const y = 175 + Math.floor(index / 2) * 35;

    // Draw card background
    doc.setFillColor(255, 255, 255);
    doc.rect(x, y, 78, 28, "FD");

    // Left card accent bar
    doc.setFillColor(
      index === 0 ? 45 : index === 1 ? 123 : index === 2 ? 16 : 100,
      index === 0 ? 52 : index === 1 ? 97 : index === 2 ? 185 : 116,
      index === 0 ? 210 : index === 1 ? 255 : index === 2 ? 129 : 139
    );
    doc.rect(x, y, 3, 28, "F");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(item.name.toUpperCase(), x + 8, y + 10);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(15, 23, 42);
    doc.text(item.value.toString(), x + 8, y + 22);
  });

  // Footer on cover page
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text(
    "DentAssist AI - Smarter Dental Learning Powered by AI",
    105,
    280,
    { align: "center" }
  );

  // --- PAGE 2: EXPLAINER HISTORY ---
  if (explainerHistory.length > 0) {
    doc.addPage();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(45, 52, 210);
    doc.text("1. AI Dental Explainer History", 14, 25);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(
      "Full logs of recent dental concepts and clinical terms explained by the AI assistant.",
      14,
      31
    );

    const explainerRows = explainerHistory.map((item: any, idx: number) => {
      const dateStr = new Date(item.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      return [idx + 1, dateStr, item.prompt, item.response || "No response"];
    });

    autoTable(doc, {
      startY: 38,
      head: [["#", "Date", "Topic / Prompt Asked", "AI Dental Explanation"]],
      body: explainerRows,
      headStyles: { fillColor: [45, 52, 210], fontSize: 9, fontStyle: "bold" },
      columnStyles: {
        0: { cellWidth: 8 },
        1: { cellWidth: 22 },
        2: { cellWidth: 45, fontStyle: "bold" },
        3: { cellWidth: 110, fontSize: 8.5 },
      },
      styles: { cellPadding: 4, overflow: "linebreak" },
      alternateRowStyles: { fillColor: [250, 250, 250] },
      theme: "striped",
    });
  }

  // --- PAGE 3: SUMMARY HISTORY ---
  if (summaryHistory.length > 0) {
    doc.addPage();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(123, 97, 255); // Secondary color purple
    doc.text("2. Smart Summary History", 14, 25);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(
      "Detailed summaries and structured key points extracted from papers and files.",
      14,
      31
    );

    let currentY = 38;

    summaryHistory.forEach((item: any, idx: number) => {
      const dateStr = new Date(item.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      // Parse summary result
      let overview = "No overview available.";
      let keyPoints: string[] = [];
      try {
        const cleaned = item.summaryResult.replace(/```json\n?|\n?```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        overview = parsed.overview || overview;
        keyPoints = parsed.keyPoints || [];
      } catch {
        overview = item.summaryResult || overview;
      }

      // Check space
      if (currentY > 230) {
        doc.addPage();
        currentY = 25;
      }

      // Draw item header separator box
      doc.setFillColor(252, 251, 255);
      doc.setDrawColor(235, 230, 255);
      doc.rect(14, currentY, 182, 8, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(123, 97, 255);
      doc.text(`Summary Session #${idx + 1} - ${dateStr}`, 18, currentY + 5.5);

      currentY += 12;

      // Original text preview
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text("Source Context Preview:", 14, currentY);
      currentY += 4.5;

      doc.setFont("helvetica", "italic");
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      const sourcePreview =
        item.originalContent.slice(0, 300) +
        (item.originalContent.length > 300 ? "..." : "");
      const sourceLines = doc.splitTextToSize(sourcePreview, 180);
      doc.text(sourceLines, 14, currentY);
      currentY += sourceLines.length * 4.2 + 4;

      // Overview
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text("AI Summary Overview:", 14, currentY);
      currentY += 4.5;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      const overviewLines = doc.splitTextToSize(overview, 180);
      doc.text(overviewLines, 14, currentY);
      currentY += overviewLines.length * 4.2 + 4;

      // Key Points
      if (keyPoints.length > 0) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(15, 23, 42);
        doc.text("Key Takeaways & Points:", 14, currentY);
        currentY += 4.5;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        keyPoints.forEach((point) => {
          if (currentY > 265) {
            doc.addPage();
            currentY = 25;
          }
          const bullet = `• ${point}`;
          const bulletLines = doc.splitTextToSize(bullet, 175);
          doc.text(bulletLines, 16, currentY);
          currentY += bulletLines.length * 4.2 + 1;
        });
      }

      currentY += 10; // extra space between entries
    });
  }

  // --- PAGE 4: QUIZ HISTORY ---
  if (quizHistory.length > 0) {
    doc.addPage();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(16, 185, 129); // Emerald-600
    doc.text("3. Quiz Generator History", 14, 25);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(
      "Self-assessment histories generated to test your clinical knowledge.",
      14,
      31
    );

    let currentY = 38;

    quizHistory.forEach((record: any, idx: number) => {
      const dateStr = new Date(record.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      if (currentY > 230) {
        doc.addPage();
        currentY = 25;
      }

      doc.setFillColor(240, 253, 244);
      doc.setDrawColor(218, 250, 227);
      doc.rect(14, currentY, 182, 8, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(16, 185, 129);
      doc.text(
        `Quiz Session #${idx + 1} - Topic: ${record.topic} (${record.difficulty || "Standard"})`,
        18,
        currentY + 5.5
      );

      currentY += 14;

      if (record.questions && record.questions.length > 0) {
        record.questions.forEach((q: any, qIdx: number) => {
          if (currentY > 255) {
            doc.addPage();
            currentY = 25;
          }

          doc.setFont("helvetica", "bold");
          doc.setFontSize(9.5);
          doc.setTextColor(15, 23, 42);
          const qText = `Q${qIdx + 1}: ${q.question}`;
          const qLines = doc.splitTextToSize(qText, 180);
          doc.text(qLines, 14, currentY);
          currentY += qLines.length * 4.2 + 2;

          // Render options
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          if (Array.isArray(q.options)) {
            q.options.forEach((opt: string, optIdx: number) => {
              if (currentY > 265) {
                doc.addPage();
                currentY = 25;
              }
              const isCorrect = optIdx === q.correct;
              const optionText = `${String.fromCharCode(65 + optIdx)}. ${opt}`;
              doc.setTextColor(
                isCorrect ? 16 : 100,
                isCorrect ? 185 : 116,
                isCorrect ? 129 : 139
              );
              if (isCorrect) {
                doc.setFont("helvetica", "bold");
              } else {
                doc.setFont("helvetica", "normal");
              }
              doc.text(optionText, 18, currentY);
              currentY += 4.2;
            });
          }
          currentY += 4; // Space between questions
        });
      }

      currentY += 8; // Space between quiz sessions
    });
  }

  // --- FINAL PAGE WRAPPING & PAGE NUMBERS ---
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addHeaderFooter(doc, i, totalPages);
  }

  // Save the PDF file
  doc.save("DentAssist_Learning_Report.pdf");
}
