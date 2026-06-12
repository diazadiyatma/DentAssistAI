"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Bell, 
  Shield, 
  Palette, 
  Database, 
  Save, 
  UserCircle,
  Smartphone,
  Globe
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
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security & Privacy", icon: Shield },
    { id: "appearance", label: "Interface", icon: Palette },
  ];

  return (
    <div className="space-y-8 pb-20">
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
            className="text-2xl sm:text-3xl font-black text-foreground tracking-tighter"
          >
            Settings <span className="text-primary">& Control</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mt-2 text-sm sm:text-base font-medium"
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
            className="bg-primary hover:bg-primary/90 text-white rounded-xl h-10 px-6 text-sm font-black transition-all shadow-lg shadow-primary/20 flex items-center gap-2 min-w-[140px]"
          >
            {isSaving ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <Database className="w-4 h-4" />
              </motion.div>
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSaving ? "Syncing..." : "Save Changes"}
          </Button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-1.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-2.5 px-4 py-3 rounded-xl transition-all duration-300 font-bold text-xs sm:text-sm text-left relative overflow-hidden",
                activeTab === tab.id 
                  ? "bg-white text-primary shadow-sm border border-border" 
                  : "text-muted-foreground hover:text-foreground hover:bg-slate-50"
              )}
            >
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="active-tab-indicator"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-primary"
                />
              )}
              <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-primary" : "text-muted-foreground")} />
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
                  <CardHeader className="border-b border-border bg-slate-50/50 p-6">
                    <CardTitle className="text-lg font-black">Clinical Preferences</CardTitle>
                    <CardDescription className="font-medium mt-1 text-xs">
                      Customize your clinical role and workspace details. To update your name or email, visit your{" "}
                      <a href="/dashboard/profile" className="text-primary font-bold hover:underline">Profile page</a>.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Clinical Title</label>
                        <div className="relative">
                          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <select
                            value={clinicalTitle}
                            onChange={(e) => {
                              setClinicalTitle(e.target.value);
                              triggerAutoSave();
                            }}
                            className="w-full bg-slate-50 border border-border rounded-xl py-2 px-4 pl-12 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all font-medium appearance-none"
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
                        <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Hospital / Clinic ID</label>
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
                            className="w-full bg-slate-50 border border-border rounded-xl py-2 px-4 pl-12 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all font-medium"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {(activeTab === "notifications" || activeTab === "security" || activeTab === "appearance") && (
              <Card className="medical-card">
                <CardContent className="p-10 sm:p-16 flex flex-col items-center justify-center text-center">
                  <div className="h-16 w-16 bg-slate-50 border border-border rounded-2xl flex items-center justify-center mb-4 text-muted-foreground">
                    <Database className="w-8 h-8 opacity-20" />
                  </div>
                  <h3 className="text-lg font-black text-foreground">Feature in Calibration</h3>
                  <p className="text-muted-foreground max-w-xs mt-1.5 text-xs font-medium">This module is currently being optimized for medical standards. Coming in v2.5 update.</p>
                  <Button variant="outline" className="mt-6 rounded-lg font-bold text-xs h-9" onClick={() => setActiveTab("profile")}>Back to Profile</Button>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
