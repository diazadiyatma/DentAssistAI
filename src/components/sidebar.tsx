"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, LayoutDashboard, MessageSquare, FileText, HelpCircle, Settings, LogOut, ChevronRight, Zap, History, BookOpen, ScrollText, GraduationCap, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const sidebarItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, color: "text-primary", bg: "bg-primary/10" },
  { name: "Profile", href: "/dashboard/profile", icon: UserCircle, color: "text-primary", bg: "bg-primary/10" },
  { name: "AI Explainer", href: "/dashboard/explainer", icon: MessageSquare, color: "text-secondary", bg: "bg-secondary/10" },
  { name: "Summary Generator", href: "/dashboard/summary", icon: FileText, color: "text-primary", bg: "bg-primary/10" },
  { name: "Quiz Generator", href: "/dashboard/quiz", icon: HelpCircle, color: "text-secondary", bg: "bg-secondary/10" },
];

const historyItems = [
  { name: "Explainer History", href: "/dashboard/history/explainer", icon: BookOpen, color: "text-primary", bg: "bg-primary/10" },
  { name: "Summary History", href: "/dashboard/history/summary", icon: ScrollText, color: "text-secondary", bg: "bg-secondary/10" },
  { name: "Quiz History", href: "/dashboard/history/quiz", icon: GraduationCap, color: "text-emerald-500", bg: "bg-emerald-500/10" },
];

interface SidebarProps {
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside 
      className={cn(
        "w-64 border-r border-white/5 bg-[#0F172A] flex flex-col h-screen fixed top-0 left-0 z-[100] transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}
    >
      <div className="h-20 flex items-center px-8 border-b border-white/5">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-110 transition-all duration-300">
            <Activity className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-tight text-white leading-tight uppercase italic">DentAssist <span className="text-primary">AI</span></span>
            <span className="text-[9px] text-slate-500 uppercase tracking-widest font-black">Medical OS v2.4</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-10 px-4 space-y-2 no-scrollbar">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className="relative group block"
              onClick={() => setIsOpen && setIsOpen(false)}
            >
              <div
                className={cn(
                  "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative z-10",
                  isActive 
                    ? "text-white" 
                    : "text-slate-400 hover:text-slate-100"
                )}
              >
                <div className={cn(
                  "p-2 rounded-xl transition-all duration-300",
                  isActive ? item.bg + " " + item.color : "bg-transparent group-hover:bg-white/5"
                )}>
                  <item.icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-bold tracking-wide flex-1">{item.name}</span>
                {isActive && (
                  <motion.div 
                    layoutId="active-nav"
                    className="absolute inset-0 bg-white/5 border border-white/10 rounded-2xl -z-10"
                  />
                )}
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-primary" />}
              </div>
            </Link>
          );
        })}

        {/* History Section */}
        <div className="pt-4 pb-1 px-2">
          <div className="flex items-center gap-2">
            <History className="w-3 h-3 text-slate-500" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">History</span>
          </div>
        </div>
        {historyItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className="relative group block"
              onClick={() => setIsOpen && setIsOpen(false)}
            >
              <div
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group relative z-10",
                  isActive
                    ? "text-white"
                    : "text-slate-400 hover:text-slate-100"
                )}
              >
                <div className={cn(
                  "p-1.5 rounded-xl transition-all duration-300",
                  isActive ? item.bg + " " + item.color : "bg-transparent group-hover:bg-white/5"
                )}>
                  <item.icon className="h-4 w-4" />
                </div>
                <span className="text-xs font-bold tracking-wide flex-1">{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 bg-white/5 border border-white/10 rounded-2xl -z-10"
                  />
                )}
                {isActive && <ChevronRight className="w-3 h-3 text-primary" />}
              </div>
            </Link>
          );
        })}

        <div className="pt-8 px-2">
          <div className="bg-slate-900 border border-white/5 rounded-2xl p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-primary fill-primary/20" />
              <span className="text-[10px] uppercase tracking-widest font-black text-slate-400">AI Tokens</span>
            </div>
            <div className="flex items-end justify-between mb-2">
              <span className="text-xl font-black text-white leading-none">8.2k</span>
              <span className="text-[10px] text-slate-500">/ 10k</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-medical-gradient"
                initial={{ width: 0 }}
                animate={{ width: "82%" }}
                transition={{ duration: 1.5, ease: "circOut" }}
              />
            </div>
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-white/5 space-y-2">
        <Link 
          href="/dashboard/settings" 
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-sm font-bold",
            pathname === "/dashboard/settings" 
              ? "bg-white/10 text-white border border-white/10" 
              : "text-slate-400 hover:text-white hover:bg-white/5"
          )}
        >
          <Settings className={cn("w-5 h-5", pathname === "/dashboard/settings" ? "text-primary" : "")} />
          Settings
        </Link>
        <button className="flex w-full items-center gap-3 px-4 py-3 rounded-2xl transition-all text-slate-400 hover:bg-destructive/10 hover:text-destructive text-sm font-bold group">
          <LogOut className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
          Terminate Session
        </button>
      </div>
    </aside>
  );
}
