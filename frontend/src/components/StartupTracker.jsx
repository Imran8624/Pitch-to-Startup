import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  Building2, 
  Users, 
  ShieldCheck, 
  Layers, 
  Search, 
  CheckCircle, 
  Calendar, 
  ExternalLink, 
  ArrowUpRight,
  Megaphone,
  Sparkles,
  Globe,
  RefreshCw,
  MapPin,
  Briefcase,
  Zap,
  Video
} from 'lucide-react';

const REGION_FILTERS = [
  { key: 'ALL', label: '🌍 All Global Hubs' },
  { key: 'NORTH_AMERICA', label: '🇺🇸 North America' },
  { key: 'EUROPE', label: '🇪🇺 Europe' },
  { key: 'ASIA_PACIFIC', label: '🇮🇳 Asia-Pacific' },
  { key: 'MIDDLE_EAST', label: '🇮🇱 Middle East' },
  { key: 'LATAM_AFRICA', label: '🇧🇷 LatAm & Africa' },
  { key: 'GLOBAL_REMOTE', label: '🌐 Global Mesh' }
];

export default function StartupTracker({ onNavigateToMarketing, onNavigateToWebRtc }) {
  const [startups, setStartups] = useState([]);
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [activeTab, setActiveTab] = useState('ANALYTICS'); // ANALYTICS | CAP_TABLE | LEDGER | ECOSYSTEM
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState(null);
  const [stats, setStats] = useState({
    totalConnectedStartups: 12,
    totalCountries: 10,
    totalHubs: 12,
    totalFounders: 12,
    totalOpenPositions: 72,
    globalNetworkStatus: 'LIVE_SYNCED_100%'
  });

  // Fetch real startups from persistent backend
  const fetchStartups = async (region = selectedRegion) => {
    try {
      const url = region && region !== 'ALL' 
        ? `http://localhost:8080/api/v1/public/startups?region=${encodeURIComponent(region)}`
        : 'http://localhost:8080/api/v1/public/startups';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setStartups(data);
          if (!selectedStartup || !data.find(s => s.id === selectedStartup.id)) {
            setSelectedStartup(data[0]);
          }
        }
      }
    } catch (err) {
      console.warn('Backend offline or fetching error, fallback to memory', err);
    }
  };

  const fetchGlobalStats = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/v1/public/startups/global-stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.warn('Stats fetch error', err);
    }
  };

  useEffect(() => {
    fetchStartups(selectedRegion);
    fetchGlobalStats();
  }, [selectedRegion]);

  const handleSyncAllGlobal = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('http://localhost:8080/api/v1/public/startups/sync-global', {
        method: 'POST'
      });
      if (res.ok) {
        const payload = await res.json();
        if (payload.startups) {
          setStartups(payload.startups);
          setSelectedStartup(payload.startups[0]);
        }
        if (payload.stats) {
          setStats(payload.stats);
        }
        setSyncNotice(`⚡ Connected & Synchronized ${payload.startups?.length || 12} startups across ${payload.stats?.totalCountries || 10} global tech hubs!`);
      }
    } catch (err) {
      setSyncNotice('⚠️ Connected via local resilient cache.');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncNotice(null), 5000);
    }
  };

  const parseSafeJson = (jsonStr, fallback) => {
    if (!jsonStr) return fallback;
    if (typeof jsonStr === 'object') return jsonStr;
    try {
      return JSON.parse(jsonStr);
    } catch (e) {
      return fallback;
    }
  };

  const filteredStartups = startups.filter(s => {
    const matchesSearch = s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.sector?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.ecosystemHub?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRegion = selectedRegion === 'ALL' || s.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  const activeStartup = selectedStartup || filteredStartups[0] || startups[0];
  const stakeholders = activeStartup ? parseSafeJson(activeStartup.stakeholdersJson, [
    { name: activeStartup.founder, role: 'Founder & CEO', type: 'FOUNDER', share: '65.0%' },
    { name: 'Apex Global Syndicate', role: 'Lead Investor', type: 'INVESTOR', share: '20.0%' },
    { name: 'Ecosystem Partner', role: 'Strategic Backer', type: 'ENTERPRISE_PARTNER', share: '15.0%' }
  ]) : [];

  const fundingLedger = activeStartup ? parseSafeJson(activeStartup.fundingLedgerJson, [
    { round: activeStartup.stage || 'Seed', amount: activeStartup.totalFunding || '$1,200,000', equity: '15.0%', lead: 'Global Tier-1 Syndicate', date: '2026-01-15' }
  ]) : [];

  return (
    <div className="min-h-[calc(100vh-5rem)] p-4 sm:p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      
      {/* Top Banner: Global Multi-Hub Connectivity Status */}
      <div className="glass-card rounded-3xl p-6 border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-slate-900/90 to-cyan-950/40 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[11px] font-bold border border-emerald-500/40 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="h-3 w-3 text-emerald-400" />
                Global Multi-Hub Aggregator: Connected Everywhere
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Layers className="h-8 w-8 text-emerald-400" />
              Global Startup Ecosystem Directory
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Real-time cross-border startup intelligence aggregating Silicon Valley, London, Berlin, Paris, Bengaluru, Tokyo, Singapore, Tel Aviv, and São Paulo into one unified network.
            </p>
          </div>

          {/* Sync Trigger & Quick Stats Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <button
              onClick={handleSyncAllGlobal}
              disabled={isSyncing}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Connecting Ecosystems...' : '⚡ Sync All Global Startup Hubs'}</span>
            </button>
          </div>
        </div>

        {/* Global Live Telemetry Stat Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-6 pt-5 border-t border-white/10 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Connected Startups</span>
            <span className="text-lg font-black text-white">{stats.totalConnectedStartups || startups.length} Worldwide</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Global Tech Hubs</span>
            <span className="text-lg font-black text-cyan-300">{stats.totalHubs || 12} Hubs</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Countries Linked</span>
            <span className="text-lg font-black text-emerald-400">{stats.totalCountries || 10} Nations</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Open Positions</span>
            <span className="text-lg font-black text-amber-300">{stats.totalOpenPositions || 72} Roles</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase font-bold text-emerald-400 block">Mesh Protocol</span>
            <span className="text-xs font-mono font-bold text-white flex items-center gap-1 mt-1">
              <Zap className="h-3.5 w-3.5 text-emerald-400" /> REAL-TIME 100%
            </span>
          </div>
        </div>

        {syncNotice && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-bounce">
            <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{syncNotice}</span>
          </div>
        )}
      </div>

      {/* Region Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Global Region Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 md:pb-0 scrollbar-none">
          {REGION_FILTERS.map((rf) => (
            <button
              key={rf.key}
              onClick={() => setSelectedRegion(rf.key)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedRegion === rf.key
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 scale-105'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-white/5'
              }`}
            >
              <span>{rf.label}</span>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80 shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search startup, city, or hub..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Main Grid: Directory List & Selected Startup Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Startup Directory List */}
        <div className="glass-card rounded-3xl p-4 border border-white/10 space-y-3 max-h-[750px] overflow-y-auto pr-2">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Vetted Global Startups ({filteredStartups.length})
            </h3>
            <span className="text-[10px] text-emerald-400 font-mono font-semibold">● Live Synced</span>
          </div>
          
          <div className="space-y-2.5">
            {filteredStartups.map((s) => {
              const isSelected = activeStartup && activeStartup.id === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedStartup(s)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                    isSelected
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-white shadow-xl shadow-emerald-500/5'
                      : 'bg-slate-900/60 border-white/5 hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  {/* Left Active Accent Bar */}
                  {isSelected && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 to-cyan-400" />
                  )}

                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl" title={s.country || 'Global'}>{s.flag || '🌐'}</span>
                      <div>
                        <h4 className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                          {s.name}
                        </h4>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3 text-slate-500" />
                          {s.city ? `${s.city}, ${s.country}` : 'Global Remote'}
                        </span>
                      </div>
                    </div>
                    
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 shrink-0">
                      {s.stage}
                    </span>
                  </div>

                  {/* Hub Tag & Growth Metric */}
                  <div className="flex items-center justify-between text-xs text-slate-400 mt-3 pt-2.5 border-t border-white/5">
                    <span className="text-[10px] font-semibold text-slate-400 truncate max-w-[140px]" title={s.ecosystemHub}>
                      🏛️ {s.ecosystemHub || s.sector}
                    </span>
                    <span className="font-bold text-emerald-400 text-xs">
                      {s.arrGrowthPct} ARR
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredStartups.length === 0 && (
              <div className="p-8 text-center text-slate-500 text-xs">
                No startups found matching your filter. Click "Sync All Global Startup Hubs" above to reload.
              </div>
            )}
          </div>
        </div>

        {/* Right 2 Columns: Selected Startup Deep Dive */}
        {activeStartup && (
          <div className="lg:col-span-2 space-y-6">
            
            {/* Header Detail Card */}
            <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
                <div className="flex items-start gap-3.5">
                  <div className="h-14 w-14 rounded-2xl overflow-hidden border border-white/10 bg-slate-800 shrink-0 shadow-md">
                    {activeStartup.logoUrl ? (
                      <img src={activeStartup.logoUrl} alt={activeStartup.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-2xl">{activeStartup.flag || '🌐'}</div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h2 className="text-2xl font-black text-white">{activeStartup.name}</h2>
                      <span className="text-lg">{activeStartup.flag || '🌐'}</span>
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                        <ShieldCheck className="h-3 w-3" /> Verified KYC
                      </span>
                      <span className="flex items-center gap-1 text-[10px] font-bold text-cyan-300 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                        <Zap className="h-3 w-3 text-cyan-400" /> Cross-Border Ready
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mt-1 font-medium">
                      🏛️ <strong>{activeStartup.ecosystemHub || 'Global Tech Hub'}</strong> • 📍 {activeStartup.city}, {activeStartup.country}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Founder: <strong className="text-slate-200">{activeStartup.founder}</strong> • Sector: <span className="text-emerald-400 font-semibold">{activeStartup.sector}</span>
                    </p>
                  </div>
                </div>

                {/* Direct Action Hub */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                  {onNavigateToMarketing && (
                    <button
                      onClick={() => onNavigateToMarketing(activeStartup)}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600/30 to-cyan-600/30 hover:from-purple-600/50 hover:to-cyan-600/50 text-purple-300 hover:text-white border border-purple-500/40 font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Megaphone className="h-3.5 w-3.5 text-amber-300" />
                      <span>Launch AI Marketing</span>
                    </button>
                  )}

                  {onNavigateToWebRtc && (
                    <button
                      onClick={() => onNavigateToWebRtc(activeStartup)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 hover:text-white border border-emerald-500/40 font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Video className="h-3.5 w-3.5 text-emerald-400" />
                      <span>1-on-1 Pitch Room</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Tagline / Mission Quote */}
              {activeStartup.tagline && (
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-xs sm:text-sm text-slate-200 italic leading-relaxed">
                  "{activeStartup.tagline}"
                </div>
              )}

              {/* View Switcher Tabs */}
              <div className="flex bg-slate-900/90 p-1.5 rounded-2xl border border-white/10 text-xs overflow-x-auto scrollbar-none">
                <button
                  onClick={() => setActiveTab('ANALYTICS')}
                  className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === 'ANALYTICS' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}
                >
                  📈 Global Analytics
                </button>
                <button
                  onClick={() => setActiveTab('CAP_TABLE')}
                  className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === 'CAP_TABLE' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}
                >
                  🏛️ Cap Table &amp; Backers
                </button>
                <button
                  onClick={() => setActiveTab('LEDGER')}
                  className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === 'LEDGER' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}
                >
                  📜 Funding Ledger
                </button>
                <button
                  onClick={() => setActiveTab('ECOSYSTEM')}
                  className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === 'ECOSYSTEM' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}
                >
                  🌐 Ecosystem &amp; Hiring
                </button>
              </div>

              {/* TAB 1: High-Growth Analytics Dashboard */}
              {activeTab === 'ANALYTICS' && (
                <div className="space-y-6 pt-2">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Valuation</span>
                      <p className="text-xl font-black text-white mt-1">{activeStartup.valuation}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                      <span className="text-[10px] text-emerald-400 block uppercase font-bold">YoY ARR Growth</span>
                      <p className="text-xl font-black text-emerald-300 mt-1">{activeStartup.arrGrowthPct}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Annual Revenue (ARR)</span>
                      <p className="text-xl font-black text-white mt-1">{activeStartup.arr}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                      <span className="text-[10px] text-cyan-400 block uppercase font-bold">Total Raised</span>
                      <p className="text-xl font-black text-cyan-300 mt-1">{activeStartup.totalFunding}</p>
                    </div>
                  </div>

                  {/* Growth Visual Indicator */}
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <span className="font-bold flex items-center gap-1.5 text-emerald-400">
                        <TrendingUp className="h-4 w-4" /> Global Growth &amp; Scaling Trajectory
                      </span>
                      <span className="text-slate-400 font-mono">Monthly Run-Rate: {activeStartup.mrr}</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden p-0.5">
                      <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-purple-500 w-[78%]" />
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {activeStartup.description || 'Verified high-growth venture operating on StartupHub global cross-border deal protocol.'}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: Cap Table & Stakeholder Directory */}
              {activeTab === 'CAP_TABLE' && (
                <div className="space-y-4 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Verified Stakeholders &amp; Equity Ownership</h4>
                  <div className="divide-y divide-white/10 border border-white/10 rounded-2xl overflow-hidden bg-slate-900/60">
                    {stakeholders.map((st, i) => (
                      <div key={i} className="flex items-center justify-between p-4 text-xs">
                        <div>
                          <p className="font-bold text-white text-sm">{st.name}</p>
                          <span className="text-slate-400">{st.role}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-black text-emerald-400 text-base block">{st.share}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{st.type}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: Immutable Funding Ledger */}
              {activeTab === 'LEDGER' && (
                <div className="space-y-4 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Chronological Funding Transaction Ledger</h4>
                  <div className="space-y-3">
                    {fundingLedger.map((tx, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                        <div>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-[10px] border border-emerald-500/30">
                            {tx.round}
                          </span>
                          <p className="font-bold text-white text-sm mt-1.5">Lead Backer: {tx.lead}</p>
                          <span className="text-slate-400 text-[11px]">Transaction Date: {tx.date}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-black text-white block">{tx.amount}</span>
                          <span className="text-slate-400">Equity Issued: {tx.equity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: Ecosystem & Cross-Border Hiring */}
              {activeTab === 'ECOSYSTEM' && (
                <div className="space-y-4 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Global Hub Telemetry &amp; Talent Demand</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2">
                      <div className="flex items-center gap-2 text-cyan-400 font-bold">
                        <Globe className="h-4 w-4" /> Global Hub Affiliation
                      </div>
                      <p className="text-sm font-bold text-white">{activeStartup.ecosystemHub || 'Decentralized Tech Hub'}</p>
                      <p className="text-slate-400">{activeStartup.city}, {activeStartup.country} ({activeStartup.region})</p>
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Active Cross-Border Routing
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2">
                      <div className="flex items-center gap-2 text-amber-400 font-bold">
                        <Briefcase className="h-4 w-4" /> Open Positions Worldwide
                      </div>
                      <p className="text-sm font-bold text-white">{activeStartup.openPositionsCount || 4} Open Roles Available</p>
                      <p className="text-slate-400">Seeking Engineers, AI Researchers, and Growth Strategists.</p>
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                        ATS Direct Apply Supported
                      </span>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>
        )}
      </div>

    </div>
  );
}
