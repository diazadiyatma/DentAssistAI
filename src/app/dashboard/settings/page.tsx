"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Bell, 
  Shield, 
  BrainCircuit, 
  Palette, 
  Database, 
  Save, 
  UserCircle,
  Smartphone,
  Globe,
  Zap,
  CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  // NextAuth
  const { data: session } = useSession();

  // State
  const [clinicalTitle, setClinicalTitle] = useState("");
  const [hospitalId, setHospitalId] = useState("");
  const [activeTab, setActiveTab] = useState("preferences");
  const [isSaving, setIsSaving] = useState(false);

  // Refs
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  // Initialize: load from localStorage first, fall back to session
  useEffect(() => {
    if (!session?.user) return;
    const userId = session.user.id;
    const storageKey = `dentassist_profile_${userId}`;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        setClinicalTitle(parsed.clinicalTitle ?? "");
        setHospitalId(parsed.hospitalId ?? "");
      }
    } catch {
      // ignore malformed storage
    }
  }, [session]);

  // Save handler — persists to localStorage keyed by userId
  const handleSave = () => {
    if (!session?.user?.id) return;
    setIsSaving(true);
    setTimeout(() => {
      const storageKey = `dentassist_profile_${session.user!.id}`;
      // Merge with existing stored data to preserve other fields
      let existing: Record<string, unknown> = {};
      try {
        const raw = localStorage.getItem(storageKey);
        if (raw) existing = JSON.parse(raw);
      } catch {}
      localStorage.setItem(
        storageKey,
        JSON.stringify({ ...existing, clinicalTitle, hospitalId })
      );
      window.dispatchEvent(new Event("storage"));
      setIsSaving(false);
    }, 1500);
  };

  // Auto save
  const triggerAutoSave = () => {
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

    saveTimeout.current = setTimeout(() => {
      handleSave();
    }, 800);
  };

  const tabs = [
    { id: "preferences", label: "Preferences", icon: UserCircle },
    { id: "ai", label: "AI Configuration", icon: BrainCircuit },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security & Privacy", icon: Shield },
    { id: "appearance", label: "Interface", icon: Palette },
  ];

 



  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-2"
          >
            <div className="h-2 w-2 rounded-full bg-primary shadow-lg shadow-primary/20" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">System Preferences</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black text-foreground tracking-tighter"
          >
            Settings <span className="text-primary">& Control</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mt-3 text-lg font-medium"
          >
            Manage your medical assistant configurations and account data.
          </motion.p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary hover:bg-primary/90 text-white rounded-2xl h-12 px-8 font-black transition-all shadow-lg shadow-primary/20 flex items-center gap-2 min-w-[160px]"
          >
            {isSaving ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <Database className="w-5 h-5" />
              </motion.div>
            ) : (
              <Save className="w-5 h-5" />
            )}
            {isSaving ? "Syncing..." : "Save Changes"}
          </Button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 font-bold text-sm text-left relative overflow-hidden",
                activeTab === tab.id 
                  ? "bg-white text-primary shadow-md border border-border" 
                  : "text-muted-foreground hover:text-foreground hover:bg-slate-50"
              )}
            >
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="active-tab-indicator"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-primary"
                />
              )}
              <tab.icon className={cn("w-5 h-5", activeTab === tab.id ? "text-primary" : "text-muted-foreground")} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "preferences" && (
              <div className="space-y-6">
                <Card className="medical-card overflow-hidden">
                  <CardHeader className="border-b border-border bg-slate-50/50 p-8">
                    <CardTitle className="text-xl font-black">Clinical Preferences</CardTitle>
                    <CardDescription className="font-medium mt-1">
                      Customize your clinical role and workspace details. To update your name or email, visit your{" "}
                      <a href="/dashboard/profile" className="text-primary font-bold hover:underline">Profile page</a>.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Clinical Title</label>
                        <div className="relative">
                          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <select
                            value={clinicalTitle}
                            onChange={(e) => {
                              setClinicalTitle(e.target.value);
                              triggerAutoSave();
                            }}
                            className="w-full bg-slate-50 border border-border rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all font-medium appearance-none"
                          >
                            <option>Chief Resident</option>
                            <option>General Dentist</option>
                            <option>Orthodontist</option>
                            <option>Periodontist</option>
                            <option>Oral Surgeon</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Hospital / Clinic ID</label>
                        <div className="relative">
                          <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input
                            type="text"
                            value={hospitalId}
                            onChange={(e) => {
                              setHospitalId(e.target.value);
                              triggerAutoSave();
                            }}
                            placeholder="e.g., RSU-DENTAL-001"
                            className="w-full bg-slate-50 border border-border rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all font-medium"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "ai" && (
              <div className="space-y-6">
                <Card className="medical-card">
                  <CardHeader className="p-8">
                    <CardTitle className="text-xl font-black">AI Configuration</CardTitle>
                    <CardDescription className="font-medium">Optimize how the medical assistant processes your clinical data.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 pt-0 space-y-8">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-slate-50 border border-border rounded-2xl group hover:border-primary/20 transition-all cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                            <Zap className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-bold text-sm">Turbo Accuracy Mode</p>
                            <p className="text-xs text-muted-foreground">Increases processing time but provides deeper medical cross-referencing.</p>
                          </div>
                        </div>
                        <div className="h-6 w-11 bg-primary rounded-full relative">
                          <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-slate-50 border border-border rounded-2xl group hover:border-primary/20 transition-all cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                            <Globe className="w-5 h-5 text-secondary" />
                          </div>
                          <div>
                            <p className="font-bold text-sm">Multilingual Diagnostics</p>
                            <p className="text-xs text-muted-foreground">Automatically translate medical terminology to patient's local language.</p>
                          </div>
                        </div>
                        <div className="h-6 w-11 bg-slate-200 rounded-full relative">
                          <div className="absolute left-1 top-1 h-4 w-4 bg-white rounded-full" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Base Model Selection</label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="border-2 border-primary bg-primary/5 p-4 rounded-2xl relative">
                          <CheckCircle2 className="absolute top-3 right-3 w-4 h-4 text-primary" />
                          <p className="font-black text-sm">Gemini 1.5 Flash</p>
                          <p className="text-[10px] font-bold text-primary/70 uppercase">High Speed • Clinical</p>
                        </div>
                        <div className="border-2 border-border hover:border-primary/20 transition-all p-4 rounded-2xl cursor-pointer bg-white">
                          <p className="font-black text-sm">Gemini 1.5 Pro</p>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase">Heavy Research • Deep</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {(activeTab === "notifications" || activeTab === "security" || activeTab === "appearance") && (
              <Card className="medical-card">
                <CardContent className="p-20 flex flex-col items-center justify-center text-center">
                  <div className="h-20 w-20 bg-slate-50 border border-border rounded-3xl flex items-center justify-center mb-6 text-muted-foreground">
                    <Database className="w-10 h-10 opacity-20" />
                  </div>
                  <h3 className="text-xl font-black text-foreground">Feature in Calibration</h3>
                  <p className="text-muted-foreground max-w-xs mt-2 font-medium">This module is currently being optimized for medical standards. Coming in v2.5 update.</p>
                  <Button variant="outline" className="mt-8 rounded-xl font-bold" onClick={() => setActiveTab("profile")}>Back to Profile</Button>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
