"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Stethoscope, AlertCircle, Info, CheckCircle2, HeartPulse, Activity, ShieldAlert, Microscope, Search, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const assistantCategories = [
  {
    title: "Symptom Analysis",
    description: "Identify potential causes for common dental symptoms like sensitivity or pain.",
    icon: Search,
    color: "text-primary",
    bg: "bg-primary/5",
  },
  {
    title: "Preventative Care",
    description: "AI-driven guidance for maintaining optimal long-term oral hygiene.",
    icon: ShieldAlert,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    title: "Clinical Procedures",
    description: "Educational breakdowns of common dental surgeries and treatments.",
    icon: Microscope,
    color: "text-secondary",
    bg: "bg-secondary/5",
  },
  {
    title: "Pediatric Oral Health",
    description: "Specialized insights for developmental dental health in children.",
    icon: HeartPulse,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  }
];

export default function OralAssistantPage() {
  return (
    <div className="space-y-4 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="space-y-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20"
          >
            <Activity className="w-3 h-3 text-primary" />
            <span className="text-[9px] font-black uppercase tracking-widest text-primary">Clinical Mode Active</span>
          </motion.div>
          <h1 className="text-xl md:text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
            Oral Health <span className="text-primary">Assistant</span>
          </h1>
          <p className="text-muted-foreground max-w-xl text-xs sm:text-sm font-medium">
            Advanced diagnostic-support education. Get general guidance for dental symptoms and anatomical inquiries.
          </p>
        </div>
        
        <Button size="default" className="bg-primary hover:bg-primary/90 text-white rounded-xl px-4 font-black shadow-md shadow-primary/20 transition-all h-9 text-xs group">
          <Zap className="w-3.5 h-3.5 mr-1.5 group-hover:fill-white transition-all" /> Launch Health Check
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {assistantCategories.map((category, i) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <Card className="medical-card h-full hover:border-primary/20 transition-all group cursor-pointer relative overflow-hidden shadow-sm">
               <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity", category.bg)} />
               <CardHeader className="p-3 sm:p-4 pb-1.5 sm:pb-2">
                <div className={cn("w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center mb-2.5 transition-all duration-300", category.bg, category.color, "group-hover:scale-110")}>
                  <category.icon className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                </div>
                <CardTitle className="text-foreground text-xs sm:text-sm md:text-base font-black tracking-tight">{category.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 pt-0 sm:pt-0">
                <CardDescription className="text-muted-foreground text-[9px] sm:text-[10px] md:text-xs leading-relaxed font-medium">
                  {category.description}
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="medical-card h-full overflow-hidden group shadow-md">
            <CardHeader className="border-b border-border p-4 pb-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Info className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-foreground text-sm sm:text-base font-black">Educational Guidelines</CardTitle>
                  <CardDescription className="text-muted-foreground font-medium text-[10px]">Clinical consensus for common oral inquiries.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {[
                { q: "What causes acute tooth sensitivity?", a: "Often caused by exposed dentin, worn enamel, or gingival recession. AI analysis suggests correlating this with thermal stimuli tests." },
                { q: "Effective treatment for gingivitis?", a: "Primary focus on scaling, root planing, and optimized plaque control. AI-driven monitoring can track tissue recovery phases." },
                { q: "Impact of systemic diseases on oral health?", a: "Diabetes and cardiovascular health have strong bi-directional links with periodontal status. Cross-system data analysis is recommended." },
              ].map((item, i) => (
                <div key={i} className="bg-slate-50 border border-border p-3 rounded-xl hover:bg-white transition-all cursor-default relative group/item overflow-hidden shadow-sm">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover/item:opacity-100 transition-opacity" />
                  <h4 className="font-black text-[11px] sm:text-xs text-foreground mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    {item.q}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed font-medium pl-4.5">{item.a}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="bg-white border-border h-full relative overflow-hidden shadow-md">
            <div className="absolute top-0 right-0 p-4 opacity-5">
               <AlertCircle className="w-24 h-24 text-primary" />
            </div>
            <CardHeader className="p-4">
              <div className="w-8 h-8 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center mb-2">
                 <AlertCircle className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-primary text-xs sm:text-sm font-black uppercase tracking-tight italic">Medical Disclaimer</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-3 relative z-10">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-border">
                <p className="text-[11px] sm:text-xs text-foreground leading-relaxed font-bold italic uppercase tracking-tighter">
                  "DentAssist AI provides educational information only. It is not a substitute for professional medical advice, diagnosis, or treatment."
                </p>
              </div>
              <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed font-medium">
                Always seek the advice of your dentist or other qualified health provider with any questions you may have regarding a medical condition. 
              </p>
              <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed font-medium">
                Never disregard professional medical advice or delay in seeking it because of something you have read on this platform.
              </p>
              
              <div className="pt-1">
                <Button variant="outline" className="w-full border-border text-muted-foreground hover:bg-slate-50 hover:text-foreground rounded-lg font-black h-9 uppercase tracking-widest text-[8px] sm:text-[9px] transition-all">
                  Read Full Terms
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
