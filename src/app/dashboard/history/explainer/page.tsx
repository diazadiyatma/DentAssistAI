"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MessageSquare, Clock, BookOpen, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface ExplainerRecord {
  id: string;
  prompt: string;
  response: string;
  createdAt: string;
}

export default function ExplainerHistoryPage() {
  const [history, setHistory] = useState<ExplainerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/history/explainer")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setHistory(data.history);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id: string) => setExpanded((prev) => (prev === id ? null : id));

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 mb-2"
        >
          <div className="h-2 w-2 rounded-full bg-primary shadow-lg shadow-primary/20" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            Session Archive
          </span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-black text-foreground tracking-tighter"
        >
          Explainer <span className="text-primary">History</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground mt-3 text-lg font-medium"
        >
          All your AI Explainer queries and responses, newest first.
        </motion.p>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : history.length === 0 ? (
        <Card className="medical-card">
          <CardContent className="p-16 flex flex-col items-center justify-center text-center gap-4">
            <div className="p-5 rounded-3xl bg-slate-50 border border-border">
              <MessageSquare className="w-10 h-10 text-muted-foreground/30" />
            </div>
            <h3 className="text-xl font-black text-foreground">No Explainer History</h3>
            <p className="text-muted-foreground font-medium max-w-xs">
              Start using AI Explainer to see your query history here.
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
                <Card className={cn("medical-card overflow-hidden transition-all duration-300", isOpen && "border-primary/30 shadow-lg shadow-primary/5")}>
                  {/* Accordion Header */}
                  <button
                    onClick={() => toggle(record.id)}
                    className="w-full text-left"
                  >
                    <CardHeader className="p-6 pb-5">
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          "p-2.5 rounded-xl border shrink-0 transition-colors mt-0.5",
                          isOpen
                            ? "bg-primary/10 border-primary/20 text-primary"
                            : "bg-slate-50 border-border text-muted-foreground"
                        )}>
                          <MessageSquare className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn("text-sm font-bold leading-snug", isOpen ? "text-foreground" : "text-foreground line-clamp-2")}>
                            {record.prompt}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                              {displayDate} • {displayTime}
                            </span>
                            <span className="ml-2 text-[10px] font-black text-primary/60 bg-primary/5 border border-primary/10 px-2 py-0.5 rounded-full">
                              #{i + 1}
                            </span>
                          </div>
                        </div>
                        <div className={cn(
                          "shrink-0 p-1.5 rounded-lg transition-colors",
                          isOpen ? "bg-primary/10 text-primary" : "text-muted-foreground"
                        )}>
                          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
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
                        <CardContent className="px-6 pb-6 pt-0">
                          <div className="border-t border-border pt-5">
                            <div className="flex items-center gap-2 mb-3">
                              <BookOpen className="w-3.5 h-3.5 text-primary" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                                AI Response
                              </span>
                            </div>
                            <div className="bg-slate-50 border border-border rounded-2xl p-5 text-sm text-foreground leading-relaxed prose prose-sm max-w-none">
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
