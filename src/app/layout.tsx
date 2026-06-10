import { Poppins } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";
import { SessionProvider } from "@/components/providers/session-provider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "DentAssist AI",
  description: "An AI-powered assistant for dental education and oral health awareness.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} antialiased h-full`}
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground font-sans overflow-x-hidden selection:bg-primary/30">
        <SessionProvider>
          <div className="relative flex min-h-screen flex-col w-full">
            {children}
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
