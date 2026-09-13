import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Sparkles, 
  ShieldCheck, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  FileText, 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  Building2, 
  CheckCircle2, 
  Video, 
  AlertTriangle, 
  Lightbulb, 
  Maximize2, 
  Minimize2,
  Share2,
  Bookmark,
  Check
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { soundEffects } from '../utils/audioEffects';

export default function PitchDeckModal({
  startup,
  deckData,
  isOpen,
  onClose,
  onOpenTermSheet,
  onNavigateToWebRtc
}) {
  if (!isOpen || !startup || !deckData) return null;

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('SLIDES'); // 'SLIDES', 'AI_DILIGENCE', 'NOTES'
  const [investorNotes, setInvestorNotes] = useState('');
  const [savedNotesMessage, setSavedNotesMessage] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [dataRoomRequested, setDataRoomRequested] = useState(false);

  const modalContainerRef = useRef(null);
  const audioIntervalRef = useRef(null);

  const slides = deckData.slides || [];
  const currentSlide = slides[currentSlideIndex] || slides[0];
  const elevatorPitch = deckData.elevatorPitch;
  const aiEvaluation = deckData.aiEvaluation;

  // Load saved notes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`notes_startup_${startup.id}`);
    if (saved) setInvestorNotes(saved);
  }, [startup.id]);

  // Audio pitch player simulation timer
  useEffect(() => {
    if (isPlayingAudio) {
      audioIntervalRef.current = setInterval(() => {
        setAudioProgress(prev => {
          if (prev >= 100) {
            setIsPlayingAudio(false);
            return 0;
          }
          return prev + 1.66; // 60 seconds total
        });
      }, 1000);
    } else {
      clearInterval(audioIntervalRef.current);
    }
    return () => clearInterval(audioIntervalRef.current);
  }, [isPlayingAudio]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        goToNextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        goToPrevSlide();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex, slides.length]);

  const goToNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      soundEffects.playSlideClick();
      setCurrentSlideIndex(prev => prev + 1);
    }
  };

  const goToPrevSlide = () => {
    if (currentSlideIndex > 0) {
      soundEffects.playSlideClick();
      setCurrentSlideIndex(prev => prev - 1);
    }
  };

  const handleSaveNotes = () => {
    localStorage.setItem(`notes_startup_${startup.id}`, investorNotes);
    setSavedNotesMessage(true);
    setTimeout(() => setSavedNotesMessage(false), 2500);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (modalContainerRef.current?.requestFullscreen) {
        modalContainerRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Export Executive Pitch Deck to PDF via jsPDF
  const exportPitchDeckPdf = () => {
    setIsExportingPdf(true);
    try {
      const doc = new jsPDF({
        unit: 'pt',
        format: 'a4',
        orientation: 'landscape'
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      slides.forEach((slide, idx) => {
        if (idx > 0) doc.addPage();

        // Dark Background
        doc.setFillColor(11, 15, 25);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');

        // Top Accent Bar
        doc.setFillColor(16, 185, 129);
        doc.rect(0, 0, pageWidth, 8, 'F');

        // Header
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(16, 185, 129);
        doc.setFontSize(11);
        doc.text(`STARTUPHUB VERIFIED DEALFLOW • SLIDE ${idx + 1} OF ${slides.length}`, 40, 36);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text(slide.title, 40, 70);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(148, 163, 184);
        doc.setFontSize(12);
        doc.text(slide.subtitle, 40, 92);

        // Horizontal Divider
        doc.setDrawColor(255, 255, 255);
        doc.setLineWidth(0.5);
        doc.line(40, 110, pageWidth - 40, 110);

        let yPos = 145;

        // Slide Content
        if (slide.stats) {
          doc.setFont('helvetica', 'bold');
          slide.stats.forEach((st, sIdx) => {
            const xPos = 40 + sIdx * 180;
            doc.setFontSize(10);
            doc.setTextColor(148, 163, 184);
            doc.text(st.label.toUpperCase(), xPos, yPos);
            doc.setFontSize(16);
            doc.setTextColor(255, 255, 255);
            doc.text(st.value, xPos, yPos + 22);
          });
          yPos += 70;
        }

        if (slide.bulletPoints) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(12);
          doc.setTextColor(226, 232, 240);
          slide.bulletPoints.forEach((point) => {
            doc.text(`•  ${point}`, 45, yPos);
            yPos += 26;
          });
        }

        // AI Moat Takeaway Box at bottom
        doc.setFillColor(15, 23, 42);
        doc.roundedRect(40, pageHeight - 85, pageWidth - 80, 48, 8, 8, 'F');
        doc.setDrawColor(16, 185, 129);
        doc.roundedRect(40, pageHeight - 85, pageWidth - 80, 48, 8, 8, 'D');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(16, 185, 129);
        doc.text('AI INVESTMENT MOAT TAKEAWAY:', 55, pageHeight - 65);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(203, 213, 225);
        doc.text(slide.aiMoatTakeaway || 'Strong defensibility and clear execution runway.', 55, pageHeight - 50);

        // Footer
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text(`Confidential • StartupHub Syndicate Dealflow • ${startup.name}`, 40, pageHeight - 18);
        doc.text(`${startup.city}, ${startup.country} • Founder: ${startup.founder || startup.founderName}`, pageWidth - 260, pageHeight - 18);
      });

      doc.save(`${startup.name.replace(/\s+/g, '_')}_Official_Pitch_Deck.pdf`);
    } catch (err) {
      console.error('PDF generation error', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-lg p-2 sm:p-4 animate-fade-in">
      <div 
        ref={modalContainerRef}
        className="relative w-full max-w-5xl h-[92vh] glass-card rounded-3xl border border-white/15 shadow-2xl flex flex-col overflow-hidden bg-slate-950/95"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/80 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-xl bg-slate-800 border border-white/15 overflow-hidden flex items-center justify-center text-lg shrink-0">
              {startup.logoUrl ? (
                <img src={startup.logoUrl} alt={startup.name} className="h-full w-full object-cover" />
              ) : (
                startup.flag || '🌐'
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">{startup.name}</h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold shrink-0">
                  {startup.stage || 'SEED'}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-semibold shrink-0 hidden sm:inline-block">
                  Verified KYC
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate">
                {startup.sector} • Val: <span className="text-white font-semibold">{startup.valuation}</span> • Raising: <span className="text-emerald-400 font-semibold">{startup.totalFunding || startup.askAmount}</span>
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Slides, AI Diligence, Notes) & Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-800/90 rounded-xl p-1 border border-white/10 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('SLIDES')}
                className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'SLIDES' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                Slides ({currentSlideIndex + 1}/{slides.length})
              </button>
              <button
                onClick={() => setActiveTab('AI_DILIGENCE')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${activeTab === 'AI_DILIGENCE' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                AI Diligence ({aiEvaluation?.overallScore}/100)
              </button>
              <button
                onClick={() => setActiveTab('NOTES')}
                className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'NOTES' ? 'bg-purple-500 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                Notes
              </button>
            </div>

            <button
              onClick={exportPitchDeckPdf}
              disabled={isExportingPdf}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-xs font-semibold transition-all"
              title="Download Presentation PDF"
            >
              <Download className="h-3.5 w-3.5 text-emerald-400" />
              {isExportingPdf ? 'Generating...' : 'Export PDF'}
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              title="Close Pitch Deck"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col justify-between">
          {activeTab === 'SLIDES' && (
            <div className="flex-1 flex flex-col justify-between animate-fade-in">
              {/* Main Slide Canvas */}
              <div className="relative flex-1 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950 border border-white/10 p-6 sm:p-8 flex flex-col justify-between shadow-inner">
                {/* Slide Tag & Status */}
                <div className="flex items-center justify-between mb-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {currentSlide.tag}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    Slide {currentSlideIndex + 1} of {slides.length}
                  </span>
                </div>

                {/* Slide Title & Subtitle */}
                <div className="mb-4">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
                    {currentSlide.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1 font-normal max-w-3xl">
                    {currentSlide.subtitle}
                  </p>
                </div>

                {/* Slide Specific Visual Layouts */}
                <div className="my-auto py-3">
                  {/* COVER SLIDE */}
                  {currentSlide.slideType === 'COVER' && (
                    <div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
                        {currentSlide.stats?.map((st, i) => (
                          <div key={i} className="p-3.5 rounded-2xl bg-slate-800/80 border border-white/5 text-center">
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">{st.label}</span>
                            <span className={`text-lg sm:text-xl font-black ${st.color} mt-0.5 block`}>{st.value}</span>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-2 mt-4 bg-slate-900/80 p-4 rounded-2xl border border-white/5">
                        {currentSlide.bulletPoints?.map((pt, i) => (
                          <div key={i} className="flex items-center gap-2.5 text-xs text-slate-300">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                            <span>{pt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* PROBLEM SLIDE */}
                  {currentSlide.slideType === 'PROBLEM' && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {currentSlide.painPoints?.map((p, i) => (
                        <div key={i} className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 flex flex-col justify-between">
                          <div>
                            <span className="text-2xl mb-2 block">{p.icon}</span>
                            <h4 className="text-sm font-bold text-white mb-1">{p.title}</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
                          </div>
                          <span className="text-[10px] text-rose-400 font-semibold mt-3">Urgent Bottleneck</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* SOLUTION SLIDE */}
                  {currentSlide.slideType === 'SOLUTION' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentSlide.architecturePoints?.map((pt, i) => (
                        <div key={i} className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 flex items-start justify-between gap-3">
                          <div>
                            <h4 className="text-sm font-bold text-white">{pt.title}</h4>
                            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{pt.desc}</p>
                          </div>
                          <span className="px-2.5 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 font-black text-xs shrink-0">
                            {pt.metric}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* MARKET SLIDE */}
                  {currentSlide.slideType === 'MARKET' && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {currentSlide.marketSizing?.map((m, i) => (
                        <div key={i} className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/20 flex flex-col justify-between">
                          <div>
                            <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">{m.level}</span>
                            <p className="text-xl sm:text-2xl font-black text-white mt-1 mb-1">{m.size}</p>
                            <p className="text-xs text-slate-400 leading-relaxed">{m.desc}</p>
                          </div>
                          <span className="text-[10px] text-emerald-400 font-bold mt-2">Compound CAGR 31.8%</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* TRACTION SLIDE */}
                  {currentSlide.slideType === 'TRACTION' && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {currentSlide.unitEconomics?.map((u, i) => (
                        <div key={i} className={`p-3 rounded-2xl border ${u.highlight ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-800/60 border-white/5'}`}>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block truncate">{u.label}</span>
                          <span className={`text-base sm:text-lg font-black ${u.highlight ? 'text-emerald-400' : 'text-white'} mt-0.5 block`}>
                            {u.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* TEAM SLIDE */}
                  {currentSlide.slideType === 'TEAM' && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {currentSlide.teamMembers?.map((m, i) => (
                        <div key={i} className="p-4 rounded-2xl bg-slate-800/80 border border-white/10">
                          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-slate-950 font-black flex items-center justify-center text-xs mb-2">
                            {m.name.charAt(0)}
                          </div>
                          <h4 className="text-sm font-bold text-white">{m.name}</h4>
                          <span className="text-[11px] text-emerald-400 font-semibold block mb-1">{m.role}</span>
                          <p className="text-xs text-slate-400 leading-relaxed">{m.bio}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ASK SLIDE */}
                  {currentSlide.slideType === 'ASK' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Use of Funds Breakdown</span>
                        {currentSlide.useOfFunds?.map((u, i) => (
                          <div key={i} className="p-2.5 rounded-xl bg-slate-800/60 border border-white/5 flex items-center justify-between text-xs">
                            <span className="text-slate-300 font-medium truncate">{u.category}</span>
                            <span className="font-bold text-emerald-400">{u.percent}%</span>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">18-Month Key Milestones</span>
                        {currentSlide.milestones?.map((ms, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-slate-300 p-2 rounded-xl bg-white/5">
                            <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                            <span>{ms}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* AI Moat Takeaway Footer Pill */}
                <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span className="text-emerald-300 font-medium">
                      <strong>AI Takeaway:</strong> {currentSlide.aiMoatTakeaway}
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-400/80 uppercase font-bold shrink-0 hidden sm:inline">
                    Verified Signal
                  </span>
                </div>
              </div>

              {/* Slide Navigation Strip & Mini Controls */}
              <div className="mt-4 flex items-center justify-between gap-3">
                <button
                  onClick={goToPrevSlide}
                  disabled={currentSlideIndex === 0}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white text-xs font-bold transition-all border border-white/10"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>

                {/* Thumbnail Strip */}
                <div className="flex items-center gap-1.5 overflow-x-auto max-w-lg py-1 scrollbar-none">
                  {slides.map((s, idx) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        soundEffects.playSlideClick();
                        setCurrentSlideIndex(idx);
                      }}
                      className={`h-8 px-2.5 rounded-lg text-[11px] font-bold transition-all shrink-0 ${
                        currentSlideIndex === idx
                          ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                          : 'bg-slate-800/80 text-slate-400 hover:text-white border border-white/5'
                      }`}
                      title={s.tag}
                    >
                      {idx + 1}. {s.tag.split(' ')[0]}
                    </button>
                  ))}
                </div>

                <button
                  onClick={goToNextSlide}
                  disabled={currentSlideIndex === slides.length - 1}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* AI DILIGENCE TAB */}
          {activeTab === 'AI_DILIGENCE' && (
            <div className="space-y-4 animate-fade-in">
              {/* Scorecard Hero */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-transparent border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" /> Autonomous Investor Diligence Copilot
                  </span>
                  <h3 className="text-2xl font-black text-white mt-1">
                    {aiEvaluation.verdict}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Moat Grade: <strong className="text-white">{aiEvaluation.moatGrade}</strong> • Capital Efficiency: <strong className="text-cyan-400">{aiEvaluation.burnEfficiency}</strong>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-16 w-16 rounded-2xl bg-slate-900 border border-emerald-500/40 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-emerald-400">{aiEvaluation.overallScore}</span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase">Score</span>
                  </div>
                </div>
              </div>

              {/* Highlights & Risks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/20 space-y-2">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Key Investment Highlights
                  </h4>
                  {aiEvaluation.highlights?.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/20 space-y-2">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5" /> Key Diligence Risks to Validate
                  </h4>
                  {aiEvaluation.risks?.map((r, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <div className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comparable Multiples */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Public &amp; Private Valuation Multiples
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {aiEvaluation.comparableMultiples?.map((c, i) => (
                    <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-white block">{c.peer}</span>
                        <span className="text-[10px] text-slate-400">{c.stage}</span>
                      </div>
                      <span className="px-2 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold">{c.multiple}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Questions for Partner Meeting */}
              <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/20 space-y-2">
                <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Lightbulb className="h-3.5 w-3.5" /> AI Recommended Questions for 1-on-1 Partner Meeting
                </h4>
                {aiEvaluation.suggestedPartnerQuestions?.map((q, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-purple-500/10 text-xs text-purple-200">
                    "{q}"
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PRIVATE NOTES TAB */}
          {activeTab === 'NOTES' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Confidential Investor Diligence Notes</h3>
                  <p className="text-xs text-slate-400">Notes are saved privately to your encrypted local workspace.</p>
                </div>
                {savedNotesMessage && (
                  <span className="flex items-center gap-1 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/30">
                    <Check className="h-3.5 w-3.5" /> Notes Saved!
                  </span>
                )}
              </div>

              <textarea
                value={investorNotes}
                onChange={(e) => setInvestorNotes(e.target.value)}
                placeholder="Type your investment thesis, valuation feedback, follow-up questions, or co-investor syndication thoughts..."
                rows={12}
                className="w-full rounded-2xl bg-slate-900 border border-white/10 p-4 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 resize-none font-mono"
              />

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={handleSaveNotes}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg"
                >
                  Save Diligence Notes
                </button>
              </div>
            </div>
          )}

          {/* Founder Voice Elevator Audio Pitch Dock (Always available at bottom) */}
          {elevatorPitch && (
            <div className="mt-4 p-3 rounded-2xl bg-slate-900/90 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="h-10 w-10 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center font-bold transition-all shadow-lg shadow-emerald-500/30 shrink-0"
                  title={isPlayingAudio ? 'Pause Elevator Pitch' : 'Play 60-Sec Elevator Pitch'}
                >
                  {isPlayingAudio ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                </button>
                <div className="min-w-0 flex-1 sm:flex-initial">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1">
                      🎙️ Founder 60-Sec Elevator Pitch
                    </span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      {isPlayingAudio ? 'Playing' : 'Ready'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate max-w-md">
                    {elevatorPitch.chapters[Math.min(Math.floor(audioProgress / 25), 3)]?.text}
                  </p>
                </div>
              </div>

              {/* Audio Waveform Simulator */}
              <div className="flex items-center gap-1 h-6 w-full sm:w-48 px-2 justify-center">
                {elevatorPitch.audioWaveform.map((val, idx) => (
                  <div
                    key={idx}
                    className={`w-1 rounded-full transition-all duration-300 ${
                      isPlayingAudio && idx <= (audioProgress / 100) * 30
                        ? 'bg-emerald-400'
                        : 'bg-slate-700'
                    }`}
                    style={{
                      height: isPlayingAudio ? `${Math.max(20, (val * (Math.sin(Date.now() / 200 + idx) + 1.2)) / 2)}%` : `${val * 0.4}%`
                    }}
                  />
                ))}
              </div>

              {/* Action Buttons: Request Data Room & Generate Term Sheet */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setDataRoomRequested(true)}
                  disabled={dataRoomRequested}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-xs font-semibold transition-all shrink-0"
                >
                  {dataRoomRequested ? '✓ Access Granted' : 'Request Data Room'}
                </button>

                <button
                  onClick={() => {
                    onClose();
                    if (onOpenTermSheet) onOpenTermSheet(startup, deckData.termSheet);
                  }}
                  className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20 shrink-0"
                >
                  Generate Term Sheet
                </button>

                <button
                  onClick={() => {
                    onClose();
                    if (onNavigateToWebRtc) onNavigateToWebRtc(startup);
                  }}
                  className="px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-cyan-500/20 shrink-0 flex items-center gap-1.5"
                >
                  <Video className="h-3.5 w-3.5" />
                  1-on-1 Pitch
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
