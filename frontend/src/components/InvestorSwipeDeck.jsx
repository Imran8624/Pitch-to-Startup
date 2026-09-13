import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  X, 
  Sparkles, 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  Building2, 
  Zap, 
  CheckCircle2, 
  Calendar, 
  Video, 
  RotateCcw,
  ShieldCheck, 
  Globe, 
  MapPin, 
  RefreshCw,
  Star,
  Bookmark,
  FileText,
  Volume2,
  VolumeX,
  SlidersHorizontal,
  LayoutGrid,
  Layers,
  ArrowRight,
  Eye,
  Check,
  Award
} from 'lucide-react';
import { soundEffects } from '../utils/audioEffects';
import { getEnhancedStartupPitchData } from '../utils/pitchDeckGenerator';
import PitchDeckModal from './PitchDeckModal';
import TermSheetModal from './TermSheetModal';

const REGION_TABS = [
  { key: 'ALL', label: '🌍 All Global Hubs' },
  { key: 'NORTH_AMERICA', label: '🇺🇸 North America' },
  { key: 'EUROPE', label: '🇪🇺 Europe' },
  { key: 'ASIA_PACIFIC', label: '🇮🇳 Asia-Pacific' },
  { key: 'MIDDLE_EAST', label: '🇮🇱 Middle East' },
  { key: 'LATAM_AFRICA', label: '🇧🇷 LatAm & Africa' },
  { key: 'GLOBAL_REMOTE', label: '🌐 Global Mesh' }
];

