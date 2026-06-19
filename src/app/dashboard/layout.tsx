"use client";

import { Sidebar } from "@/components/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Command, Menu, X, MessageSquare, FileText, HelpCircle, Loader2, UserCircle, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [displayName, setDisplayName] = useState<string>("");
  const [displayEmail, setDisplayEmail] = useState<string>("");
  const [displayAvatar, setDisplayAvatar] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Focus on Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
        setShowDropdown(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search query fetching
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const delayDebounceFn = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setSearchResults(data.results);
          }
        })
        .catch(console.error)
        .finally(() => setIsSearching(false));
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleResultClick = (item: any) => {
    setSearchQuery("");
    setShowDropdown(false);
    // Redirect to the appropriate history subpage with query parameter
    router.push(`/dashboard/history/${item.type}?id=${item.id}`);
  };

  // Sync name/email/avatar from localStorage, fallback to session, refresh from API in background
  useEffect(() => {
    const syncProfile = () => {
      if (!session?.user) return;
      const storageKey = `dentassist_profile_${session.user.id}`;
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          setDisplayName(parsed.fullName || session.user.name || "Dr. User");
          setDisplayEmail(parsed.email || session.user.email || "Dentist");
          setDisplayAvatar(parsed.image || "");
          return;
        }
      } catch {}
      setDisplayName(session.user.name || "Dr. User");
      setDisplayEmail(session.user.email || "Dentist");
      setDisplayAvatar("");
    };

    syncProfile();

    if (session?.user) {
      const storageKey = `dentassist_profile_${session.user.id}`;
      fetch("/api/profile")
        .then((r) => r.json())
        .then((data) => {
          if (data.success) {
            const raw = localStorage.getItem(storageKey);
            let existing = {};
            try { if (raw) existing = JSON.parse(raw); } catch {}
            localStorage.setItem(storageKey, JSON.stringify({
              ...existing,
              fullName: data.profile.name,
              email: data.profile.email,
              image: data.profile.image,
            }));
            syncProfile();
          }
        })
        .catch(console.error);
    }

    // Also listen for storage changes (when settings page saves)
    window.addEventListener("storage", syncProfile);
    return () => window.removeEventListener("storage", syncProfile);
  }, [session]);

  if (status === "unauthenticated") {
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]" />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[90] md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="flex-1 md:ml-64 flex flex-col h-screen relative w-full overflow-hidden">
        {/* Medical Top Navbar */}
        <header className="h-20 flex items-center justify-between px-4 md:px-8 border-b border-border bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl z-50">
          <div ref={searchContainerRef} className="flex items-center gap-2 md:gap-0 max-w-md w-full relative group">
            {/* Mobile Hamburger Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-muted-foreground hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl flex-shrink-0"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                ref={searchInputRef}
                type="text" 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Search medical records, AI insights..." 
                className="w-full bg-slate-50 dark:bg-slate-950 border border-border rounded-full py-2.5 pl-10 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 focus:bg-white dark:focus:bg-slate-900 transition-all text-foreground"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded border border-border bg-background text-[10px] text-muted-foreground font-mono">
                <Command className="w-2.5 h-2.5" /> K
              </div>

              {/* Floating Results Dropdown */}
              <AnimatePresence>
                {showDropdown && (searchQuery.trim().length > 0 || isSearching) && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-border rounded-2xl shadow-xl z-[99] max-h-96 overflow-y-auto overflow-x-hidden p-2 space-y-1"
                  >
                    {isSearching ? (
                      <div className="flex items-center justify-center py-6 gap-2 text-sm text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        <span>Searching...</span>
                      </div>
                    ) : searchResults.length === 0 ? (
                      <div className="text-center py-6 text-sm text-muted-foreground">
                        No results found for "{searchQuery}"
                      </div>
                    ) : (
                      searchResults.map((item) => {
                        const Icon = item.type === "explainer" 
                          ? MessageSquare 
                          : item.type === "summary" 
                            ? FileText 
                            : HelpCircle;
                        
                        const badgeColor = item.type === "explainer"
                          ? "text-primary bg-primary/5 border-primary/10"
                          : item.type === "summary"
                            ? "text-secondary bg-secondary/5 border-secondary/10"
                            : "text-emerald-600 bg-emerald-50 border-emerald-200";

                        const typeLabel = item.type === "explainer"
                          ? "AI Explainer"
                          : item.type === "summary"
                            ? "AI Summary"
                            : "AI Quiz";

                        return (
                          <button
                            key={item.id}
                            onClick={() => handleResultClick(item)}
                            className="w-full text-left flex items-start gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors group/item"
                          >
                            <div className={`p-2 rounded-lg border shrink-0 ${badgeColor}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border ${badgeColor}`}>
                                  {typeLabel}
                                </span>
                                <span className="text-[10px] text-muted-foreground font-medium">
                                  {new Date(item.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                                </span>
                              </div>
                              <p className="text-xs font-bold text-foreground mt-1 truncate group-hover/item:text-primary transition-colors">
                                {item.title}
                              </p>
                              <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                                {item.subtitle}
                              </p>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 ml-3 shrink-0">
            <ThemeToggle />
            
            <div className="h-8 w-px bg-border mx-2" />
            
            <div ref={profileDropdownRef} className="relative flex items-center gap-3 pl-2">
              <div 
                className="flex items-center gap-3 cursor-pointer select-none group/avatar"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-foreground leading-tight group-hover/avatar:text-primary transition-colors">
                    {displayName}
                  </p>
                  <p className="text-[10px] text-primary uppercase tracking-widest font-bold">
                    {displayEmail}
                  </p>
                </div>
                <Avatar className="h-10 w-10 border border-border ring-2 ring-transparent group-hover/avatar:ring-primary/50 transition-all">
                  <AvatarImage src={displayAvatar} />
                  <AvatarFallback className="bg-medical-gradient text-white font-bold text-xs">
                    {displayName?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Profile Dropdown with AnimatePresence */}
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 top-full mt-3 w-56 rounded-2xl border border-white/10 bg-[#0F172A] p-2 shadow-2xl z-[100]"
                  >
                    {/* Header info inside dropdown for small screens */}
                    <div className="px-3 py-2 border-b border-white/5 sm:hidden">
                      <p className="text-xs font-bold text-white truncate">{displayName}</p>
                      <p className="text-[9px] text-primary uppercase tracking-wider font-bold truncate">{displayEmail}</p>
                    </div>

                    <div className="space-y-0.5">
                      <Link 
                        href="/dashboard/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-all group"
                      >
                        <UserCircle className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                        User Profile
                      </Link>
                      <Link 
                        href="/dashboard/settings"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-all group"
                      >
                        <Settings className="w-4 h-4 text-secondary group-hover:scale-110 transition-transform" />
                        Settings
                      </Link>
                      
                      <div className="h-px bg-white/5 my-1" />
                      
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          signOut();
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-200 hover:bg-rose-500/10 transition-all group"
                      >
                        <LogOut className="w-4 h-4 text-rose-400 group-hover:translate-x-0.5 transition-transform" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content with Page Transitions */}
        <main className="flex-1 overflow-y-auto p-8 relative no-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="max-w-7xl w-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
