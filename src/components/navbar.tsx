import Link from "next/link";
import { Button } from "./ui/button";
import { Activity } from "lucide-react";

export function Navbar() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-border bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Activity className="h-5 w-5" />
          </div>
          <span className="text-lg font-black tracking-tighter text-foreground uppercase italic">DentAssist <span className="text-primary">AI</span></span>
        </Link>
        <nav className="ml-auto flex gap-6 sm:gap-8">
          <Link href="#features" className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-all flex items-center">
            Features
          </Link>
          <Link href="#about" className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-all flex items-center">
            About
          </Link>
          <div className="flex items-center gap-4 ml-4">
            <Button variant="ghost" className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-slate-50">Sign In</Button>
            <Link href="/dashboard">
              <Button className="bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[10px] px-6 shadow-lg shadow-primary/20 transition-all hover:scale-105">Get Started</Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
