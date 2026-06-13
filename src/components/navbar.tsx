"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Activity, Menu, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { ThemeToggle } from "./ui/theme-toggle";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  console.log('Navbar session:', session);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border bg-white/85 dark:bg-slate-950/85 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Activity className="h-5 w-5" />
          </div>
          <span className="text-lg font-black tracking-tighter text-foreground uppercase italic">
            DentAssist <span className="text-primary">AI</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 sm:gap-8">
          <Link href="#features" className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-all flex items-center">
            Features
          </Link>
          <Link href="#about" className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-all flex items-center">
            About
          </Link>
        </nav>
        
        <div className="hidden md:flex items-center gap-4 ml-4">
          <ThemeToggle />
          <Link href="/login">
            <Button className="h-11 px-6 bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-[0.2em] rounded-full shadow-md shadow-primary/20 transition-all hover:scale-105 cursor-pointer">
              Sign In
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle Button and Auth */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <Link href="/login">
            <Button className="h-10 px-4 bg-primary hover:bg-primary/90 text-white font-bold text-[10px] uppercase tracking-[0.2em] rounded-full shadow-md shadow-primary/20 transition-all hover:scale-105 cursor-pointer">
              Sign In
            </Button>
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-lg text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none cursor-pointer"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="border-b border-border bg-white dark:bg-slate-900 px-4 py-6 shadow-xl md:hidden animate-in fade-in slide-in-from-top duration-200">
          <nav className="flex flex-col gap-4">
            <Link
              href="#features"
              onClick={() => setIsOpen(false)}
              className="block py-2 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary"
            >
              Features
            </Link>
            <Link
              href="#about"
              onClick={() => setIsOpen(false)}
              className="block py-2 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary"
            >
              About
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

