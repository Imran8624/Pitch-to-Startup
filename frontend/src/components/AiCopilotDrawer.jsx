import React, { useState } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  ShieldCheck, 
  Cpu, 
  HelpCircle,
  Database,
  Bookmark
} from 'lucide-react';

export default function AiCopilotDrawer({ isOpen, onClose, currentUser }) {
  const [activeMode, setActiveMode] = useState(currentUser.role === 'INVESTOR' ? 'INVESTOR' : 'FOUNDER');
  const [messages, setMessages] = useState([
    {
      sender: 'AI Copilot',
      text: `Hello! I am StartupHub's Spring AI RAG Copilot. I ingest Pitch Decks into PostgreSQL pgvector (HNSW similarity) to perform role-aware analysis.`,
      citations: [],
      time: 'Just now'
    }
  ]);
  const [query, setQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [pdfUploaded, setPdfUploaded] = useState(true);
  const [isThinking, setIsThinking] = useState(false);

  if (!isOpen) return null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMsg = {
      sender: 'You',
      text: query,
      citations: [],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setIsThinking(true);

    setTimeout(() => {
      let aiResponseText = '';
      let mockCitations = [];

      if (activeMode === 'INVESTOR') {
        aiResponseText = `[VC Due Diligence Result]\nBased on the ingested pitch deck context in pgvector:\n• Current MRR: $35,000 with a 185.5% YoY ARR growth trajectory.\n• LTV/CAC Ratio: 4.8x based on Enterprise SaaS cohort retention.\n• Risk Assessment: High customer concentration in early pilots, mitigated by 3 multi-year contracts signed in Q2 2026.`;
        mockCitations = [
          'Chunk #1 (pgvector sim: 0.92): Page 4 — Financial Metrics & MRR Cohort Table',
          'Chunk #2 (pgvector sim: 0.88): Page 7 — Enterprise Audit Contracts & CAC Analysis'
        ];
      } else {
        aiResponseText = `[Founder Pitch Evaluation]\nPitch Structure Score: 8.8 / 10\n• Problem Statement: Exceptionally strong clarity on enterprise compliance friction.\n• Traction Slide: Clear MRR metrics, but consider adding net revenue retention %.\n• Ask Slide: Explicit breakdown of $2.5M allocation (60% R&D, 40% GTM) is top-tier.`;
        mockCitations = [
          'Chunk #3 (pgvector sim: 0.94): Page 2 — Problem Definition & Market Pain',
          'Chunk #4 (pgvector sim: 0.85): Page 9 — Funding Ask & Capital Deployment'
        ];
      }

      const aiMsg = {
        sender: 'AI Copilot',
        text: aiResponseText,
        citations: mockCitations,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsThinking(false);
    }, 1200);
  };

  const handleSimulatedPdfUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setPdfUploaded(true);
      setMessages(prev => [
        ...prev,
        {
          sender: 'AI Copilot',
          text: `Ingested "${file.name}" via PagePdfDocumentReader + TokenTextSplitter. Generated 14 vector embeddings in PostgreSQL pgvector store.`,
          citations: [],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-950 border-l border-white/10 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 border-b border-white/10 bg-slate-900/50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <Bot className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">AI Pitch Deck RAG Copilot</h3>
                <span className="text-[10px] text-slate-400 font-mono">Spring AI + pgvector (HNSW Index)</span>
              </div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Mode Switcher & PDF Ingestion Status */}
          <div className="p-4 bg-slate-900/30 border-b border-white/5 space-y-3">
            <div className="flex bg-slate-900 p-1 rounded-xl border border-white/10 text-xs">
              <button
                onClick={() => setActiveMode('FOUNDER')}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${activeMode === 'FOUNDER' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Founder Pitch Evaluator
              </button>
              <button
                onClick={() => setActiveMode('INVESTOR')}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${activeMode === 'INVESTOR' ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Investor Due Diligence
              </button>
            </div>

            {/* PDF Upload Simulator */}
            <div className="p-3 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-emerald-400" />
                <span className="text-xs text-slate-200 font-medium truncate max-w-[180px]">
                  Quantum_AI_Pitch_Deck.pdf
                </span>
              </div>

              <label className="cursor-pointer px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 text-[11px] font-semibold transition-colors flex items-center gap-1">
                <UploadCloud className="h-3.5 w-3.5" />
                <span>{isUploading ? 'Ingesting...' : 'Ingest PDF'}</span>
                <input type="file" accept=".pdf" className="hidden" onChange={handleSimulatedPdfUpload} />
              </label>
            </div>
          </div>

          {/* Chat Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'You' ? 'items-end' : 'items-start'}`}
              >
                <div className={`p-3.5 rounded-2xl text-xs max-w-[88%] leading-relaxed ${
                  m.sender === 'You'
                    ? 'bg-emerald-600 text-white rounded-br-none'
                    : 'bg-slate-900 border border-white/10 text-slate-200 rounded-bl-none'
                }`}>
                  <div className="flex items-center justify-between gap-2 mb-1 border-b border-white/10 pb-1">
                    <span className="font-bold text-[10px] opacity-80">{m.sender}</span>
                    <span className="text-[9px] opacity-60 font-mono">{m.time}</span>
                  </div>
                  <p className="whitespace-pre-line">{m.text}</p>

                  {/* Citations list if present */}
                  {m.citations && m.citations.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-white/10 space-y-1">
                      <span className="text-[9px] uppercase font-bold text-cyan-400 flex items-center gap-1">
                        <Database className="h-3 w-3" /> Vector Citations (pgvector):
                      </span>
                      {m.citations.map((c, i) => (
                        <p key={i} className="text-[10px] text-slate-400 bg-white/5 p-1.5 rounded border border-white/5 font-mono">
                          {c}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="flex items-center gap-2 text-xs text-emerald-400 p-2 bg-slate-900/50 rounded-xl border border-white/5 w-max">
                <Cpu className="h-4 w-4 animate-spin text-emerald-400" />
                <span>Searching pgvector embeddings &amp; generating RAG output...</span>
              </div>
            )}
          </div>

          {/* Prompt Form */}
          <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-slate-900/50 flex items-center gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={activeMode === 'INVESTOR' ? "Ask about MRR, LTV, CAC, or moat..." : "Ask how to improve pitch structure..."}
              className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={isThinking}
              className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-all shadow-md"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
