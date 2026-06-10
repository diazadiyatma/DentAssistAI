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
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20"
          >
            <Activity className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Clinical Mode Active</span>
          </motion.div>
          <h1 className="text-4xl font-black text-foreground tracking-tighter flex items-center gap-4">
            Oral Health <span className="text-primary">Assistant</span>
          </h1>
          <p className="text-muted-foreground max-w-xl text-lg font-medium">
            Advanced diagnostic-support education. Get general guidance for dental symptoms and anatomical inquiries.
          </p>
        </div>
        
        <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-8 font-black shadow-lg shadow-primary/20 transition-all h-14 group">
          <Zap className="w-5 h-5 mr-2 group-hover:fill-white transition-all" /> Launch Health Check
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {assistantCategories.map((category, i) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <Card className="medical-card h-full hover:border-primary/20 transition-all group cursor-pointer relative overflow-hidden shadow-md">
               <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity", category.bg)} />
               <CardHeader>
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300", category.bg, category.color, "group-hover:scale-110")}>
                  <category.icon className="h-7 w-7" />
                </div>
                <CardTitle className="text-foreground text-xl font-black tracking-tight">{category.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground text-sm leading-relaxed font-medium">
                  {category.description}
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="medical-card h-full overflow-hidden group shadow-xl">
            <CardHeader className="border-b border-border pb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                   <Info className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-foreground text-xl font-black">Educational Guidelines</CardTitle>
                  <CardDescription className="text-muted-foreground font-medium">Clinical consensus for common oral inquiries.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {[
                { q: "What causes acute tooth sensitivity?", a: "Often caused by exposed dentin, worn enamel, or gingival recession. AI analysis suggests correlating this with thermal stimuli tests." },
                { q: "Effective treatment for gingivitis?", a: "Primary focus on scaling, root planing, and optimized plaque control. AI-driven monitoring can track tissue recovery phases." },
                { q: "Impact of systemic diseases on oral health?", a: "Diabetes and cardiovascular health have strong bi-directional links with periodontal status. Cross-system data analysis is recommended." },
              ].map((item, i) => (
                <div key={i} className="bg-slate-50 border border-border p-6 rounded-2xl hover:bg-white transition-all cursor-default relative group/item overflow-hidden shadow-sm">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover/item:opacity-100 transition-opacity" />
                  <h4 className="font-black text-foreground mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    {item.q}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed font-medium pl-6">{item.a}</p>
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
          <Card className="bg-white border-border h-full relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <AlertCircle className="w-48 h-48 text-primary" />
            </div>
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center mb-4">
                 <AlertCircle className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-primary text-xl font-black uppercase tracking-tight italic">Medical Disclaimer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div className="p-4 rounded-2xl bg-slate-50 border border-border">
                <p className="text-sm text-foreground leading-relaxed font-bold italic uppercase tracking-tighter">
                  "DentAssist AI provides educational information only. It is not a substitute for professional medical advice, diagnosis, or treatment."
                </p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                Always seek the advice of your dentist or other qualified health provider with any questions you may have regarding a medical condition. 
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                Never disregard professional medical advice or delay in seeking it because of something you have read on this platform.
              </p>
              
              <div className="pt-4">
                <Button variant="outline" className="w-full border-border text-muted-foreground hover:bg-slate-50 hover:text-foreground rounded-xl font-black h-12 uppercase tracking-widest text-[10px] transition-all">
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
