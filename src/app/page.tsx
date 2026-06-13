"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Sparkles, BrainCircuit, FileText, HelpCircle, Stethoscope, ArrowRight, PlayCircle, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "AI Dental Topic Explainer",
    description: "Complex dental terms simplified by our advanced AI, perfect for students and professionals.",
    icon: BrainCircuit,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    title: "Smart Summary Generator",
    description: "Upload long dental papers or lecture notes and get instant, structured summaries.",
    icon: FileText,
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
  {
    title: "AI Quiz Generator",
    description: "Test your knowledge with adaptive quizzes generated on the fly from any topic.",
    icon: HelpCircle,
    color: "text-primary",
    bg: "bg-primary/5",
  },
];

function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-secondary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-1/4 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px]" />
      
      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)]" />

      {/* Floating particles */}
      {mounted && (
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-primary/20 rounded-full"
              initial={{
                top: Math.random() * 100 + "%",
                left: Math.random() * 100 + "%",
                scale: Math.random() * 0.5 + 0.5,
              }}
              animate={{
                y: [0, -100, -200],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 15,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 10,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function LandingPage() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background overflow-hidden selection:bg-primary/20">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full pt-32 pb-24 md:pt-48 md:pb-40 flex flex-col items-center justify-center min-h-screen">
          <AnimatedBackground />

          <div className="container mx-auto relative z-10 px-4 md:px-6">
            <div className="flex flex-col items-center text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="inline-flex items-center rounded-full border border-primary/10 bg-primary/5 px-4 py-1.5 text-[10px] font-bold text-primary backdrop-blur-md mb-8 uppercase tracking-[0.2em]"
              >
                <Sparkles className="mr-2 h-3.5 w-3.5 text-primary" />
                <span>Introducing DentAssist AI 2.0</span>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="space-y-6 max-w-4xl"
              >
                <h1 className="text-5xl font-black tracking-tighter text-foreground sm:text-6xl md:text-7xl lg:text-[5.5rem] leading-[1] md:leading-[1]">
                  Smarter Dental Learning <br className="hidden sm:block" />
                  <span className="text-primary italic">
                    Powered by AI
                  </span>
                </h1>
                <p className="mx-auto max-w-[700px] text-lg md:text-xl text-muted-foreground leading-relaxed font-normal tracking-wide">
                  Elevate your dental practice and education. DentAssist AI simplifies complex topics, summarizes papers instantly, and creates adaptive quizzes to test your mastery.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto mt-12"
              >
                <Link href="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto h-14 px-10 bg-primary hover:bg-primary/90 text-white font-black text-xs uppercase tracking-[0.2em] rounded-full shadow-lg shadow-primary/20 transition-all hover:scale-105 group">
                    Start Exploring <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button 
                  onClick={() => setIsVideoOpen(true)}
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto h-14 px-10 rounded-full border-border bg-white dark:bg-slate-900 text-muted-foreground hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-xs uppercase tracking-[0.2em] transition-all cursor-pointer"
                >
                  <PlayCircle className="mr-2 h-4 w-4 text-muted-foreground" /> View Demo
                </Button>
              </motion.div>
            </div>
            
            {/* Dashboard Preview Medical Card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="mt-20 relative mx-auto max-w-5xl rounded-2xl border border-border bg-white dark:bg-slate-900 p-2 shadow-2xl shadow-primary/5 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
              <img 
                src="/foto%20dental%20assist%20ai.jpg" 
                alt="Dashboard Preview Mock" 
                className="rounded-xl border border-border opacity-90 object-cover h-[300px] md:h-[500px] w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-24 md:py-32 bg-white dark:bg-slate-950 relative border-t border-border">
          <div className="container mx-auto relative px-4 md:px-6">
            <div className="text-center space-y-4 mb-20">
              <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tighter uppercase italic">Supercharge Your Learning</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-medium tracking-wide">
                Our suite of AI tools is designed specifically for dental students, professionals, and patients.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto justify-center">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="medical-card p-2 hover:border-primary/30 transition-all duration-500 h-full group">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 ${feature.bg}`}>
                        <feature.icon className={`h-6 w-6 ${feature.color}`} />
                      </div>
                      <CardTitle className="text-lg font-black text-foreground uppercase tracking-wider">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-muted-foreground text-sm leading-relaxed font-medium">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-32 relative overflow-hidden bg-slate-50 dark:bg-slate-900/50 border-t border-border">
          <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          
          <div className="container mx-auto relative z-10 px-4 md:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto space-y-10"
            >
              <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter leading-tight uppercase italic">
                Ready to transform your <br /> dental education?
              </h2>
              <p className="text-xl text-muted-foreground font-medium tracking-wide max-w-2xl mx-auto">
                Join thousands of students and professionals using DentAssist AI today.
              </p>
              <Link href="/dashboard" className="inline-block pt-4">
                <Button size="lg" className="h-16 px-12 bg-primary text-white hover:bg-primary/90 font-black text-sm uppercase tracking-[0.2em] rounded-full shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                  Get Started for Free
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Video Demo Modal */}
        <AnimatePresence>
          {isVideoOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsVideoOpen(false)}
                className="absolute inset-0 cursor-pointer"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="relative w-full max-w-4xl bg-card border border-border rounded-2xl overflow-hidden shadow-2xl z-10"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20">
                  <span className="text-sm font-bold uppercase tracking-[0.15em] text-muted-foreground flex items-center">
                    <PlayCircle className="mr-2 h-4 w-4 text-primary" /> DentAssist AI Demo Video
                  </span>
                  <button
                    onClick={() => setIsVideoOpen(false)}
                    className="rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-all active:scale-90"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Video Body */}
                <div className="relative aspect-video bg-black flex items-center justify-center">
                  <video
                    className="w-full h-full"
                    controls
                    autoPlay
                    src="/demo.mp4"
                    poster="/foto%20dental%20assist%20ai.jpg"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
      
      <Footer />
    </div>
  );
}