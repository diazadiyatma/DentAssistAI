"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HelpCircle, Brain, Play, CheckCircle, XCircle, Zap, Trophy, Timer, Target, Sparkles, ChevronRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Question {
  question: string;
  options: string[];
  correct: number;
}

export default function QuizGeneratorPage() {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ message: string; type: "error" | "info" | "success" } | null>(null);

  const showToast = (message: string, type: "error" | "info" | "success" = "info") => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage(current => current?.message === message ? null : current);
    }, 6000);
  };

  const loadMockQuestions = () => {
    setQuizQuestions([
      {
        question: `What is the primary cause of dental caries related to ${topic || 'dentistry'}?`,
        options: ["Streptococcus mutans", "Lactobacillus", "Staphylococcus aureus", "Porphyromonas gingivalis"],
        correct: 0
      },
      {
        question: `Which layer of the tooth is the hardest substance in the human body?`,
        options: ["Dentin", "Cementum", "Enamel", "Pulp"],
        correct: 2
      },
      {
        question: `In clinical ${topic || 'practice'}, what is the recommended frequency for professional dental cleanings?`,
        options: ["Every 2 years", "Every 6 months", "Once a month", "Only when pain occurs"],
        correct: 1
      },
      {
        question: `Which of these is a common symptom of gingivitis?`,
        options: ["Tooth whitening", "Increased appetite", "Bleeding gums", "Improved breath"],
        correct: 2
      },
      {
        question: `What does the 'AI' in DentAssist AI stands for?`,
        options: ["Anatomical Insight", "Artificial Intelligence", "Advanced Imaging", "Automated Inspection"],
        correct: 1
      }
    ]);
    setIsQuizActive(true);
    setCurrentQuestion(0);
    setScore(0);
    setIsFinished(false);
    setSelectedAnswer(null);
    setIsAnswerChecked(false);
  };

  const startQuiz = async () => {
  if (!topic || isLoading) return;

  setIsLoading(true);
  setQuizQuestions([]);

  try {
    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: `You are a specialized Dental AI Assistant. Generate a ${difficulty} level multiple-choice quiz about ${topic}.
Create exactly 5 concise questions.
Return ONLY a valid JSON array of objects with this exact structure, no markdown formatting or backticks:
[
  {
    "question": "The question text?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 0
  }
]
The 'correct' field must be the 0-based index of the correct option (0 to 3).`,
        type: "quiz",
      }),
    });

    let data: any;
    try {
      data = await res.json();
    } catch {
      // Non‑JSON response (e.g., HTML error page)
      showToast("Unexpected response from server. Loaded fallback questions.", "error");
      loadMockQuestions();
      return;
    }

    if (!res.ok) {
      showToast(data.error || "Failed to generate quiz", "error");
      loadMockQuestions();
      return;
    }

    if (data.fallback) {
      showToast("Gemini API quota reached. Loaded high-quality fallback questions for your study session.", "info");
      loadMockQuestions();
      return;
    }

    let questions: Question[] | null = null;
    try {
      const jsonStr = typeof data.text === "string" ? data.text.replace(/```json\n?|\n?```/g, "").trim() : "";
      questions = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError, data?.text);
    }

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      showToast("Formatting anomaly detected in AI output. Loaded fallback questions.", "info");
      loadMockQuestions();
      return;
    }

    const validatedQuestions = questions.map((q: any) => ({
      question: typeof q.question === "string" ? q.question : "Dental Assessment Question",
      options: Array.isArray(q.options) && q.options.length >= 2 ? q.options : ["Option A", "Option B", "Option C", "Option D"],
      correct: typeof q.correct === "number" && q.correct >= 0 && q.correct < (q.options?.length || 4) ? q.correct : 0,
    }));

    setQuizQuestions(validatedQuestions);
    setIsQuizActive(true);
    setCurrentQuestion(0);
    setScore(0);
    setIsFinished(false);
    setSelectedAnswer(null);
    setIsAnswerChecked(false);
  } catch (error: any) {
    console.error("Error generating quiz:", error);
    showToast(error.message || "Failed to generate quiz. Loaded fallback questions.", "error");
    loadMockQuestions();
  } finally {
    setIsLoading(false);
  }
};

  const handleAnswer = (index: number) => {
    if (isAnswerChecked) return;
    setSelectedAnswer(index);
    setIsAnswerChecked(true);
    
    if (index === quizQuestions[currentQuestion].correct) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerChecked(false);
    } else {
      setIsFinished(true);
    }
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20"
          >
            <Target className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Knowledge Assessment v2.0</span>
          </motion.div>
          <h1 className="text-2xl md:text-4xl font-black text-foreground tracking-tighter flex items-center gap-4">
            AI Quiz <span className="text-primary">Generator</span>
          </h1>
          <p className="text-muted-foreground max-w-xl text-lg font-medium">
            Test your clinical mastery with adaptive, AI-generated questions tailored to your specialization.
          </p>
        </div>
      </div>

      {!isQuizActive ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="max-w-3xl medical-card shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-medical-gradient" />
            <CardHeader className="p-10 pb-6">
              <CardTitle className="text-foreground text-2xl font-black">Configure Assessment</CardTitle>
              <CardDescription className="text-muted-foreground font-medium">Define your topic and difficulty to initialize the AI engine.</CardDescription>
            </CardHeader>
            <CardContent className="p-10 pt-0 space-y-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Dental Specialization / Topic</label>
                <div className="relative group">
                  <Brain className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input 
                    placeholder="e.g., Clinical Endodontics, Oral Histology, Pharmacology..." 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="bg-slate-50 border-border text-foreground h-16 pl-12 rounded-2xl focus-visible:ring-primary/50 transition-all text-lg font-medium placeholder:text-muted-foreground/40"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Complexity Matrix</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {["Beginner", "Intermediate", "Advanced"].map((level) => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={cn(
                        "h-16 rounded-2xl text-sm font-black uppercase tracking-widest transition-all border flex items-center justify-center gap-3 active:scale-95",
                        difficulty === level 
                          ? "bg-primary/5 border-primary/20 text-primary shadow-sm" 
                          : "bg-slate-50 border-border text-muted-foreground hover:bg-white hover:text-foreground"
                      )}
                    >
                      <Zap className={cn("w-4 h-4", difficulty === level ? "fill-primary" : "fill-transparent")} />
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-10 pt-0">
              <Button 
                onClick={startQuiz}
                disabled={!topic || isLoading}
                className="w-full h-16 bg-primary hover:bg-primary/90 text-white font-black text-xl rounded-2xl shadow-lg shadow-primary/20 transition-all group"
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin mr-3" />
                ) : (
                  <Play className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                )}
                {isLoading ? "Generating Matrix..." : "Initialize AI Assessment"}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ) : isFinished ? (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="max-w-xl mx-auto medical-card text-center p-12 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-medical-gradient animate-pulse" />
            <CardContent className="space-y-10">
              <div className="w-32 h-32 mx-auto bg-primary/5 border border-primary/10 rounded-[2.5rem] flex items-center justify-center shadow-lg shadow-primary/5">
                <Trophy className="w-16 h-16 text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="text-4xl font-black text-foreground tracking-tighter uppercase">Assessment Complete</h2>
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">Topic: {topic} • Level: {difficulty}</p>
              </div>
              <div className="relative inline-block">
                <div className="text-8xl font-black text-primary leading-none">
                   {score}<span className="text-4xl text-slate-300">/{quizQuestions.length}</span>
                </div>
                <div className="absolute -top-6 -right-6">
                   <Sparkles className="w-8 h-8 text-primary animate-bounce" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-6 rounded-3xl bg-slate-50 border border-border">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Accuracy</p>
                    <p className="text-2xl font-black text-foreground">{Math.round((score/quizQuestions.length)*100)}%</p>
                 </div>
                 <div className="p-6 rounded-3xl bg-slate-50 border border-border">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Time Taken</p>
                    <p className="text-2xl font-black text-foreground">Analysis... </p>
                 </div>
              </div>

              <Button 
                onClick={() => setIsQuizActive(false)}
                className="w-full h-16 bg-primary text-white hover:bg-primary/90 font-black text-lg rounded-2xl shadow-lg transition-all active:scale-95"
              >
                Exit Assessment Matrix
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : !quizQuestions.length || !quizQuestions[currentQuestion] ? (
        <div className="max-w-4xl mx-auto flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="flex justify-between items-center px-4">
            <div className="flex items-center gap-6">
               <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Node Status</span>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-sm font-bold text-foreground uppercase tracking-tighter">Processing...</span>
                  </div>
               </div>
               <div className="h-8 w-px bg-border" />
               <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Assessment Vector</span>
                  <span className="text-sm font-bold text-foreground uppercase tracking-tighter">Question {currentQuestion + 1} of {quizQuestions.length}</span>
               </div>
            </div>
            
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white border border-border shadow-sm">
               <Timer className="w-4 h-4 text-primary" />
               <span className="text-sm font-black text-foreground font-mono">LIVE</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <Card className="medical-card shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                   <HelpCircle className="w-64 h-64 text-primary" />
                </div>
                <CardHeader className="p-12 pb-8">
                  <CardTitle className="text-3xl md:text-4xl font-black text-foreground leading-[1.2] tracking-tight">
                    {quizQuestions[currentQuestion].question}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-12 pt-0 space-y-4">
                  {quizQuestions[currentQuestion].options.map((opt, idx) => {
                    const isCorrect = idx === quizQuestions[currentQuestion].correct;
                    const isSelected = selectedAnswer === idx;
                    
                    let btnClass = "bg-white border-border text-muted-foreground hover:bg-slate-50 hover:text-foreground shadow-sm";
                    if (isAnswerChecked) {
                      if (isCorrect) btnClass = "bg-emerald-50 border-emerald-500 text-emerald-600 shadow-sm";
                      else if (isSelected) btnClass = "bg-rose-50 border-rose-500 text-rose-600 shadow-sm";
                    } else if (isSelected) {
                      btnClass = "bg-primary/5 border-primary/50 text-primary";
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        disabled={isAnswerChecked}
                        className={cn(
                          "w-full text-left p-6 rounded-[1.5rem] border transition-all flex justify-between items-center group/opt active:scale-[0.99]",
                          btnClass
                        )}
                      >
                        <div className="flex items-center gap-4">
                           <div className={cn(
                             "h-10 w-10 rounded-xl flex items-center justify-center font-black transition-all",
                             isAnswerChecked && isCorrect ? "bg-emerald-500 text-white" : "bg-slate-50 border border-border group-hover/opt:border-primary/20"
                           )}>
                              {String.fromCharCode(65 + idx)}
                           </div>
                           <span className="text-xl font-bold">{opt}</span>
                        </div>
                        {isAnswerChecked && isCorrect && <CheckCircle className="w-6 h-6 text-emerald-500" />}
                        {isAnswerChecked && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-rose-500" />}
                      </button>
                    );
                  })}
                </CardContent>
                <CardFooter className="p-12 pt-0 justify-end border-t border-border bg-slate-50/50">
                  {isAnswerChecked && (
                    <Button 
                      onClick={nextQuestion}
                      className="bg-primary hover:bg-primary/90 text-white font-black px-10 h-14 rounded-2xl shadow-lg transition-all active:scale-95 text-lg group"
                    >
                      {currentQuestion < quizQuestions.length - 1 ? "Next Analysis Vector" : "Finalize Results"}
                      <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Elegant Custom Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-8 right-8 z-50 max-w-md bg-white border border-border rounded-2xl shadow-2xl p-4 flex items-start gap-3"
          >
            <div className={cn(
              "p-2 rounded-xl shrink-0",
              toastMessage.type === "error" ? "bg-rose-50 text-rose-500" :
              toastMessage.type === "success" ? "bg-emerald-50 text-emerald-500" :
              "bg-blue-50 text-blue-500"
            )}>
              {toastMessage.type === "error" ? (
                <XCircle className="w-5 h-5" />
              ) : toastMessage.type === "success" ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-xs font-black uppercase tracking-wider text-foreground">
                {toastMessage.type === "error" ? "System Error" :
                 toastMessage.type === "success" ? "System Success" :
                 "AI System Status"}
              </p>
              <p className="text-xs text-muted-foreground font-medium leading-relaxed">{toastMessage.message}</p>
            </div>
            <button 
              onClick={() => setToastMessage(null)}
              className="text-xs font-bold text-muted-foreground hover:text-foreground self-center ml-2 p-1"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
