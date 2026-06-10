"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BrainCircuit, FileText, HelpCircle, Activity, TrendingUp, Users, MessageSquare, ArrowUpRight, Target, Clock, Star, BookOpen, ScrollText, GraduationCap } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { useSession as useAuthSession } from "next-auth/react";

const usageData = [
  { day: 'Mon', queries: 120, accuracy: 88 },
  { day: 'Tue', queries: 180, accuracy: 92 },
  { day: 'Wed', queries: 150, accuracy: 90 },
  { day: 'Thu', queries: 250, accuracy: 94 },
  { day: 'Fri', queries: 210, accuracy: 91 },
  { day: 'Sat', queries: 90, accuracy: 95 },
  { day: 'Sun', queries: 110, accuracy: 93 },
];

const topicData = [
  { name: 'Endodontics', value: 45, color: '#2D34D2' },
  { name: 'Periodontics', value: 30, color: '#7B61FF' },
  { name: 'Orthodontics', value: 25, color: '#3B82F6' },
  { name: 'Oral Surgery', value: 20, color: '#78D32B' },
];

export default function DashboardOverview() {
  const { data: session } = useAuthSession();
  const [displayName, setDisplayName] = useState<string>("");
  
  // Load name from localStorage (set by settings page), fall back to session
  useEffect(() => {
    if (!session?.user) return;
    const storageKey = `dentassist_profile_${session.user.id}`;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.fullName) {
          setDisplayName(parsed.fullName);
          return;
        }
      }
    } catch {}
    setDisplayName(session.user.name ?? "Doctor");
  }, [session]);
  
  const [statsData, setStatsData] = useState({
    explainerCount: 0,
    summaryCount: 0,
    activityCount: 0,
    quizCount: 0,
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [explainerHistory, setExplainerHistory] = useState<any[]>([]);
  const [summaryHistory, setSummaryHistory] = useState<any[]>([]);
  const [quizHistory, setQuizHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [statsRes, explainerRes, summaryRes, quizRes] = await Promise.all([
          fetch("/api/stats"),
          fetch("/api/explainer-history"),
          fetch("/api/summary-history"),
          fetch("/api/quiz-history"),
        ]);
        const statsData = await statsRes.json();
        const explainerData = await explainerRes.json();
        const summaryData = await summaryRes.json();
        const quizData = await quizRes.json();

        if (statsData.success) {
          setStatsData(statsData.stats);
          setRecentActivities(statsData.recentActivities || []);
        }
        if (explainerData.success) setExplainerHistory(explainerData.history || []);
        if (summaryData.success) setSummaryHistory(summaryData.history || []);
        if (quizData.success) setQuizHistory(quizData.history || []);
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const stats = [
    { 
      name: "Total AI Explainer Usage", 
      value: loading ? "..." : statsData.explainerCount.toString(), 
      change: "", 
      icon: BrainCircuit, 
      color: "text-primary", 
      glow: "",
      gradient: "from-primary/5 to-transparent"
    },
    { 
      name: "Total AI Summary Usage", 
      value: loading ? "..." : statsData.summaryCount.toString(), 
      change: "", 
      icon: FileText, 
      color: "text-secondary", 
      glow: "",
      gradient: "from-secondary/5 to-transparent"
    },
    { 
      name: "Total Activities", 
      value: loading ? "..." : statsData.activityCount.toString(), 
      change: "", 
      icon: Activity, 
      color: "text-emerald-500", 
      glow: "",
      gradient: "from-emerald-500/5 to-transparent"
    },
    {
      name: "Total AI Quiz Generator Usage",
      value: loading ? "..." : statsData.quizCount.toString(),
      change: "",
      icon: BrainCircuit,
      color: "text-primary",
      glow: "",
      gradient: "from-primary/5 to-transparent"
    },
  ];

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-2"
          >
            <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">AI Core Online</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black text-foreground tracking-tighter"
          >
            Clinical <span className="text-primary">Overview</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mt-3 text-lg font-medium"
          >
            Analytical insights for <span className="text-foreground">{displayName}</span>
          </motion.p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white border-border text-foreground rounded-2xl h-12 px-6 font-bold hover:bg-slate-50 transition-all">
            Download Report
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-white rounded-2xl h-12 px-6 font-black transition-all shadow-lg shadow-primary/20">
            New AI Session
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.name}
            variants={item}
            whileHover={{ y: -5 }}
            className="relative group"
          >
            <Card className="medical-card relative overflow-hidden h-full group-hover:border-primary/20 transition-all duration-300">
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500", stat.gradient)} />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className={cn("p-3 rounded-2xl bg-slate-50 border border-border transition-colors group-hover:bg-white", stat.color)}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  {stat.change && (
                    <div className="flex flex-col items-end">
                      <span className={cn("text-xs font-black", stat.change.startsWith('+') ? 'text-emerald-600' : 'text-rose-600')}>
                        {stat.change}
                      </span>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">vs Last Week</span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">{stat.name}</p>
                  <p className="text-3xl font-black text-foreground tracking-tighter">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="medical-card h-full shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 pointer-events-none">
               <Activity className="w-40 h-40 text-primary/5 rotate-12" />
            </div>
            <CardHeader className="pb-2 relative z-10">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl font-black text-foreground tracking-tight">AI Interaction Volume</CardTitle>
                  <CardDescription className="text-muted-foreground font-medium">Daily query throughput and prediction accuracy.</CardDescription>
                </div>
                <div className="bg-slate-50 border border-border rounded-xl p-1 flex gap-1">
                   {['7D', '30D', '90D'].map(t => (
                     <button key={t} className={cn("px-3 py-1 text-[10px] font-black rounded-lg transition-all", t === '7D' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground')}>
                       {t}
                     </button>
                   ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-10 relative z-10">
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={usageData}>
                    <defs>
                      <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2D34D2" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#2D34D2" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#00000005" vertical={false} />
                    <XAxis 
                      dataKey="day" 
                      stroke="#94A3B8" 
                      fontSize={10} 
                      fontWeight="bold" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ dy: 10 }}
                    />
                    <YAxis 
                      stroke="#94A3B8" 
                      fontSize={10} 
                      fontWeight="bold" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ dx: -10 }}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#E5E7EB', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                      itemStyle={{ color: '#2D34D2' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="queries" 
                      stroke="#2D34D2" 
                      strokeWidth={4}
                      fillOpacity={1} 
                      fill="url(#colorQueries)" 
                      animationDuration={2000}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="accuracy" 
                      stroke="#7B61FF" 
                      strokeWidth={2} 
                      strokeDasharray="5 5"
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          {/* Topic Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="medical-card shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg font-black text-foreground uppercase tracking-wider">Top Medical Topics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {topicData.map((topic, i) => (
                  <div key={topic.name} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-bold text-muted-foreground">{topic.name}</span>
                      <span className="text-[10px] font-black text-primary">{topic.value}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${topic.value * 2}%` }}
                        transition={{ duration: 1.5, delay: 0.8 + (i * 0.1) }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: topic.color }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent User Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="medical-card shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-medical-gradient" />
              <CardHeader>
                <CardTitle className="text-lg font-black text-foreground uppercase tracking-wider">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {loading ? (
                    <div className="p-6 text-center text-xs font-bold text-muted-foreground uppercase tracking-widest animate-pulse">
                      Loading Activities...
                    </div>
                  ) : recentActivities.length === 0 ? (
                    <div className="p-6 text-center text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      No Recent Activities
                    </div>
                  ) : (
                    recentActivities.map((activity, i) => {
                      const type = activity.activityType;
                      const title = type.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
                      let icon = Activity;
                      let color = "text-emerald-500";
                      
                      if (type === "AI_EXPLAINER") {
                        icon = BrainCircuit;
                        color = "text-primary";
                      } else if (type === "AI_SUMMARY") {
                        icon = FileText;
                        color = "text-secondary";
                      } else if (type === "AI_QUIZ") {
                        icon = BrainCircuit;
                        color = "text-primary";
                      }

                      const dateObj = new Date(activity.createdAt);
                      const displayDate = dateObj.toLocaleDateString();
                      const displayTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                      const IconComponent = icon;

                      return (
                        <div key={activity.id || i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-all cursor-pointer group">
                          <div className="flex items-center gap-3">
                            <div className={cn("p-2 rounded-xl bg-slate-50 border border-border group-hover:bg-white transition-colors", color)}>
                              <IconComponent className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-foreground leading-tight">{title}</p>
                              <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest mt-0.5">{displayDate}</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-muted-foreground">{displayTime}</span>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Recent History — Explainer + Summary side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Recent Explainer History */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Card className="medical-card shadow-xl relative overflow-hidden h-full">
            <div className="absolute top-0 left-0 w-full h-1 bg-medical-gradient" />
            <CardHeader className="p-6 pb-0 flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg font-black text-foreground uppercase tracking-wider">Explainer History</CardTitle>
                  <CardDescription className="text-muted-foreground font-medium text-xs mt-0.5">Your last 5 AI Explainer queries</CardDescription>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
                Latest 5
              </span>
            </CardHeader>
            <CardContent className="p-0 mt-4">
              <div className="divide-y divide-border">
                {loading ? (
                  <div className="p-8 text-center text-xs font-bold text-muted-foreground uppercase tracking-widest animate-pulse">
                    Loading History...
                  </div>
                ) : explainerHistory.length === 0 ? (
                  <div className="p-8 flex flex-col items-center justify-center gap-3 text-center">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-border">
                      <MessageSquare className="w-8 h-8 text-muted-foreground/30" />
                    </div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">No Explainer History Yet</p>
                    <p className="text-[11px] text-muted-foreground">Start using AI Explainer to see your history here.</p>
                  </div>
                ) : (
                  explainerHistory.map((record, i) => {
                    const dateObj = new Date(record.createdAt);
                    const displayDate = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                    const displayTime = dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                    return (
                      <motion.div
                        key={record.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * i }}
                        className="p-5 flex items-start gap-4 hover:bg-slate-50 transition-all group cursor-default"
                      >
                        <div className="p-2.5 rounded-xl bg-primary/5 border border-primary/10 text-primary shrink-0 group-hover:bg-primary/10 transition-colors mt-0.5">
                          <MessageSquare className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground leading-snug line-clamp-2">{record.prompt}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                              {displayDate} • {displayTime}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-black text-primary/60 bg-primary/5 border border-primary/10 px-2 py-1 rounded-lg shrink-0 self-center">
                          #{i + 1}
                        </span>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Summary History */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="medical-card shadow-xl relative overflow-hidden h-full">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary to-secondary/50" />
            <CardHeader className="p-6 pb-0 flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-secondary/10 border border-secondary/20">
                  <ScrollText className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <CardTitle className="text-lg font-black text-foreground uppercase tracking-wider">Summary History</CardTitle>
                  <CardDescription className="text-muted-foreground font-medium text-xs mt-0.5">Your last 5 AI Summary sessions</CardDescription>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-secondary bg-secondary/10 border border-secondary/20 px-3 py-1 rounded-full">
                Latest 5
              </span>
            </CardHeader>
            <CardContent className="p-0 mt-4">
              <div className="divide-y divide-border">
                {loading ? (
                  <div className="p-8 text-center text-xs font-bold text-muted-foreground uppercase tracking-widest animate-pulse">
                    Loading History...
                  </div>
                ) : summaryHistory.length === 0 ? (
                  <div className="p-8 flex flex-col items-center justify-center gap-3 text-center">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-border">
                      <ScrollText className="w-8 h-8 text-muted-foreground/30" />
                    </div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">No Summary History Yet</p>
                    <p className="text-[11px] text-muted-foreground">Start using AI Summary to see your history here.</p>
                  </div>
                ) : (
                  summaryHistory.map((record, i) => {
                    const dateObj = new Date(record.createdAt);
                    const displayDate = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                    const displayTime = dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                    // Use first 120 chars of originalContent as preview
                    const preview = record.originalContent?.trim().slice(0, 120) + (record.originalContent?.length > 120 ? "…" : "");
                    return (
                      <motion.div
                        key={record.id}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * i }}
                        className="p-5 flex items-start gap-4 hover:bg-slate-50 transition-all group cursor-default"
                      >
                        <div className="p-2.5 rounded-xl bg-secondary/5 border border-secondary/10 text-secondary shrink-0 group-hover:bg-secondary/10 transition-colors mt-0.5">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground leading-snug line-clamp-2">{preview}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                              {displayDate} • {displayTime}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-black text-secondary/60 bg-secondary/5 border border-secondary/10 px-2 py-1 rounded-lg shrink-0 self-center">
                          #{i + 1}
                        </span>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </div>

      {/* Recent Quiz History */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9 }}
      >
        <Card className="medical-card shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-emerald-400" />
          <CardHeader className="p-6 pb-0 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <GraduationCap className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-black text-foreground uppercase tracking-wider">Quiz Generator History</CardTitle>
                <CardDescription className="text-muted-foreground font-medium text-xs mt-0.5">Your last 5 AI Quiz topics</CardDescription>
              </div>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              Latest 5
            </span>
          </CardHeader>
          <CardContent className="p-0 mt-4">
            <div className="divide-y divide-border">
              {loading ? (
                <div className="p-8 text-center text-xs font-bold text-muted-foreground uppercase tracking-widest animate-pulse">
                  Loading History...
                </div>
              ) : quizHistory.length === 0 ? (
                <div className="p-8 flex flex-col items-center justify-center gap-3 text-center">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-border">
                    <GraduationCap className="w-8 h-8 text-muted-foreground/30" />
                  </div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">No Quiz History Yet</p>
                  <p className="text-[11px] text-muted-foreground">Start using AI Quiz Generator to see your history here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-border">
                  {quizHistory.map((record, i) => {
                    const dateObj = new Date(record.createdAt);
                    const displayDate = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                    const displayTime = dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                    return (
                      <motion.div
                        key={record.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * i }}
                        className="p-5 flex items-start gap-4 hover:bg-slate-50 transition-all group cursor-default"
                      >
                        <div className="p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-600 shrink-0 group-hover:bg-emerald-500/10 transition-colors mt-0.5">
                          <HelpCircle className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-black text-foreground leading-snug truncate">{record.topic}</p>
                            <span className="text-[10px] font-black text-primary/60 bg-primary/5 border border-primary/10 px-2 py-0.5 rounded-lg shrink-0">
                              #{i + 1}
                            </span>
                          </div>
                          {record.difficulty && (
                            <span className={cn(
                              "inline-block text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full mb-1.5",
                              record.difficulty === "Advanced" ? "bg-rose-50 text-rose-500 border border-rose-200" :
                              record.difficulty === "Intermediate" ? "bg-amber-50 text-amber-600 border border-amber-200" :
                              "bg-emerald-50 text-emerald-600 border border-emerald-200"
                            )}>
                              {record.difficulty}
                            </span>
                          )}
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                              {displayDate} • {displayTime}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

    </div>
  );
}
