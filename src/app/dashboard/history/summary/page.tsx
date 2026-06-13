"use client";

import { useState, useEffect, Suspense } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FileText, Clock, ScrollText, ChevronDown, ChevronUp, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

interface SummaryRecord {
  id: string;
  originalContent: string;
  summaryResult: string;
  createdAt: string;
}

interface ParsedSummary {
  overview?: string;
  keyPoints?: string[];
}

function parseSummary(raw: string): ParsedSummary {
  try {
    const cleaned = raw.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return { overview: raw, keyPoints: [] };
  }
}

function SummaryHistoryContent() {
  const [history, setHistory] = useState<SummaryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    fetch("/api/history/summary")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setHistory(data.history);
          const targetId = searchParams.get("id");
          if (targetId) {
            setExpanded(targetId);
            setTimeout(() => {
              const element = document.getElementById(targetId);
              if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "center" });
              }
            }, 100);
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [searchParams]);

  const toggle = (id: string) => setExpanded((prev) => (prev === id ? null : id));

  return (
    <div className="space-y-4 pb-12">
      {/* Header */}
      <div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 mb-1.5"
        >
          <div className="h-1.5 w-1.5 rounded-full bg-secondary shadow-lg shadow-secondary/20" />
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            Session Archive
          </span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-3xl font-black text-foreground tracking-tight"
        >
          Summary <span className="text-secondary">History</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground mt-1 text-xs sm:text-sm font-medium"
        >
          All your AI Summary sessions with original text and results, newest first.
        </motion.p>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-secondary" />
        </div>
      ) : history.length === 0 ? (
        <Card className="medical-card">
          <CardContent className="p-8 flex flex-col items-center justify-center text-center gap-3">
            <div className="p-4 rounded-2xl bg-slate-50 border border-border">
              <ScrollText className="w-8 h-8 text-muted-foreground/30" />
            </div>
            <h3 className="text-lg font-black text-foreground">No Summary History</h3>
            <p className="text-muted-foreground font-medium text-xs max-w-xs">
              Start using AI Summary Generator to see your sessions here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {history.map((record, i) => {
            const dateObj = new Date(record.createdAt);
            const displayDate = dateObj.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            });
            const displayTime = dateObj.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
            const preview = record.originalContent.trim().slice(0, 140) +
              (record.originalContent.length > 140 ? "…" : "");
            const isOpen = expanded === record.id;
            const parsed = parseSummary(record.summaryResult);

            return (
              <motion.div
                key={record.id}
                id={record.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * i }}
              >
                <Card className={cn("medical-card overflow-hidden transition-all duration-300", isOpen && "border-secondary/30 shadow-lg shadow-secondary/5")}>
                  {/* Accordion Header */}
                  <button onClick={() => toggle(record.id)} className="w-full text-left">
                    <CardHeader className="p-4 pb-3">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "p-2 rounded-xl border shrink-0 transition-colors mt-0.5",
                          isOpen
                            ? "bg-secondary/10 border-secondary/20 text-secondary"
                            : "bg-slate-50 border-border text-muted-foreground"
                        )}>
                          <FileText className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-bold text-foreground leading-snug line-clamp-2">
                            {preview}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                              {displayDate} • {displayTime}
                            </span>
                            <span className="ml-2 text-[9px] font-black text-secondary/60 bg-secondary/5 border border-secondary/10 px-1.5 py-0.5 rounded-full">
                              #{i + 1}
                            </span>
                          </div>
                        </div>
                        <div className={cn(
                          "shrink-0 p-1 rounded-lg transition-colors",
                          isOpen ? "bg-secondary/10 text-secondary" : "text-muted-foreground"
                        )}>
                          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    </CardHeader>
                  </button>

                  {/* Accordion Body */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <CardContent className="px-4 pb-4 pt-0 space-y-4">
                          {/* Original Text */}
                          <div className="border-t border-border pt-3">
                            <div className="flex items-center gap-2 mb-2">
                              <FileText className="w-3 h-3 text-muted-foreground" />
                              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                                Original Text
                              </span>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-900 border border-border rounded-xl p-4 text-xs text-foreground leading-relaxed max-h-48 overflow-y-auto no-scrollbar">
                              {record.originalContent}
                            </div>
                          </div>

                          {/* Summary Result */}
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Sparkles className="w-3.5 h-3.5 text-secondary" />
                              <span className="text-[9px] font-black uppercase tracking-widest text-secondary">
                                AI Summary
                              </span>
                            </div>
                            <div className="bg-secondary/5 border border-secondary/20 rounded-xl p-4 space-y-3">
                              {parsed.overview && (
                                <p className="text-xs text-foreground leading-relaxed font-medium">
                                  {parsed.overview}
                                </p>
                              )}
                              {parsed.keyPoints && parsed.keyPoints.length > 0 && (
                                <ul className="space-y-1.5">
                                  {parsed.keyPoints.map((point, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-secondary shrink-0" />
                                      <span className="text-xs text-foreground">{point}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function SummaryHistoryPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-secondary" />
      </div>
    }>
      <SummaryHistoryContent />
    </Suspense>
  );
}

