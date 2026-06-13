"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Mail,
  CalendarDays,
  BrainCircuit,
  FileText,
  HelpCircle,
  Loader2,
  Activity,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProfileData {
  name: string | null;
  email: string;
  memberSince: string;
  explainerCount: number;
  summaryCount: number;
  quizCount: number;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setProfile(data.profile);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const displayName = profile?.name ?? "Doctor";
  const initials = displayName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const memberSince = profile
    ? new Date(profile.memberSince).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  const stats = profile
    ? [
        {
          label: "Total Explainer Usage",
          value: profile.explainerCount,
          icon: BrainCircuit,
          color: "text-primary",
          bg: "bg-primary/10 border-primary/20",
          gradient: "from-primary/5 to-transparent",
        },
        {
          label: "Total Summary Usage",
          value: profile.summaryCount,
          icon: FileText,
          color: "text-secondary",
          bg: "bg-secondary/10 border-secondary/20",
          gradient: "from-secondary/5 to-transparent",
        },
        {
          label: "Total Quiz Usage",
          value: profile.quizCount,
          icon: HelpCircle,
          color: "text-emerald-600",
          bg: "bg-emerald-500/10 border-emerald-500/20",
          gradient: "from-emerald-500/5 to-transparent",
        },
        {
          label: "Total AI Sessions",
          value: profile.explainerCount + profile.summaryCount + profile.quizCount,
          icon: Activity,
          color: "text-amber-600",
          bg: "bg-amber-500/10 border-amber-500/20",
          gradient: "from-amber-500/5 to-transparent",
        },
      ]
    : [];

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
            Account Overview
          </span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl sm:text-2xl font-black text-foreground tracking-tight"
        >
          User <span className="text-primary">Profile</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground mt-1.5 text-xs sm:text-sm font-medium"
        >
          Your account information and AI usage statistics.
        </motion.p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="medical-card overflow-hidden shadow-md">
              {/* Top gradient bar */}
              <div className="h-1.5 w-full bg-medical-gradient" />

              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6">
                  {/* Avatar */}
                  <div className="shrink-0">
                    <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-4 border-white shadow-2xl shadow-primary/10">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-medical-gradient text-white text-xl font-black">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  {/* Info */}
                  <div className="flex-1 space-y-3 text-center md:text-left">
                    <div>
                      <h2 className="text-lg sm:text-xl font-black text-foreground tracking-tight">
                        {displayName}
                      </h2>
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary mt-0.5">
                        DentAssist AI Member
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Name */}
                      <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-border">
                        <div className="p-2 rounded-lg bg-white dark:bg-slate-950 border border-border shadow-sm text-primary shrink-0">
                          <User className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                            Full Name
                          </p>
                          <p className="text-xs sm:text-sm font-bold text-foreground truncate">
                            {displayName}
                          </p>
                        </div>
                      </div>

                      {/* Email */}
                      <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-border">
                        <div className="p-2 rounded-lg bg-white dark:bg-slate-950 border border-border shadow-sm text-primary shrink-0">
                          <Mail className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                            Email
                          </p>
                          <p className="text-xs sm:text-sm font-bold text-foreground truncate">
                            {profile?.email ?? "—"}
                          </p>
                        </div>
                      </div>

                      {/* Member Since */}
                      <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-border">
                        <div className="p-2 rounded-lg bg-white dark:bg-slate-950 border border-border shadow-sm text-primary shrink-0">
                          <CalendarDays className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                            Member Since
                          </p>
                          <p className="text-xs sm:text-sm font-bold text-foreground truncate">
                            {memberSince}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Usage Stats */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 mb-4"
            >
              <Activity className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                AI Usage Statistics
              </span>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.08 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className={cn("medical-card relative overflow-hidden group hover:border-primary/20 transition-all duration-300")}>
                    <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500", stat.gradient)} />
                    <CardContent className="p-4 sm:p-6 relative z-10">
                      <div className={cn("inline-flex p-2 sm:p-3 rounded-xl sm:rounded-2xl border mb-3 transition-colors group-hover:bg-white dark:group-hover:bg-slate-800", stat.bg)}>
                        <stat.icon className={cn("w-5 h-5 sm:w-6 sm:h-6", stat.color)} />
                      </div>
                      <p className="text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em] mb-1">
                        {stat.label}
                      </p>
                      <p className="text-2xl sm:text-3xl font-black text-foreground tracking-tighter">
                        {stat.value}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
