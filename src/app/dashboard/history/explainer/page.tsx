"use client";

import { useState, useEffect, Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MessageSquare, Clock, BookOpen, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { useSearchParams } from "next/navigation";

interface ExplainerRecord {
  id: string;
  prompt: string;
  response: string;
  createdAt: string;
}

function ExplainerHistoryContent() {
  const [history, setHistory] = useState<ExplainerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    fetch("/api/history/explainer")
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
          <div className="h-1.5 w-1.5 rounded-full bg-primary shadow-lg shadow-primary/20" />
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            Session Archive
          </span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-3xl font-black text-foreground tracking-tight"
        >
          Explainer <span className="text-primary">History</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground mt-1 text-xs sm:text-sm font-medium"
        >
          All your AI Explainer queries and responses, newest first.
        </motion.p>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : history.length === 0 ? (
        <Card className="medical-card">
          <CardContent className="p-8 flex flex-col items-center justify-center text-center gap-3">
            <div className="p-4 rounded-2xl bg-slate-50 border border-border">
              <MessageSquare className="w-8 h-8 text-muted-foreground/30" />
            </div>
            <h3 className="text-lg font-black text-foreground">No Explainer History</h3>
            <p className="text-muted-foreground font-medium text-xs max-w-xs">
              Start using AI Explainer to see your query history here.
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
            const isOpen = expanded === record.id;

            return (
              <motion.div
                key={record.id}
                id={record.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * i }}
              >
                <Card className={cn("medical-card overflow-hidden transition-all duration-300", isOpen && "border-primary/30 shadow-lg shadow-primary/5")}>
                  {/* Accordion Header */}
                  <button
                    onClick={() => toggle(record.id)}
                    className="w-full text-left"
                  >
                    <CardHeader className="p-4 pb-3">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "p-2 rounded-xl border shrink-0 transition-colors mt-0.5",
                          isOpen
                            ? "bg-primary/10 border-primary/20 text-primary"
                            : "bg-slate-50 border-border text-muted-foreground"
                        )}>
                          <MessageSquare className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn("text-xs sm:text-sm font-bold leading-snug", isOpen ? "text-foreground" : "text-foreground line-clamp-2")}>
                            {record.prompt}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                              {displayDate} • {displayTime}
                            </span>
                            <span className="ml-2 text-[9px] font-black text-primary/60 bg-primary/5 border border-primary/10 px-1.5 py-0.5 rounded-full">
                              #{i + 1}
                            </span>
                          </div>
                        </div>
                        <div className={cn(
                          "shrink-0 p-1 rounded-lg transition-colors",
                          isOpen ? "bg-primary/10 text-primary" : "text-muted-foreground"
                        )}>
                          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    </CardHeader>
                  </button>

                  {/* Accordion Body — Response */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <CardContent className="px-4 pb-4 pt-0">
                          <div className="border-t border-border pt-3">
                            <div className="flex items-center gap-2 mb-2">
                              <BookOpen className="w-3 h-3 text-primary" />
                              <span className="text-[9px] font-black uppercase tracking-widest text-primary">
                                AI Response
                              </span>
                            </div>
                            <div className="bg-slate-50 border border-border rounded-xl p-4 text-xs text-foreground leading-relaxed prose prose-sm max-w-none">
                              <ReactMarkdown>{record.response}</ReactMarkdown>
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

export default function ExplainerHistoryPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <ExplainerHistoryContent />
    </Suspense>
  );
}

