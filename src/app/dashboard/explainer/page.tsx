"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useSession as useAuthSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, Sparkles, BrainCircuit, Bot, User, Trash2, Cpu, Zap, Microscope } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

export default function AIExplainerPage() {
  const { data: session } = useAuthSession();
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Initialize greeting once session is loaded
  useEffect(() => {
    if (session && messages.length === 0) {
      setMessages([
        {
          id: "1",
          role: "ai",
          content: `Hello ${session.user?.name ?? "Doctor"}. I am your specialized Dental AI Assistant. I can explain complex anatomical structures, pharmacological interactions, or clinical procedures. What would you like to explore today?`,
          timestamp: new Date(),
        },
      ]);
    }
  }, [session]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userMessage.content,
          type: "explainer",
        }),
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to fetch from Gemini");

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: data.text,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: `Error: ${error.message}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 mb-1"
          >
            <Cpu className="w-4 h-4 text-secondary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-secondary">Neural Engine Active</span>
          </motion.div>
          <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tighter flex items-center gap-3">
            Dental <span className="text-secondary">Explainer</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
           <Button variant="outline" size="sm" className="bg-white border-border text-muted-foreground rounded-xl hover:bg-destructive/10 hover:text-destructive transition-all" onClick={() => setMessages([messages[0]])}>
             <Trash2 className="w-4 h-4 mr-2" /> Clear Session
           </Button>
           <div className="h-8 w-px bg-border mx-1" />
           <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary/10 border border-secondary/20">
              <Zap className="w-3.5 h-3.5 text-secondary" />
              <span className="text-[10px] font-black text-secondary">Ultra Mode</span>
           </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0 bg-white border border-border rounded-[2.5rem] relative overflow-hidden shadow-xl">
        <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-white/80 to-transparent pointer-events-none z-10" />
        
        {/* Messages Container */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar scroll-smooth"
        >
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: "circOut" }}
                className={cn(
                  "flex items-start gap-4 max-w-4xl",
                  message.role === "user" ? "ml-auto flex-row-reverse text-right" : "mr-auto"
                )}
              >
                <div className={cn(
                  "h-10 w-10 shrink-0 rounded-2xl flex items-center justify-center border transition-all duration-500",
                  message.role === "ai" 
                    ? "bg-secondary/10 border-secondary/20 text-secondary" 
                    : "bg-slate-50 border-border text-foreground"
                )}>
                  {message.role === "ai" ? <Bot className="h-6 w-6" /> : <User className="h-6 w-6" />}
                </div>
                
                <div className="flex flex-col gap-1">
                  <div
  className={cn(
    "px-6 py-4 rounded-[1.5rem] text-sm leading-relaxed relative overflow-hidden",
    message.role === "ai"
      ? "bg-slate-50 text-foreground border border-border"
      : "bg-primary text-white shadow-lg shadow-primary/20"
  )}
>
  {message.role === "ai" && (
    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
      <Sparkles className="w-12 h-12" />
    </div>
  )}

  {message.role === "ai" ? (
    <ReactMarkdown>
      {message.content}
    </ReactMarkdown>
  ) : (
    message.content
  )}
</div>
                  <span className="text-[10px] font-mono text-muted-foreground px-2">
                    {mounted ? message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-4"
            >
              <div className="h-10 w-10 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center animate-pulse">
                <BrainCircuit className="h-6 w-6 text-secondary" />
              </div>
              <div className="bg-slate-50 border border-border px-6 py-4 rounded-[1.5rem] flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-secondary/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 bg-secondary/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 bg-secondary/40 rounded-full animate-bounce" />
                <span className="text-xs font-black text-muted-foreground ml-2 uppercase tracking-widest">Neural Processing</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-slate-50 border-t border-border relative">
          <div className="max-w-4xl mx-auto relative flex items-end gap-3">
             <div className="flex-1 relative group">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Inquire about endodontic procedures, pharmacology, or clinical data..."
                  className="min-h-[60px] max-h-[200px] w-full bg-white border-border rounded-2xl px-6 py-4 pr-16 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/50 focus-visible:bg-white resize-none transition-all no-scrollbar"
                />
                <div className="absolute right-4 bottom-4 flex gap-2">
                   <div className="text-[10px] font-mono text-muted-foreground self-center hidden sm:block">Shift + Enter for new line</div>
                </div>
             </div>
             <Button 
               onClick={handleSend}
               disabled={!input.trim() || isLoading}
               className="h-[60px] w-[60px] rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all active:scale-95 group shrink-0"
             >
               <Send className={cn("h-6 w-6 transition-transform", !input.trim() ? "" : "group-hover:translate-x-1 group-hover:-translate-y-1")} />
             </Button>
          </div>
          
          <div className="flex justify-center gap-4 mt-4">
             {['Anatomy', 'Pathology', 'Radiology', 'Surgery'].map(topic => (
               <button 
                 key={topic}
                 onClick={() => setInput(`Explain the ${topic.toLowerCase()} aspects of...`)}
                 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
               >
                 #{topic}
               </button>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
