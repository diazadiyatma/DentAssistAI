import Link from "next/link";
import { Activity } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-[#0F172A] py-12 px-4 md:px-6">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2D34D2]/20 text-[#2D34D2]">
              <Activity className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">DentAssist <span className="text-[#2D34D2]">AI</span></span>
          </Link>
          <p className="text-sm text-slate-400 max-w-xs font-medium">
            An AI-powered assistant for dental education and oral health awareness.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-white mb-4">Product</h3>
          <ul className="space-y-2 text-sm text-slate-400 font-medium">
            <li><Link href="/dashboard" className="hover:text-[#2D34D2] transition-colors">Dashboard</Link></li>
            <li><Link href="/dashboard/explainer" className="hover:text-[#2D34D2] transition-colors">AI Explainer</Link></li>
            <li><Link href="/dashboard/summary" className="hover:text-[#2D34D2] transition-colors">Summary Gen</Link></li>
            <li><Link href="/dashboard/quiz" className="hover:text-[#2D34D2] transition-colors">Quiz Maker</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-white mb-4">Legal</h3>
          <ul className="space-y-2 text-sm text-slate-400 font-medium">
            <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto mt-12 pt-8 border-t border-white/10 text-center text-sm text-slate-500">
        <p>© {new Date().getFullYear()} DentAssist AI. All rights reserved.</p>
        <p className="mt-2 text-xs">Disclaimer: This is not a professional medical diagnosis.</p>
      </div>
    </footer>
  );
}
