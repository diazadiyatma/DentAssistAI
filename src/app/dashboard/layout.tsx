"use client";

import { Sidebar } from "@/components/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Command, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { useState, useEffect } from "react";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Sync name/email from localStorage (saved by settings page), fallback to session
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
          return;
        }
      } catch {}
      setDisplayName(session.user.name || "Dr. User");
      setDisplayEmail(session.user.email || "Dentist");
    };

    syncProfile();

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
        <header className="h-20 flex items-center justify-between px-4 md:px-8 border-b border-border bg-white/80 backdrop-blur-xl z-50">
          <div className="flex items-center gap-2 md:gap-0 max-w-md w-full relative group">
            {/* Mobile Hamburger Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-muted-foreground hover:text-primary hover:bg-slate-50 rounded-xl flex-shrink-0"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search medical records, AI insights..." 
                className="w-full bg-slate-50 border border-border rounded-full py-2.5 pl-10 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 focus:bg-white transition-all"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded border border-border bg-background text-[10px] text-muted-foreground font-mono">
                <Command className="w-2.5 h-2.5" /> K
              </div>
            </div>
          </div>

          <div className="flex items-center gap-5">

            
            <div className="h-8 w-px bg-border mx-2" />
            
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-foreground leading-tight">
                  {displayName}
                </p>
                <p className="text-[10px] text-primary uppercase tracking-widest font-bold">
                  {displayEmail}
                </p>
              </div>
              <Avatar className="h-10 w-10 border border-border ring-2 ring-transparent hover:ring-primary/50 transition-all cursor-pointer">
                <AvatarImage src="" />
                <AvatarFallback className="bg-medical-gradient text-white font-bold text-xs">
                  {displayName?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => signOut()}
                className="text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors rounded-xl ml-2"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </Button>
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
              className="max-w-7xl mx-auto"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
