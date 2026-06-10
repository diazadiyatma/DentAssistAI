"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { HelpCircle, Clock, GraduationCap, ChevronDown, ChevronUp, Loader2, CheckCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

interface QuizRecord {
  id: string;
  topic: string;
  difficulty: string | null;
  questions: QuizQuestion[];
  createdAt: string;
}

export default function QuizHistoryPage() {
  const [history, setHistory] = useState<QuizRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/history/quiz")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setHistory(data.history);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id: string) => setExpanded((prev) => (prev === id ? null : id));

  const difficultyStyle = (level: string | null) => {
    if (!level) return "bg-slate-50 text-muted-foreground border-border";
    if (level === "Advanced") return "bg-rose-50 text-rose-600 border-rose-200";
    if (level === "Intermediate") return "bg-amber-50 text-amber-600 border-amber-200";
    return "bg-emerald-50 text-emerald-600 border-emerald-200";
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 mb-2"
        >
          <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            Session Archive
          </span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-black text-foreground tracking-tighter"
        >
          Quiz <span className="text-emerald-500">History</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground mt-3 text-lg font-medium"
        >
          All your AI Quiz Generator sessions with full question results, newest first.
        </motion.p>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        </div>
      ) : history.length === 0 ? (
        <Card className="medical-card">
          <CardContent className="p-16 flex flex-col items-center justify-center text-center gap-4">
            <div className="p-5 rounded-3xl bg-slate-50 border border-border">
              <GraduationCap className="w-10 h-10 text-muted-foreground/30" />
            </div>
            <h3 className="text-xl font-black text-foreground">No Quiz History</h3>
            <p className="text-muted-foreground font-medium max-w-xs">
              Start using AI Quiz Generator to see your sessions here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
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
            const isOpen = expanded === record.id;

            return (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * i }}
              >
                <Card className={cn("medical-card overflow-hidden transition-all duration-300", isOpen && "border-emerald-500/30 shadow-lg shadow-emerald-500/5")}>
                  {/* Accordion Header */}
                  <button onClick={() => toggle(record.id)} className="w-full text-left">
                    <CardHeader className="p-6 pb-5">
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          "p-2.5 rounded-xl border shrink-0 transition-colors mt-0.5",
                          isOpen
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600"
                            : "bg-slate-50 border-border text-muted-foreground"
                        )}>
                          <HelpCircle className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-black text-foreground">{record.topic}</p>
                            {record.difficulty && (
                              <span className={cn(
                                "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border",
                                difficultyStyle(record.difficulty)
                              )}>
                                {record.difficulty}
                              </span>
                            )}
                            {record.questions.length > 0 && (
                              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                {record.questions.length} questions
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                              {displayDate} • {displayTime}
                            </span>
                            <span className="ml-2 text-[10px] font-black text-emerald-600/60 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                              #{i + 1}
                            </span>
                          </div>
                        </div>
                        <div className={cn(
                          "shrink-0 p-1.5 rounded-lg transition-colors",
                          isOpen ? "bg-emerald-500/10 text-emerald-600" : "text-muted-foreground"
                        )}>
                          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>
                    </CardHeader>
                  </button>

                  {/* Accordion Body — Quiz Questions */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <CardContent className="px-6 pb-6 pt-0">
                          <div className="border-t border-border pt-5">
                            <div className="flex items-center gap-2 mb-4">
                              <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                                Quiz Questions
                              </span>
                            </div>

                            {record.questions.length === 0 ? (
                              <p className="text-sm text-muted-foreground font-medium italic">
                                Question data could not be parsed for this session.
                              </p>
                            ) : (
                              <div className="space-y-6">
                                {record.questions.map((q, qi) => (
                                  <div key={qi} className="space-y-3">
                                    <p className="text-sm font-bold text-foreground">
                                      <span className="text-emerald-600 mr-2">Q{qi + 1}.</span>
                                      {q.question}
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                      {q.options.map((opt, oi) => (
                                        <div
                                          key={oi}
                                          className={cn(
                                            "flex items-center gap-3 p-3 rounded-xl border text-sm font-medium",
                                            oi === q.correct
                                              ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                                              : "bg-slate-50 border-border text-muted-foreground"
                                          )}
                                        >
                                          <div className={cn(
                                            "h-6 w-6 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0",
                                            oi === q.correct
                                              ? "bg-emerald-500 text-white"
                                              : "bg-white border border-border text-muted-foreground"
                                          )}>
                                            {String.fromCharCode(65 + oi)}
                                          </div>
                                          <span className="flex-1">{opt}</span>
                                          {oi === q.correct && (
                                            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
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