export default function InvestorSwipeDeck({ onNavigateToWebRtc, currentUser }) {
  const [allStartups, setAllStartups] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipedHistory, setSwipedHistory] = useState([]); // [{ startup, direction }]
  const [watchlist, setWatchlist] = useState([]);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [viewMode, setViewMode] = useState('SWIPE'); // 'SWIPE' or 'GRID'
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  // Modals state
  const [matchedStartup, setMatchedStartup] = useState(null);
  const [activeDeckStartup, setActiveDeckStartup] = useState(null);
  const [activeDeckData, setActiveDeckData] = useState(null);
  const [termSheetTarget, setTermSheetTarget] = useState(null);
  const [notificationToast, setNotificationToast] = useState(null);

  // Drag physics state
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartTime, setDragStartTime] = useState(0);
  const [swipeExitAnimation, setSwipeExitAnimation] = useState(null); // 'LEFT', 'RIGHT', 'UP'

  const cardRef = useRef(null);

  // Fetch startups from backend API with fallback
  const fetchStartups = async () => {
    try {
      const res = await fetch('/api/v1/public/startups');
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setAllStartups(data);
          return;
        }
      }
    } catch (err) {
      console.warn('Vite proxy fetch fallback to direct backend url');
    }

    try {
      const res2 = await fetch('http://localhost:8080/api/v1/public/startups');
      if (res2.ok) {
        const data2 = await res2.json();
        if (data2 && data2.length > 0) {
          setAllStartups(data2);
        }
      }
    } catch (err2) {
      console.warn('Backend unavailable, using static directory fallback');
    }
  };

  useEffect(() => {
    fetchStartups();
  }, []);

  const filteredStartups = allStartups.filter(s => {
    if (selectedRegion === 'ALL') return true;
    return s.region === selectedRegion;
  });

  const currentCard = filteredStartups[currentIndex];
  const currentCardDeckData = currentCard ? getEnhancedStartupPitchData(currentCard) : null;

  // Keyboard controls for lightning dealflow review
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept if inside input or modal
      if (activeDeckStartup || termSheetTarget || matchedStartup) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleActionSwipe('LEFT');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleActionSwipe('RIGHT');
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleActionSwipe('UP');
      } else if (e.key === ' ' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        if (currentCard) handleOpenPitchDeck(currentCard);
      } else if (e.key === 'z' || e.key === 'Z' || e.key === 'u') {
        e.preventDefault();
        handleRewind();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleAudio();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, filteredStartups, activeDeckStartup, termSheetTarget, matchedStartup]);

  // Audio mute toggle
  const toggleAudio = () => {
    const muted = soundEffects.toggleMute();
    setIsAudioMuted(muted);
    triggerToast(muted ? 'Audio Effects Muted' : 'Audio Effects Enabled');
  };

  const triggerToast = (msg) => {
    setNotificationToast(msg);
    setTimeout(() => setNotificationToast(null), 3000);
  };

  // Drag physics handlers
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // primary button only
    setIsDragging(true);
    setDragStartTime(Date.now());
    cardRef.current = { startX: e.clientX, startY: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !cardRef.current) return;
    const dx = e.clientX - cardRef.current.startX;
    const dy = e.clientY - cardRef.current.startY;
    setDragOffset({ x: dx, y: dy });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const { x, y } = dragOffset;
    const threshold = 110;

    if (y < -120 && Math.abs(x) < 90) {
      // Super Like upward swipe
      handleActionSwipe('UP');
    } else if (x > threshold) {
      // Swipe Right (Interested / Match)
      handleActionSwipe('RIGHT');
    } else if (x < -threshold) {
      // Swipe Left (Pass)
      handleActionSwipe('LEFT');
    } else {
      // Spring back
      setDragOffset({ x: 0, y: 0 });
    }
  };

  // Touch handlers for mobile / tablet drag gestures
  const handleTouchStart = (e) => {
    if (e.touches.length !== 1) return;
    setIsDragging(true);
    setDragStartTime(Date.now());
    cardRef.current = { startX: e.touches[0].clientX, startY: e.touches[0].clientY };
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !cardRef.current) return;
    const dx = e.touches[0].clientX - cardRef.current.startX;
    const dy = e.touches[0].clientY - cardRef.current.startY;
    setDragOffset({ x: dx, y: dy });
  };

  const handleTouchEnd = () => {
    handleMouseUp();
  };

  // Main Action Swipe trigger (Buttons or Drag release)
  const handleActionSwipe = (direction) => {
    if (!currentCard) return;

    if (direction === 'LEFT') {
      soundEffects.playPass();
      setSwipeExitAnimation('LEFT');
    } else if (direction === 'RIGHT') {
      soundEffects.playLike();
      setSwipeExitAnimation('RIGHT');
    } else if (direction === 'UP') {
      soundEffects.playSuperLike();
      setSwipeExitAnimation('UP');
    }

    setTimeout(() => {
      // Record in undo history
      setSwipedHistory(prev => [
        { startup: currentCard, direction, index: currentIndex },
        ...prev
      ]);

      if (direction === 'RIGHT' || direction === 'UP') {
        soundEffects.playMatchSuccess();
        setMatchedStartup({ ...currentCard, isSuperLike: direction === 'UP' });
      }

      setCurrentIndex(prev => prev + 1);
      setDragOffset({ x: 0, y: 0 });
      setSwipeExitAnimation(null);
    }, 240);
  };

  // Undo / Rewind last swiped startup
  const handleRewind = () => {
    if (swipedHistory.length === 0 || currentIndex === 0) {
      triggerToast('No swiped startups to rewind');
      return;
    }

    soundEffects.playRewind();
    const lastItem = swipedHistory[0];
    setSwipedHistory(prev => prev.slice(1));
    setCurrentIndex(prev => Math.max(0, prev - 1));
    triggerToast(`Rewound: ${lastItem.startup.name}`);
  };

  // Bookmark / Watchlist toggle
  const toggleBookmark = (startup) => {
    if (!startup) return;
    const exists = watchlist.some(w => w.id === startup.id);
    if (exists) {
      setWatchlist(prev => prev.filter(w => w.id !== startup.id));
      triggerToast(`Removed ${startup.name} from Watchlist`);
    } else {
      setWatchlist(prev => [startup, ...prev]);
      triggerToast(`Saved ${startup.name} to Watchlist`);
    }
  };

  const isBookmarked = currentCard && watchlist.some(w => w.id === currentCard.id);

  // Open Full Pitch Deck Studio Modal
  const handleOpenPitchDeck = (startup) => {
    const deck = getEnhancedStartupPitchData(startup);
    setActiveDeckData(deck);
    setActiveDeckStartup(startup);
  };

  // Reset current region deck
  const resetDeck = () => {
    setCurrentIndex(0);
    setSwipedHistory([]);
  };

  const handleRegionChange = (regKey) => {
    setSelectedRegion(regKey);
    setCurrentIndex(0);
  };

  // Compute live drag transforms & rotation
  const rotationAngle = dragOffset.x * 0.08;
  const cardTransform = isDragging
    ? `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) rotate(${rotationAngle}deg)`
    : swipeExitAnimation === 'LEFT'
    ? 'translate3d(-140%, 0, 0) rotate(-20deg)'
    : swipeExitAnimation === 'RIGHT'
    ? 'translate3d(140%, 0, 0) rotate(20deg)'
    : swipeExitAnimation === 'UP'
    ? 'translate3d(0, -140%, 0) scale(1.1)'
    : 'translate3d(0, 0, 0) rotate(0deg)';

  // Dynamic stamp badge opacities
  const rightOpacity = Math.max(0, Math.min(1, dragOffset.x / 80));
  const leftOpacity = Math.max(0, Math.min(1, -dragOffset.x / 80));
  const upOpacity = Math.max(0, Math.min(1, -dragOffset.y / 80));

  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex flex-col items-center justify-start p-3 sm:p-6 overflow-hidden animate-fade-in select-none">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-10 left-1/4 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Notification Toast */}
      {notificationToast && (
        <div className="fixed top-20 z-50 animate-bounce">
          <div className="px-4 py-2 rounded-2xl bg-slate-900/95 border border-emerald-500/40 text-emerald-400 text-xs font-bold shadow-2xl flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{notificationToast}</span>
          </div>
        </div>
      )}

      {/* Header Info & View Mode Switcher */}
      <div className="text-center max-w-3xl mb-4 w-full">
        <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Globe className="h-3.5 w-3.5" />
            AI Dealflow Swiper &amp; Pitch Deck Studio
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Toggle */}
            <button
              onClick={toggleAudio}
              className={`p-2 rounded-xl border text-xs font-semibold transition-all ${
                isAudioMuted 
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' 
                  : 'bg-slate-800 border-white/10 text-emerald-400'
              }`}
              title={isAudioMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
            >
              {isAudioMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>

            {/* Watchlist Quick Button */}
            <button
              onClick={() => setIsWatchlistOpen(!isWatchlistOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-xs font-semibold text-slate-200 transition-all"
            >
              <Bookmark className="h-3.5 w-3.5 text-amber-400" />
              Watchlist ({watchlist.length})
            </button>

            {/* View Mode Toggle: Swipe vs Pipeline Grid */}
            <div className="flex items-center bg-slate-900 rounded-xl p-1 border border-white/10">
              <button
                onClick={() => setViewMode('SWIPE')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'SWIPE' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="h-3.5 w-3.5" /> Swiper
              </button>
              <button
                onClick={() => setViewMode('GRID')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'GRID' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" /> Pipeline
              </button>
            </div>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Swipe Pitch Decks &amp; Fund Global Founders
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl mx-auto">
          Drag cards left to pass, right to match, or up for Super-Like. Inspect verified 7-slide pitch decks, founder elevator audio, and AI valuation scorecards.
        </p>

        {/* Global Hub Filter Chips */}
        <div className="flex items-center justify-center gap-1.5 overflow-x-auto max-w-full py-2.5 scrollbar-none">
          {REGION_TABS.map((rt) => (
            <button
              key={rt.key}
              onClick={() => handleRegionChange(rt.key)}
              className={`px-3 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all ${
                selectedRegion === rt.key
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {rt.label}
            </button>
          ))}
        </div>
      </div>

      {/* VIEW MODE 1: INTERACTIVE SWIPER CARD DECK */}
      {viewMode === 'SWIPE' && (
        <div className="relative w-full max-w-md h-[610px] flex items-center justify-center">
          {currentCard ? (
            <div 
              ref={cardRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{
                transform: cardTransform,
                transition: isDragging ? 'none' : 'transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1)'
              }}
              className="absolute inset-0 glass-card rounded-3xl p-5 flex flex-col justify-between border border-white/15 shadow-2xl cursor-grab active:cursor-grabbing bg-slate-950/90 overflow-hidden"
            >
              {/* Dynamic Overlay Stamp Badges while Dragging */}
              {/* LIKE STAMP */}
              <div 
                style={{ opacity: rightOpacity }}
                className="absolute top-8 left-8 z-30 pointer-events-none transform -rotate-12 border-4 border-emerald-400 bg-emerald-500/20 px-4 py-1.5 rounded-2xl text-emerald-400 font-black text-2xl tracking-wider shadow-xl shadow-emerald-500/40"
              >
                INTERESTED
              </div>

              {/* PASS STAMP */}
              <div 
                style={{ opacity: leftOpacity }}
                className="absolute top-8 right-8 z-30 pointer-events-none transform rotate-12 border-4 border-rose-500 bg-rose-500/20 px-4 py-1.5 rounded-2xl text-rose-500 font-black text-2xl tracking-wider shadow-xl shadow-rose-500/40"
              >
                PASS
              </div>

              {/* SUPER LIKE STAMP */}
              <div 
                style={{ opacity: upOpacity }}
                className="absolute top-20 left-1/2 -translate-x-1/2 z-30 pointer-events-none border-4 border-cyan-400 bg-cyan-500/20 px-5 py-2 rounded-2xl text-cyan-400 font-black text-2xl tracking-wider shadow-xl shadow-cyan-500/40 text-center"
              >
                ⭐ SUPER LIKE
              </div>

              {/* Top Bar: Sector, KYC, & AI Score Tag */}
              <div className="flex items-center justify-between shrink-0">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold truncate max-w-[180px]">
                  <Building2 className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{currentCard.sector}</span>
                </span>

                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-1 text-[11px] font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    <Sparkles className="h-3 w-3" />
                    <span>{currentCardDeckData?.aiEvaluation?.overallScore || 94} AI Score</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(currentCard);
                    }}
                    className={`p-1.5 rounded-full border transition-all ${
                      isBookmarked
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                    title={isBookmarked ? 'Remove Bookmark' : 'Save to Watchlist'}
                  >
                    <Bookmark className="h-3.5 w-3.5 fill-current" />
                  </button>
                </div>
              </div>

              {/* Startup Identity & Flag */}
              <div className="mt-2">
                <div className="flex items-center gap-3">
                  <div className="h-13 w-13 rounded-2xl overflow-hidden border border-white/15 bg-slate-800 shrink-0 flex items-center justify-center text-2xl shadow-inner">
                    {currentCard.logoUrl ? (
                      <img src={currentCard.logoUrl} alt={currentCard.name} className="h-full w-full object-cover" />
                    ) : (
                      currentCard.flag || '🌐'
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-black text-white tracking-tight truncate">{currentCard.name}</h2>
                      <span className="text-base shrink-0" title={currentCard.country}>{currentCard.flag || '🌐'}</span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium flex items-center gap-1 truncate">
                      <MapPin className="h-3 w-3 text-slate-500 shrink-0" />
                      {currentCard.city ? `${currentCard.city}, ${currentCard.country}` : 'Global Mesh'} • {currentCard.founder || currentCard.founderName}
                    </p>
                  </div>
                </div>
                
                <p className="text-xs text-slate-300 mt-2 font-normal leading-relaxed italic bg-white/5 p-2.5 rounded-xl border border-white/5 line-clamp-2">
                  "{currentCard.tagline || currentCard.description || 'Pioneering next-generation enterprise infrastructure for the global market.'}"
                </p>
              </div>

              {/* Core Financial Metrics: Ask & Valuation */}
              <div className="grid grid-cols-2 gap-2.5 mt-1">
                <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                  <span className="flex items-center justify-center gap-1 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                    <DollarSign className="h-3 w-3" /> Target Ask
                  </span>
                  <p className="text-base sm:text-lg font-black text-white mt-0.5">{currentCard.totalFunding || currentCard.askAmount || '$1,500,000'}</p>
                  <span className="text-[10px] text-slate-400">{currentCard.stage || 'SEED'} Stage</span>
                </div>

                <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-center">
                  <span className="flex items-center justify-center gap-1 text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                    <PieChart className="h-3 w-3" /> Valuation Cap
                  </span>
                  <p className="text-base sm:text-lg font-black text-white mt-0.5">{currentCard.valuation}</p>
                  <span className="text-[10px] text-emerald-400 font-bold">{currentCard.arrGrowthPct || currentCard.growth || '+200%'} ARR</span>
                </div>
              </div>

              {/* Traction & Ecosystem Readiness Banner */}
              <div className="p-2.5 rounded-2xl bg-slate-900/90 border border-white/10">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1">
                  <span className="flex items-center gap-1 text-amber-400">
                    <TrendingUp className="h-3.5 w-3.5" /> 🏛️ {currentCard.ecosystemHub || 'Global Hub'}
                  </span>
                  <span className="text-emerald-400 text-[11px] font-bold">{currentCard.arrGrowthPct || currentCard.growth} YoY</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
                  <div className="p-1.5 rounded-lg bg-white/5">
                    <span className="text-[9px] text-slate-400 uppercase block">ARR</span>
                    <span className="font-bold text-white text-xs">{currentCard.arr || '$450k'}</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-white/5">
                    <span className="text-[9px] text-slate-400 uppercase block">MRR</span>
                    <span className="font-bold text-emerald-400 text-xs">{currentCard.mrr || '$38k'}</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-white/5">
                    <span className="text-[9px] text-slate-400 uppercase block">Moat</span>
                    <span className="font-bold text-cyan-300 text-xs">A+ IP</span>
                  </div>
                </div>
              </div>

              {/* Pitch Deck & Elevator Audio Fast-Access Buttons */}
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenPitchDeck(currentCard);
                  }}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 hover:from-emerald-500/30 hover:to-cyan-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold shadow-md transition-all group"
                >
                  <FileText className="h-3.5 w-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                  View 7-Slide Deck
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenPitchDeck(currentCard);
                  }}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold transition-all"
                >
                  <Eye className="h-3.5 w-3.5 text-cyan-400" />
                  AI Diligence
                </button>
              </div>

              {/* Control Action Bar: Rewind, Pass, Super-Like, Match */}
              <div className="flex items-center justify-between px-2 pt-2 border-t border-white/10">
                {/* Rewind */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRewind();
                  }}
                  disabled={swipedHistory.length === 0}
                  className="h-11 w-11 flex items-center justify-center rounded-full bg-slate-900 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 disabled:opacity-20 hover:scale-110 shadow-lg transition-all"
                  title="Rewind / Undo Last Swipe [Z]"
                >
                  <RotateCcw className="h-5 w-5" />
                </button>

                {/* Pass */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleActionSwipe('LEFT');
                  }}
                  className="h-13 w-13 flex items-center justify-center rounded-full bg-slate-900 border border-rose-500/40 text-rose-500 hover:bg-rose-500/20 hover:scale-110 shadow-lg transition-all"
                  title="Pass [← Left Arrow]"
                >
                  <X className="h-6 w-6" />
                </button>

                {/* Super Like */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleActionSwipe('UP');
                  }}
                  className="h-12 w-12 flex items-center justify-center rounded-full bg-slate-900 border border-cyan-400/50 text-cyan-400 hover:bg-cyan-500/20 hover:scale-110 shadow-lg transition-all"
                  title="Super-Like [↑ Up Arrow]"
                >
                  <Star className="h-6 w-6 fill-cyan-400/30" />
                </button>

                {/* Match / Interested */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleActionSwipe('RIGHT');
                  }}
                  className="h-14 w-14 flex items-center justify-center rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 text-slate-950 font-black shadow-xl shadow-emerald-500/40 hover:scale-110 transition-all"
                  title="Interested / Match [→ Right Arrow]"
                >
                  <Heart className="h-7 w-7 fill-current" />
                </button>
              </div>

              {/* Bottom Hotkey Help hint */}
              <div className="text-center text-[10px] text-slate-400/80 -mb-1">
                Keys: <strong>←</strong> Pass • <strong>→</strong> Match • <strong>↑</strong> Super-Like • <strong>Space</strong> Deck • <strong>Z</strong> Undo
              </div>
            </div>
          ) : (
            /* Batch Catch-Up Complete State */
            <div className="glass-card rounded-3xl p-8 flex flex-col items-center justify-center text-center h-full border border-white/10 space-y-3 w-full bg-slate-950/80">
              <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Global Dealflow Batch Completed!</h3>
              <p className="text-xs text-slate-400 max-w-xs">
                You have reviewed all startups in the <strong>{REGION_TABS.find(r => r.key === selectedRegion)?.label || 'selected'}</strong> ecosystem directory.
              </p>
              
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={resetDeck}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reload Swiper Deck
                </button>

                <button
                  onClick={() => setViewMode('GRID')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-white/10 transition-all"
                >
                  <LayoutGrid className="h-4 w-4 text-cyan-400" />
                  View All in Pipeline
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW MODE 2: DEALFLOW PIPELINE GRID */}
      {viewMode === 'GRID' && (
        <div className="w-full max-w-6xl animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStartups.map((st) => {
              const deck = getEnhancedStartupPitchData(st);
              const isSaved = watchlist.some(w => w.id === st.id);

              return (
                <div 
                  key={st.id} 
                  className="glass-card rounded-2xl p-5 border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col justify-between bg-slate-950/80"
                >
                  <div>
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-xl overflow-hidden shrink-0">
                          {st.logoUrl ? (
                            <img src={st.logoUrl} alt={st.name} className="h-full w-full object-cover" />
                          ) : (
                            st.flag || '🌐'
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-sm font-bold text-white tracking-tight">{st.name}</h4>
                            <span>{st.flag}</span>
                          </div>
                          <p className="text-[11px] text-slate-400">{st.city}, {st.country}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleBookmark(st)}
                        className={`p-1.5 rounded-lg border text-xs transition-all ${
                          isSaved 
                            ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' 
                            : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Bookmark className="h-3.5 w-3.5 fill-current" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-300 italic line-clamp-2 mb-3 bg-white/5 p-2 rounded-xl">
                      "{st.tagline || st.description}"
                    </p>

                    {/* Financial Metrics */}
                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <span className="text-[9px] text-slate-400 uppercase block font-semibold">Target Ask</span>
                        <span className="font-bold text-emerald-400">{st.totalFunding || st.askAmount || '$1.5M'}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                        <span className="text-[9px] text-slate-400 uppercase block font-semibold">Valuation Cap</span>
                        <span className="font-bold text-cyan-300">{st.valuation}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleOpenPitchDeck(st)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      Inspect Deck
                    </button>

                    <button
                      onClick={() => setTermSheetTarget({ startup: st, termSheet: deck.termSheet })}
                      className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 text-xs font-semibold transition-all"
                    >
                      Term Sheet
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* WATCHLIST DRAWER */}
      {isWatchlistOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md h-full bg-slate-950 border-l border-white/10 p-6 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <Bookmark className="h-5 w-5 text-amber-400" />
                  <h3 className="text-lg font-bold text-white">Saved Watchlist</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    {watchlist.length} Startups
                  </span>
                </div>
                <button onClick={() => setIsWatchlistOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {watchlist.length === 0 ? (
                <div className="py-16 text-center text-slate-400 text-xs space-y-2">
                  <Bookmark className="h-8 w-8 mx-auto text-slate-600 mb-2" />
                  <p>Your watchlist is empty.</p>
                  <p>Click the bookmark icon on any startup card to save it here for diligence.</p>
                </div>
              ) : (
                <div className="space-y-3 overflow-y-auto max-h-[70vh] pr-1">
                  {watchlist.map((item) => (
                    <div key={item.id} className="p-3.5 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                          <span>{item.flag}</span>
                        </div>
                        <p className="text-[11px] text-slate-400">{item.sector} • Val: {item.valuation}</p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            setIsWatchlistOpen(false);
                            handleOpenPitchDeck(item);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-[11px]"
                        >
                          Deck
                        </button>
                        <button
                          onClick={() => toggleBookmark(item)}
                          className="p-1.5 text-slate-400 hover:text-rose-400"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setIsWatchlistOpen(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white text-xs font-semibold border border-white/10 transition-colors"
            >
              Close Drawer
            </button>
          </div>
        </div>
      )}

      {/* MATCH / CONNECTION MODAL */}
      {matchedStartup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
          <div className="glass-card w-full max-w-md rounded-3xl p-6 text-center border border-emerald-500/40 shadow-2xl relative bg-slate-950/95">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 mb-3 animate-bounce">
              <Sparkles className="h-8 w-8" />
            </div>
            
            <h2 className="text-2xl font-black text-white tracking-tight">
              {matchedStartup.isSuperLike ? '⭐ SUPER-LIKE PRIORITY MATCH!' : "IT'S A GLOBAL MATCH!"}
            </h2>
            <p className="text-xs text-emerald-400 font-semibold mt-1">
              Cross-Border Pitch Room Unlocked with {matchedStartup.founder || matchedStartup.founderName} ({matchedStartup.flag} {matchedStartup.city}, {matchedStartup.country})
            </p>

            <div className="my-4 p-3.5 rounded-2xl bg-slate-900 border border-white/10 text-left">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-xl overflow-hidden shrink-0">
                  {matchedStartup.logoUrl ? (
                    <img src={matchedStartup.logoUrl} alt={matchedStartup.name} className="h-full w-full object-cover" />
                  ) : (
                    matchedStartup.flag || '🌐'
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{matchedStartup.name}</h4>
                  <p className="text-xs text-slate-400">🏛️ {matchedStartup.ecosystemHub || matchedStartup.sector} • Val: {matchedStartup.valuation}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => {
                  setMatchedStartup(null);
                  if (onNavigateToWebRtc) onNavigateToWebRtc(matchedStartup);
                }}
                className="w-full btn-glow flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold text-sm shadow-lg"
              >
                <Video className="h-4 w-4" />
                Enter 1-on-1 WebRTC Pitch Room
              </button>

              <button
                onClick={() => {
                  const data = getEnhancedStartupPitchData(matchedStartup);
                  setMatchedStartup(null);
                  setTermSheetTarget({ startup: matchedStartup, termSheet: data.termSheet });
                }}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 font-semibold text-xs border border-emerald-500/30 transition-all"
              >
                Draft Investment Term Sheet
              </button>

              <button
                onClick={() => setMatchedStartup(null)}
                className="w-full py-2 text-xs text-slate-400 hover:text-white transition-colors"
              >
                Continue Swiping Global Startups
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULL PITCH DECK STUDIO MODAL */}
      <PitchDeckModal
        startup={activeDeckStartup}
        deckData={activeDeckData}
        isOpen={Boolean(activeDeckStartup && activeDeckData)}
        onClose={() => {
          setActiveDeckStartup(null);
          setActiveDeckData(null);
        }}
        onOpenTermSheet={(st, ts) => {
          setTermSheetTarget({ startup: st, termSheet: ts });
        }}
        onNavigateToWebRtc={onNavigateToWebRtc}
      />

      {/* TERM SHEET GENERATION MODAL */}
      <TermSheetModal
        isOpen={Boolean(termSheetTarget)}
        onClose={() => setTermSheetTarget(null)}
        startup={termSheetTarget?.startup}
        initialTermSheet={termSheetTarget?.termSheet}
        onTermSheetSent={(payload) => {
          triggerToast(`Term sheet sent to ${payload.startupName}!`);
        }}
      />

    </div>
  );
}
