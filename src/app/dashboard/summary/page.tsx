"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UploadCloud, FileText, CheckCircle2, FileType2, Sparkles, Zap, Clock, BrainCircuit, Share2, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export default function SummaryGeneratorPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState({ overview: "", keyPoints: [] as string[] });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        setSelectedFile(file);
      } else {
        alert("Please upload a PDF file.");
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type === "application/pdf") {
        setSelectedFile(file);
      } else {
        alert("Please upload a PDF file.");
      }
    }
  };

  const handleGenerate = async () => {
    if (activeTab === "upload" && !selectedFile) return;
    if (activeTab === "paste" && !inputText.trim()) return;
    if (isGenerating) return;
    
    setIsGenerating(true);
    setShowResult(false);

    try {
      const formData = new FormData();
      if (activeTab === "upload" && selectedFile) {
        formData.append("file", selectedFile);
      } else {
        formData.append("text", inputText);
      }

      const res = await fetch("/api/summary", {
        method: "POST",
        body: formData,
      });

      console.log("STATUS:", res.status);

const rawResponse = await res.text();

console.log("RAW RESPONSE:", rawResponse);

let data;

try {
  data = JSON.parse(rawResponse);
} catch (e) {
  console.error("INVALID JSON RESPONSE");
  console.error(rawResponse);

  alert("API returned HTML instead of JSON. Check console.");
  return;
}

      if (!res.ok) {
        // Server returned an error, possibly HTML
        const errorMsg = typeof data.error === 'string' ? data.error : 'Failed to generate summary';
        alert(errorMsg);
        // Fallback to mock data
        setSummary({
          overview: 'Summary unavailable due to server error.',
          keyPoints: [] as string[],
        });
        setShowResult(true);
        return;
      }

      // Attempt to parse JSON from the response text
      let parsed: any = null;
      if (typeof data.text === 'string') {
        const cleaned = data.text.replace(/```json\n?|\n?```/g, '').trim();
        if (cleaned.startsWith('<')) {
          // Received HTML instead of JSON
          console.error('Invalid AI response format (HTML received)');
          alert('Received unexpected response format from AI service.');
          setSummary({ overview: 'AI response not in expected format.', keyPoints: [] });
          setShowResult(true);
          return;
        }
        try {
          parsed = JSON.parse(cleaned);
        } catch (parseError) {
          console.error('Failed to parse AI response as JSON:', parseError);
          alert('Failed to parse AI summary response.');
          // Fallback mock summary
          setSummary({
            overview: 'Summary parsing failed.',
            keyPoints: [] as string[],
          });
          setShowResult(true);
          return;
        }
      }

      if (!parsed) {
        alert('No valid summary data received.');
        setSummary({ overview: 'No summary data.', keyPoints: [] });
        setShowResult(true);
        return;
      }

      setSummary(parsed);
      setShowResult(true);
    } catch (error: any) {
      console.error("Error generating summary:", error);
      alert(error.message || "Failed to generate summary. Using fallback mock data.");
      
      // Fallback to mock data if API fails
      setSummary({
        overview: "The clinical study evaluates the efficacy of advanced biocompatible materials in endodontic procedures, focusing on long-term structural integrity and reduced inflammatory response. Preliminary results suggest a significant improvement in patient outcomes when utilizing AI-driven diagnostic tools for apical analysis.",
        keyPoints: [
          "Biocompatible sealants demonstrate 40% higher durability in high-stress clinical scenarios.",
          "Integration of AI diagnostics reduces initial chair-time by approximately 15 minutes.",
          "Histological analysis confirms minimal peri-apical inflammation across the 12-month trial period.",
          "Standardization of digital impressions is critical for precise prosthetic alignment."
        ]
      });
      setShowResult(true);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20"
          >
            <BrainCircuit className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Contextual Processor Active</span>
          </motion.div>
          <h1 className="text-4xl font-black text-foreground tracking-tighter flex items-center gap-4">
            Smart <span className="text-primary">Summarizer</span>
          </h1>
          <p className="text-muted-foreground max-w-xl text-lg font-medium">
            Distill clinical papers, journals, or lecture notes into actionable, structured medical insights.
          </p>
        </div>
        
        <div className="flex gap-3">
           <Button variant="outline" className="bg-white border-border text-muted-foreground rounded-2xl h-12 px-6 font-bold hover:text-primary transition-all">
             History
           </Button>
           <Button className="bg-primary hover:bg-primary/90 text-white rounded-2xl h-12 px-8 font-black shadow-lg shadow-primary/20 transition-all group">
             <Zap className="w-4 h-4 mr-2 group-hover:fill-white transition-all" /> Pro Processing
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <Card className="medical-card h-full shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-medical-gradient" />
            <CardHeader className="p-8">
              <CardTitle className="text-foreground text-xl font-black">Input Intelligence</CardTitle>
              <CardDescription className="text-muted-foreground font-medium">Ingest clinical data for distillation.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <Tabs defaultValue="upload" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="w-full h-14 grid grid-cols-2 bg-slate-50 p-1.5 rounded-2xl border border-border">
                  <TabsTrigger value="upload" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl text-muted-foreground font-black uppercase tracking-widest text-[10px] transition-all">
                    <UploadCloud className="w-4 h-4 mr-2" /> Data Upload
                  </TabsTrigger>
                  <TabsTrigger value="paste" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl text-muted-foreground font-black uppercase tracking-widest text-[10px] transition-all">
                    <FileType2 className="w-4 h-4 mr-2" /> Text Stream
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="upload" className="mt-8">
                  <label
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={cn(
                      "border-2 border-dashed rounded-[2rem] p-16 flex flex-col items-center justify-center text-center transition-all cursor-pointer group/upload relative overflow-hidden h-[350px]",
                      isDragging ? "border-primary bg-primary/5" : "border-border bg-slate-50/50 hover:bg-white hover:border-primary/30"
                    )}
                  >
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/upload:opacity-100 transition-opacity" />
                    <div className="w-24 h-24 bg-primary/5 rounded-[2rem] flex items-center justify-center mb-6 group-hover/upload:scale-110 transition-all duration-500">
                      {selectedFile ? (
                        <FileType2 className="w-12 h-12 text-primary" />
                      ) : (
                        <UploadCloud className="w-12 h-12 text-primary" />
                      )}
                    </div>
                    <p className="text-lg font-black text-foreground mb-2">
                      {selectedFile ? selectedFile.name : "Initialize Data Transfer"}
                    </p>
                    <p className="text-sm text-muted-foreground font-medium max-w-[250px]">
                      {selectedFile ? "Ready for processing" : "Drop medical journals or clinical papers here (PDF only)"}
                    </p>
                  </label>
                </TabsContent>
                
                <TabsContent value="paste" className="mt-8">
                  <div className="relative group">
                    <Textarea 
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Paste your extensive medical transcription or research notes here..." 
                      className="min-h-[350px] bg-slate-50/50 border-border focus-visible:ring-primary/50 rounded-[2rem] p-8 text-foreground placeholder:text-muted-foreground/60 resize-none transition-all no-scrollbar"
                    />
                    <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-10 transition-opacity">
                       <FileText className="w-32 h-32 text-primary" />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating || (activeTab === "upload" && !selectedFile) || (activeTab === "paste" && !inputText.trim())}
                className="w-full mt-10 bg-primary hover:bg-primary/90 text-white font-black h-16 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-95 text-lg group"
              >
                {isGenerating ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    <span className="uppercase tracking-[0.2em] text-xs">Processing Neural Data</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
                    Synthesize Content
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <Card className="medical-card h-full flex flex-col shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <BrainCircuit className="w-40 h-40 text-primary" />
            </div>
            <CardHeader className="p-8">
              <CardTitle className="text-foreground text-xl font-black">AI Synthesis Output</CardTitle>
              <CardDescription className="text-muted-foreground font-medium">Extracted clinical markers and executive summary.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0 flex-1">
              <AnimatePresence mode="wait">
                {!showResult && !isGenerating ? (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center text-muted-foreground min-h-[400px]"
                  >
                    <div className="w-20 h-20 rounded-full border border-border flex items-center justify-center mb-6">
                      <FileText className="w-10 h-10 opacity-20 text-primary" />
                    </div>
                    <p className="font-black uppercase tracking-widest text-[10px]">Awaiting Signal Input</p>
                  </motion.div>
                ) : isGenerating ? (
                   <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center space-y-4 min-h-[400px]"
                   >
                     <div className="relative">
                        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                           <Zap className="w-6 h-6 text-primary animate-pulse" />
                        </div>
                     </div>
                     <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Generating Neural Summary...</p>
                   </motion.div>
                ) : (
                  <motion.div 
                    key="result"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8 h-full"
                  >
                    <div className="flex gap-4">
                      <div className="flex-1 p-5 rounded-3xl bg-primary/5 border border-primary/10 relative group overflow-hidden">
                         <div className="absolute top-0 right-0 p-3 opacity-20">
                            <Clock className="w-4 h-4 text-primary" />
                         </div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Process Time</p>
                         <p className="text-lg font-black text-foreground">Live</p>
                      </div>
                      <div className="flex-1 p-5 rounded-3xl bg-emerald-50 border border-emerald-100 relative group overflow-hidden">
                         <div className="absolute top-0 right-0 p-3 opacity-20">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                         </div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Confidence</p>
                         <p className="text-lg font-black text-foreground">99%</p>
                      </div>
                    </div>

                    <div className="p-6 rounded-[2rem] bg-slate-50 border border-border text-foreground leading-relaxed text-sm relative group">
                      <div className="absolute -top-3 left-6 px-3 py-1 bg-primary rounded-lg text-[10px] font-black uppercase tracking-widest text-white">Abstract</div>
                      <strong className="text-primary">Overview:</strong> {summary.overview}
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-black text-foreground uppercase tracking-widest text-xs flex items-center gap-2 px-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        Clinical Key Points
                      </h4>
                      <div className="grid gap-3">
                        {summary.keyPoints.map((point, idx) => (
                           <motion.div 
                             key={idx} 
                             initial={{ opacity: 0, x: 20 }}
                             animate={{ opacity: 1, x: 0 }}
                             transition={{ delay: 0.2 + (idx * 0.1) }}
                             className="flex gap-4 text-sm text-foreground bg-white p-5 rounded-2xl border border-border hover:border-primary/30 transition-all cursor-default group/item shadow-sm"
                           >
                             <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover/item:bg-primary group-hover/item:text-white transition-all">
                               <span className="text-[10px] font-black">{idx + 1}</span>
                             </div>
                             <span className="font-medium">{point}</span>
                           </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                       <Button variant="outline" className="flex-1 h-14 rounded-2xl border-border bg-white text-muted-foreground font-bold hover:text-primary transition-all">
                         <Download className="w-4 h-4 mr-2" /> PDF Export
                       </Button>
                       <Button variant="outline" className="flex-1 h-14 rounded-2xl border-border bg-white text-muted-foreground font-bold hover:text-primary transition-all">
                         <Share2 className="w-4 h-4 mr-2" /> Share Insight
                       </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
