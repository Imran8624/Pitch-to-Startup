import React, { useState } from 'react';
import { 
  Users, 
  Briefcase, 
  Code, 
  Clock, 
  DollarSign, 
  Search, 
  Filter, 
  CheckCircle2, 
  Send, 
  Building2,
  X,
  Sparkles,
  Zap,
  FileText,
  TrendingUp,
  Calendar,
  AlertCircle,
  Video,
  Award,
  CheckCircle,
  ExternalLink,
  Trash2,
  Eye,
  ArrowRight
} from 'lucide-react';
import ResumeOptimizerAgent from './ResumeOptimizerAgent';
import RejectionRecoveryModal from './RejectionRecoveryModal';
import AutoJobApplyAgent from './AutoJobApplyAgent';

const INITIAL_JOBS = [
  // --- INDIAN STARTUPS CURRENTLY HIRING ---
  {
    id: 'job-in-101',
    startupName: 'DevOpsForge Labs',
    title: 'Senior Kubernetes Site Reliability Engineer (Go / eBPF / Kafka)',
    roleType: 'FULL_TIME',
    techStack: ['Go', 'Kubernetes', 'eBPF', 'Kafka', 'Spring Boot'],
    minRate: '32,00,000',
    maxRate: '48,00,000',
    ratePeriod: 'ANNUAL (₹32L - ₹48L / $55k-$75k)',
    location: 'Bengaluru, India (Koramangala Hub / Hybrid)',
    country: 'India',
    flag: '🇮🇳',
    hub: 'Koramangala Silicon Tech Hub',
    description: 'Lead self-healing Kubernetes agent clusters for multi-cloud deployments with sub-second eBPF telemetry.'
  },
  {
    id: 'job-in-102',
    startupName: 'KisanSetu AI',
    title: 'Lead Computer Vision & Edge AI Engineer (PyTorch / CUDA / Drone Telemetry)',
    roleType: 'FULL_TIME',
    techStack: ['Python', 'PyTorch', 'Computer Vision', 'CUDA', 'FastAPI'],
    minRate: '35,00,000',
    maxRate: '55,00,000',
    ratePeriod: 'ANNUAL (₹35L - ₹55L / $60k-$85k)',
    location: 'Bengaluru / Pune, India',
    country: 'India',
    flag: '🇮🇳',
    hub: 'Indiranagar DeepTech Hub',
    description: 'Architect multispectral crop pathology models running on real-time drone edge inference across Indian farms.'
  },
  {
    id: 'job-in-103',
    startupName: 'SarvPay Payments',
    title: 'High-Frequency Java Microservices & Kafka Architect (UPI 2.0)',
    roleType: 'FULL_TIME',
    techStack: ['Java 17', 'Spring Boot 3', 'Kafka', 'PostgreSQL', 'Redis'],
    minRate: '45,00,000',
    maxRate: '70,00,000',
    ratePeriod: 'ANNUAL (₹45L - ₹70L / $70k-$105k)',
    location: 'Mumbai / Bengaluru, India (BKC)',
    country: 'India',
    flag: '🇮🇳',
    hub: 'BKC FinTech District',
    description: 'Scale distributed payment ledger processing 18M daily merchant settlements with sub-50ms latency.'
  },
  {
    id: 'job-in-104',
    startupName: 'IndusHealth Diagnostics',
    title: 'Deep Learning Biomedical Image Scientist (PyTorch / Medical Imaging)',
    roleType: 'FULL_TIME',
    techStack: ['Python', 'PyTorch', 'OpenCV', 'TensorRT', 'Docker'],
    minRate: '40,00,000',
    maxRate: '60,00,000',
    ratePeriod: 'ANNUAL (₹40L - ₹60L / $65k-$90k)',
    location: 'Bengaluru, India (HSR Layout)',
    country: 'India',
    flag: '🇮🇳',
    hub: 'HSR Layout BioTech Corridor',
    description: 'Deploy point-of-care digital pathology vision models diagnosing blood smears for rural diagnostic centers.'
  },
  {
    id: 'job-in-105',
    startupName: 'UrbanFleet Mobility',
    title: 'Embedded Systems & Rust BMS Telemetry Developer',
    roleType: 'FULL_TIME',
    techStack: ['Rust', 'C++', 'CAN Bus', 'Embedded Linux', 'MQTT'],
    minRate: '30,00,000',
    maxRate: '48,00,000',
    ratePeriod: 'ANNUAL (₹30L - ₹48L / $50k-$75k)',
    location: 'Hyderabad / Pune, India (HITEC City)',
    country: 'India',
    flag: '🇮🇳',
    hub: 'HITEC City Tech Hub',
    description: 'Optimize high-frequency CAN-bus battery pack telemetry for 35,000 commercial electric 2-wheelers.'
  },
  {
    id: 'job-in-106',
    startupName: 'VaidyaGen AI',
    title: 'LLM Fine-Tuning & Multilingual NLP Researcher (Indic LLMs)',
    roleType: 'FULL_TIME',
    techStack: ['Python', 'HuggingFace', 'LoRA', 'LangChain', 'vLLM'],
    minRate: '38,00,000',
    maxRate: '58,00,000',
    ratePeriod: 'ANNUAL (₹38L - ₹58L / $60k-$90k)',
    location: 'Delhi-NCR / Gurugram, India',
    country: 'India',
    flag: '🇮🇳',
    hub: 'Cyber City Gurugram',
    description: 'Fine-tune medical diagnosis assistants supporting speech-to-prescription in 12 Indian regional languages.'
  },
  {
    id: 'job-in-107',
    startupName: 'ChakraShield Cyber',
    title: 'Kernel-Level eBPF Security & Cloud Defense Engineer',
    roleType: 'FULL_TIME',
    techStack: ['C', 'Rust', 'eBPF', 'Linux Kernel', 'Kubernetes'],
    minRate: '36,00,000',
    maxRate: '54,00,000',
    ratePeriod: 'ANNUAL (₹36L - ₹54L / $55k-$82k)',
    location: 'Bengaluru / Hyderabad, India',
    country: 'India',
    flag: '🇮🇳',
    hub: 'Whitefield Cyber Hub',
    description: 'Develop kernel-space runtime anomaly sensors protecting cloud native infrastructure and payment gateways.'
  },
  // --- GLOBAL STARTUPS ---
  {
    id: 'job-101',
    startupName: 'Quantum AI Labs',
    title: 'Lead AI Infrastructure Engineer (Python / PyTorch / Spring Boot)',
    roleType: 'FULL_TIME',
    techStack: ['Python', 'Spring Boot', 'PostgreSQL', 'PyTorch', 'Docker'],
    minRate: '120,000',
    maxRate: '160,000',
    ratePeriod: 'ANNUAL ($120k - $160k /yr)',
    location: 'San Francisco, CA (Silicon Valley / Remote)',
    country: 'United States',
    flag: '🇺🇸',
    hub: 'Silicon Valley Hub',
    description: 'We are seeking a senior AI Infrastructure Engineer to lead distributed agent orchestration engines for enterprise finance.'
  },
  {
    id: 'job-102',
    startupName: 'BioGenix Health',
    title: 'Full-Stack React & WebRTC Specialist',
    roleType: 'FREELANCE',
    techStack: ['React', 'Tailwind CSS', 'WebRTC', 'WebSockets'],
    minRate: '75',
    maxRate: '110',
    ratePeriod: 'HOURLY ($75 - $110 /hr)',
    location: 'London, UK (Silicon Roundabout / Remote)',
    country: 'United Kingdom',
    flag: '🇬🇧',
    hub: 'Silicon Roundabout',
    description: 'Building custom WebRTC video pitch rooms and real-time telehealth telemetry pipelines for precision oncology platforms.'
  },
  {
    id: 'job-103',
    startupName: 'VerdeGrid Dynamics',
    title: 'Embedded Systems & Rust Firmware Developer',
    roleType: 'CONTRACT',
    techStack: ['Rust', 'C++', 'Embedded Linux', 'CAN Bus'],
    minRate: '90',
    maxRate: '130',
    ratePeriod: 'HOURLY ($90 - $130 /hr)',
    location: 'Global Remote',
    country: 'Global',
    flag: '🌐',
    hub: 'Global Decentralized Hub',
    description: 'Optimize high-frequency telemetry loops for EV battery management system controllers.'
  }
];

const INITIAL_MY_APPLICATIONS = [
  {
    id: 'app-501',
    startupName: 'Quantum AI Labs',
    title: 'Lead AI Infrastructure Engineer',
    roleType: 'FULL_TIME',
    appliedDate: '2026-09-04',
    status: 'INTERVIEW_SCHEDULED', // UNDER_REVIEW | INTERVIEW_SCHEDULED | OFFER_RECEIVED | REJECTED
    atsMatchScore: 96,
    compensation: '$120k - $160k /yr',
    stageNote: 'Technical System Architecture Round with CTO. Scheduled for Wed, Sep 9 at 3:00 PM EST.',
    techStack: ['Python', 'Spring Boot', 'pgvector', 'Docker'],
    resumeUsed: 'Tailored_Resume_Lead_AI_Infrastructure.pdf',
    coverNote: 'Architected distributed high-throughput microservices reducing query latency by 42% for 3.5M daily requests.'
  },
  {
    id: 'app-502',
    startupName: 'BioGenix Health',
    title: 'Full-Stack React & WebRTC Specialist',
    roleType: 'FREELANCE',
    appliedDate: '2026-09-05',
    status: 'UNDER_REVIEW',
    atsMatchScore: 92,
    compensation: '$75 - $110 /hr',
    stageNote: 'Recruiting team currently reviewing candidate portfolio & WebRTC code samples.',
    techStack: ['React', 'Tailwind CSS', 'WebRTC', 'WebSockets'],
    resumeUsed: 'Tailored_Resume_React_WebRTC.pdf',
    coverNote: 'Experienced in real-time video streaming pipelines, WebRTC signaling protocols, and responsive UI telemetry.'
  },
  {
    id: 'app-503',
    startupName: 'VerdeGrid Dynamics',
    title: 'Embedded Systems & Rust Firmware Developer',
    roleType: 'CONTRACT',
    appliedDate: '2026-09-02',
    status: 'REJECTED',
    atsMatchScore: 68,
    compensation: '$90 - $130 /hr',
    stageNote: 'Automated screening filter: position required 5+ years of dedicated CAN Bus firmware driver experience.',
    techStack: ['Rust', 'C++', 'Embedded Linux', 'CAN Bus'],
    resumeUsed: 'Alex_Vance_Generalist_Resume.pdf',
    coverNote: 'Looking to transition systems engineering experience to next-gen EV battery telemetry.'
  },
  {
    id: 'app-504',
    startupName: 'CloudScale Engine',
    title: 'Senior Backend Microservices Architect',
    roleType: 'FULL_TIME',
    appliedDate: '2026-08-29',
    status: 'OFFER_RECEIVED',
    atsMatchScore: 98,
    compensation: '$155,000 /yr + 0.75% Equity',
    stageNote: 'Formal compensation offer extended! Package includes sign-on bonus & remote work stipend.',
    techStack: ['Java 17', 'Spring Boot 3', 'Kafka', 'PostgreSQL'],
    resumeUsed: 'Tailored_Resume_Backend_Architect.pdf',
    coverNote: 'Over 6 years scaling distributed high-throughput REST and Kafka streaming pipelines.'
  }
];

export default function TalentMarketplace({ currentUser, onNavigateToPitchRoom }) {
  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const [myApplications, setMyApplications] = useState(INITIAL_MY_APPLICATIONS);
  const [activeMarketTab, setActiveMarketTab] = useState('APPLICATIONS'); // JOBS | RESUME_AGENT | APPLICATIONS
  const [applicationStatusFilter, setApplicationStatusFilter] = useState('ALL');
  const [selectedRoleForAgent, setSelectedRoleForAgent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleType, setSelectedRoleType] = useState('ALL');
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);
  const [selectedRecoveryJob, setSelectedRecoveryJob] = useState(null);
  const [isRecoveryModalOpen, setIsRecoveryModalOpen] = useState(false);
  const [isAutoApplyAgentOpen, setIsAutoApplyAgentOpen] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('');
  const [coverNote, setCoverNote] = useState('');
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [selectedAppDetail, setSelectedAppDetail] = useState(null);

  // Load persistent applications from Real Database on component mount
  React.useEffect(() => {
    fetch('/api/v1/public/applications')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data) && data.length > 0) {
          const formatted = data.map(item => ({
            ...item,
            techStack: Array.isArray(item.techStack)
              ? item.techStack
              : (item.techStack ? item.techStack.split(',').map(s => s.trim()) : ['Java', 'React', 'PostgreSQL'])
          }));
          setMyApplications(formatted);
        }
      })
      .catch(err => console.warn('Database load warning, using local fallback:', err));
  }, []);

  const handleBatchApplySuccess = (newApps) => {
    setMyApplications(prev => {
      const existingIds = new Set(prev.map(p => p.id));
      const fresh = newApps.filter(a => !existingIds.has(a.id));
      return [...fresh, ...prev];
    });
    setActiveMarketTab('APPLICATIONS');

    // Persist batch applications to real database
    fetch('/api/v1/public/applications/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newApps.map(a => ({
        ...a,
        techStack: Array.isArray(a.techStack) ? a.techStack.join(', ') : a.techStack
      })))
    }).catch(err => console.warn('Failed to persist batch applications:', err));
  };

  const [selectedJobRegion, setSelectedJobRegion] = useState('ALL'); // ALL | INDIA | US | EU | REMOTE

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.startupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.location && job.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (job.hub && job.hub.toLowerCase().includes(searchTerm.toLowerCase())) ||
      job.techStack.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedRoleType === 'ALL' || job.roleType === selectedRoleType;
    
    let matchesRegion = true;
    if (selectedJobRegion === 'INDIA') {
      matchesRegion = job.country === 'India' || (job.location && job.location.includes('India'));
    } else if (selectedJobRegion === 'US') {
      matchesRegion = job.country === 'United States' || (job.location && job.location.includes('US'));
    } else if (selectedJobRegion === 'EU') {
      matchesRegion = job.country === 'United Kingdom' || (job.location && job.location.includes('UK'));
    } else if (selectedJobRegion === 'REMOTE') {
      matchesRegion = job.location && job.location.toLowerCase().includes('remote');
    }

    return matchesSearch && matchesType && matchesRegion;
  });

  const filteredApplications = myApplications.filter(app => {
    const matchesFilter = applicationStatusFilter === 'ALL' || app.status === applicationStatusFilter;
    const matchesSearch = app.startupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleApplySubmit = (e) => {
    e.preventDefault();
    setApplicationSuccess(true);

    const newApp = {
      id: 'app-' + Date.now(),
      startupName: selectedJobForApply.startupName,
      title: selectedJobForApply.title,
      roleType: selectedJobForApply.roleType,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'UNDER_REVIEW',
      atsMatchScore: 95,
      compensation: `$${selectedJobForApply.minRate} - $${selectedJobForApply.maxRate} /${selectedJobForApply.ratePeriod.toLowerCase()}`,
      stageNote: 'Application submitted successfully. Awaiting initial hiring manager review.',
      techStack: selectedJobForApply.techStack,
      resumeUsed: resumeUrl || 'Uploaded_ATS_Tailored_Resume.pdf',
      coverNote: coverNote || 'Direct application submitted through StartupHub Talent Marketplace.',
      candidateName: currentUser?.name || 'Alex Vance',
      candidateEmail: currentUser?.email || 'alex.vance@startuphub.io'
    };

    setMyApplications(prev => [newApp, ...prev]);

    // Save to real database
    fetch('/api/v1/public/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newApp,
        techStack: Array.isArray(newApp.techStack) ? newApp.techStack.join(', ') : newApp.techStack
      })
    }).catch(err => console.warn('Failed to persist application:', err));

    setTimeout(() => {
      setApplicationSuccess(false);
      setSelectedJobForApply(null);
      setResumeUrl('');
      setCoverNote('');
      setActiveMarketTab('APPLICATIONS');
    }, 1500);
  };

  const handleOpenResumeAgentForJob = (jobTitle) => {
    setSelectedRoleForAgent(jobTitle);
    setActiveMarketTab('RESUME_AGENT');
  };

  const handleWithdrawApplication = (id) => {
    setMyApplications(prev => prev.filter(app => app.id !== id));
    // Delete from real database
    fetch(`/api/v1/public/applications/${id}`, { method: 'DELETE' })
      .catch(err => console.warn('Failed to delete application:', err));
  };

  // Status Metrics
  const countUnderReview = myApplications.filter(a => a.status === 'UNDER_REVIEW').length;
  const countInterview = myApplications.filter(a => a.status === 'INTERVIEW_SCHEDULED').length;
  const countOffer = myApplications.filter(a => a.status === 'OFFER_RECEIVED').length;
  const countRejected = myApplications.filter(a => a.status === 'REJECTED').length;

  return (
    <div className="min-h-[calc(100vh-5rem)] p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header & Sub-Tab Switcher */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Users className="h-7 w-7 text-purple-400" />
            Startup Talent &amp; Candidate Career Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track all your company job applications, live candidate statuses, AI resume tailoring, and automated HR cold outreach.
          </p>
        </div>

        {/* Top 3-Way Tab Switcher */}
        <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-white/10 text-xs flex-wrap gap-1 items-center">
          <button
            onClick={() => setActiveMarketTab('APPLICATIONS')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeMarketTab === 'APPLICATIONS' 
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            <span>My Applications</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-white/20 text-white">
              {myApplications.length}
            </span>
          </button>

          <button
            onClick={() => setActiveMarketTab('JOBS')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeMarketTab === 'JOBS' 
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Briefcase className="h-3.5 w-3.5" />
            <span>Browse Jobs ({jobs.length})</span>
          </button>

          <button
            onClick={() => setActiveMarketTab('RESUME_AGENT')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeMarketTab === 'RESUME_AGENT' 
                ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg shadow-purple-500/20' 
                : 'text-slate-400 hover:text-purple-300'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
            <span>AI Resume Agent</span>
          </button>

          <button
            onClick={() => setIsAutoApplyAgentOpen(true)}
            className="px-4 py-2 rounded-xl font-extrabold transition-all flex items-center gap-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 shadow-lg shadow-amber-500/20 animate-pulse"
          >
            <Zap className="h-3.5 w-3.5 fill-current" />
            <span>⚡ Auto-Pilot Job Agent</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: Candidate Applications & Status Tracker */}
      {activeMarketTab === 'APPLICATIONS' && (
        <div className="space-y-6">
          
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
            
            {/* Total Applied */}
            <div className="glass-card rounded-2xl p-4 border border-white/10 space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                Total Applied
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                {myApplications.length}
              </div>
              <span className="text-[10px] text-slate-500 block">Across active startups</span>
            </div>

            {/* Under Review */}
            <div className="glass-card rounded-2xl p-4 border border-amber-500/30 bg-amber-500/5 space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-300 block">
                Under Review
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
                {countUnderReview}
              </div>
              <span className="text-[10px] text-amber-400/80 block">Screening in progress</span>
            </div>

            {/* Interviews Scheduled */}
            <div className="glass-card rounded-2xl p-4 border border-cyan-500/30 bg-cyan-500/5 space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-300 block">
                Interviews
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">
                {countInterview}
              </div>
              <span className="text-[10px] text-cyan-400/80 block">Pitch Call Room active</span>
            </div>

            {/* Offers Received */}
            <div className="glass-card rounded-2xl p-4 border border-emerald-500/30 bg-emerald-500/5 space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-300 block">
                Offers Received
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
                {countOffer}
              </div>
              <span className="text-[10px] text-emerald-400/80 block">Pending signatures</span>
            </div>

            {/* Rejections */}
            <div className="glass-card rounded-2xl p-4 border border-rose-500/30 bg-rose-500/5 space-y-1 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-300 block">
                Rejections
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-rose-400 font-mono">
                {countRejected}
              </div>
              <span className="text-[10px] text-rose-400/80 block">Cold DM recovery ready</span>
            </div>

          </div>

          {/* Filter Bar & Search */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            
            {/* Status Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs">
              <button
                onClick={() => setApplicationStatusFilter('ALL')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  applicationStatusFilter === 'ALL' 
                    ? 'bg-purple-600 text-white shadow-md' 
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-white/10'
                }`}
              >
                All ({myApplications.length})
              </button>

              <button
                onClick={() => setApplicationStatusFilter('UNDER_REVIEW')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  applicationStatusFilter === 'UNDER_REVIEW' 
                    ? 'bg-amber-500 text-black shadow-md' 
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-white/10'
                }`}
              >
                Under Review ({countUnderReview})
              </button>

              <button
                onClick={() => setApplicationStatusFilter('INTERVIEW_SCHEDULED')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  applicationStatusFilter === 'INTERVIEW_SCHEDULED' 
                    ? 'bg-cyan-500 text-black shadow-md' 
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-white/10'
                }`}
              >
                Interviews ({countInterview})
              </button>

              <button
                onClick={() => setApplicationStatusFilter('OFFER_RECEIVED')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  applicationStatusFilter === 'OFFER_RECEIVED' 
                    ? 'bg-emerald-500 text-black shadow-md' 
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-white/10'
                }`}
              >
                Offers ({countOffer})
              </button>

              <button
                onClick={() => setApplicationStatusFilter('REJECTED')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  applicationStatusFilter === 'REJECTED' 
                    ? 'bg-rose-500 text-white shadow-md' 
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-white/10'
                }`}
              >
                Rejected ({countRejected})
              </button>
            </div>

            {/* Search Box */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search applied companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

          </div>

          {/* Applications List */}
          <div className="space-y-3">
            {filteredApplications.map((app) => (
              <div 
                key={app.id} 
                className="glass-card rounded-3xl p-5 border border-white/10 space-y-4 hover:border-purple-500/30 transition-all"
              >
                {/* Main Card Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-base text-white">{app.title}</span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-300 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/30">
                        <Building2 className="h-3 w-3" />
                        {app.startupName}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-slate-300">
                        {app.roleType}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-slate-500" /> Applied: {app.appliedDate}
                      </span>
                      <span>•</span>
                      <span className="text-emerald-400 font-semibold">{app.compensation}</span>
                      <span>•</span>
                      <span className="font-mono text-purple-300">ATS Match: {app.atsMatchScore}%</span>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="shrink-0">
                    {app.status === 'UNDER_REVIEW' && (
                      <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 animate-pulse" />
                        Under Review
                      </span>
                    )}

                    {app.status === 'INTERVIEW_SCHEDULED' && (
                      <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5">
                        <Video className="h-3.5 w-3.5" />
                        Interview Scheduled
                      </span>
                    )}

                    {app.status === 'OFFER_RECEIVED' && (
                      <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                        <Award className="h-3.5 w-3.5" />
                        Offer Received
                      </span>
                    )}

                    {app.status === 'REJECTED' && (
                      <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1.5">
                        <AlertCircle className="h-3.5 w-3.5" />
                        Application Rejected
                      </span>
                    )}
                  </div>
                </div>

                {/* Live Stage Notes Alert Box */}
                <div className={`p-3.5 rounded-2xl text-xs flex items-start justify-between gap-3 ${
                  app.status === 'INTERVIEW_SCHEDULED' 
                    ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-200'
                    : app.status === 'OFFER_RECEIVED'
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-200'
                    : app.status === 'REJECTED'
                    ? 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
                    : 'bg-slate-900/90 border border-white/10 text-slate-300'
                }`}>
                  <div>
                    <span className="font-bold text-[10px] uppercase tracking-wider block opacity-70 mb-0.5">
                      Current Pipeline Status &amp; Stage Update:
                    </span>
                    <p className="leading-relaxed">{app.stageNote}</p>
                  </div>

                  {/* Contextual Action Button based on Status */}
                  {app.status === 'INTERVIEW_SCHEDULED' && onNavigateToPitchRoom && (
                    <button
                      onClick={onNavigateToPitchRoom}
                      className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs transition-all shadow-md flex items-center gap-1.5 shrink-0"
                    >
                      <Video className="h-3.5 w-3.5" />
                      <span>Join Pitch Room</span>
                    </button>
                  )}

                  {app.status === 'REJECTED' && (
                    <button
                      onClick={() => {
                        setSelectedRecoveryJob({
                          startupName: app.startupName,
                          title: app.title,
                          techStack: app.techStack
                        });
                        setIsRecoveryModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-black font-extrabold text-xs transition-all shadow-md flex items-center gap-1.5 shrink-0"
                      title="Trigger automated high-conversion Cold DM recovery to HR"
                    >
                      <Zap className="h-3.5 w-3.5" />
                      <span>Recover With Cold HR DM</span>
                    </button>
                  )}
                </div>

                {/* Tech Stack & Card Footer */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-white/10 text-xs">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-slate-500 font-mono">Stack:</span>
                    {app.techStack.map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-lg bg-slate-900 border border-white/10 text-[10px] text-slate-300 font-mono">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedAppDetail(app)}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs transition-colors flex items-center gap-1"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>View Submission</span>
                    </button>

                    <button
                      onClick={() => handleWithdrawApplication(app.id)}
                      className="p-1.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Withdraw application"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            ))}

            {filteredApplications.length === 0 && (
              <div className="py-12 text-center glass-card rounded-3xl border border-white/10 space-y-3">
                <Briefcase className="h-10 w-10 text-slate-500 mx-auto" />
                <h3 className="text-base font-bold text-white">No Applications Found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  You haven't submitted applications under this filter. Browse open startup roles to apply.
                </p>
                <button
                  onClick={() => setActiveMarketTab('JOBS')}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all shadow-md inline-flex items-center gap-1.5"
                >
                  <span>Browse Job Openings</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>

        </div>
      )}

      {/* VIEW 2: Browse Jobs */}
      {activeMarketTab === 'JOBS' && (
        <div className="space-y-6">
          
          {/* Hero Banner: Auto-Pilot Multi-Job Agent */}
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-purple-950/80 via-indigo-950/60 to-slate-900 border border-purple-500/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 text-white shadow-lg shadow-purple-500/30">
                <Zap className="h-6 w-6 text-amber-300 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-white">
                    Autonomous Multi-Job Auto-Apply Agent
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950">
                    AI AGENT v2.4
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                  Extracts requirements across multiple jobs, adapts tailored ATS resumes, discovers matching high-fit roles, and batch uploads applications automatically.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsAutoApplyAgentOpen(true)}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-xs transition-all shadow-xl shadow-purple-600/30 flex items-center gap-2 shrink-0"
            >
              <Sparkles className="h-4 w-4 text-amber-300" />
              <span>Launch Multi-Job Auto-Pilot</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Region & Type Filter Bar */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            {/* Region Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 text-xs">
              <button
                onClick={() => setSelectedJobRegion('ALL')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                  selectedJobRegion === 'ALL'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-white/10'
                }`}
              >
                🌍 All Jobs ({jobs.length})
              </button>

              <button
                onClick={() => setSelectedJobRegion('INDIA')}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  selectedJobRegion === 'INDIA'
                    ? 'bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500 text-slate-950 font-black shadow-lg shadow-orange-500/20'
                    : 'bg-slate-900 text-amber-300 hover:text-white border border-amber-500/30'
                }`}
              >
                <span>🇮🇳 Indian Startups ({jobs.filter(j => j.country === 'India').length})</span>
                <span className="px-1.5 py-0.2 rounded bg-black/20 text-[10px]">Hiring Now</span>
              </button>

              <button
                onClick={() => setSelectedJobRegion('US')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                  selectedJobRegion === 'US'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-white/10'
                }`}
              >
                🇺🇸 US Hubs
              </button>

              <button
                onClick={() => setSelectedJobRegion('EU')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                  selectedJobRegion === 'EU'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-white/10'
                }`}
              >
                🇪🇺 Europe
              </button>

              <button
                onClick={() => setSelectedJobRegion('REMOTE')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                  selectedJobRegion === 'REMOTE'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-white/10'
                }`}
              >
                🌐 Remote
              </button>
            </div>

            {/* Search and Contract Type Dropdown */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search Indian startups, skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <select
                value={selectedRoleType}
                onChange={(e) => setSelectedRoleType(e.target.value)}
                className="bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500 shrink-0"
              >
                <option value="ALL">All Roles</option>
                <option value="FULL_TIME">Full-Time</option>
                <option value="FREELANCE">Freelance</option>
                <option value="CONTRACT">Contract</option>
              </select>
            </div>
          </div>

          {/* Jobs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredJobs.map((job) => (
              <div 
                key={job.id} 
                className={`glass-card glass-card-hover rounded-3xl p-5 border flex flex-col justify-between transition-all ${
                  job.country === 'India'
                    ? 'border-amber-500/30 hover:border-amber-500/60 bg-gradient-to-b from-slate-900/90 to-amber-950/20'
                    : 'border-white/10 hover:border-purple-500/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">{job.flag || '🌐'}</span>
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                        job.country === 'India'
                          ? 'text-amber-300 bg-amber-500/10 border-amber-500/30'
                          : 'text-purple-400 bg-purple-500/10 border-purple-500/30'
                      }`}>
                        <Building2 className="h-3 w-3" />
                        {job.startupName}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-slate-300">
                      {job.roleType}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-white leading-snug">{job.title}</h3>
                  
                  {/* Location & Hub Info */}
                  <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <span>📍 {job.location || 'Remote'}</span>
                    {job.hub && <span>• 🏛️ {job.hub}</span>}
                  </p>

                  <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">{job.description}</p>

                  {/* Tech Stack Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {job.techStack.map((tech, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-lg bg-slate-900 border border-white/10 text-[10px] font-medium text-slate-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-5 pt-3 border-t border-white/10 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Compensation</span>
                    <span className="text-xs font-black text-emerald-400">
                      {job.ratePeriod}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap">
                    <button
                      onClick={() => handleOpenResumeAgentForJob(job.title)}
                      className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold text-[11px] transition-colors"
                      title="Run AI Agent to tailor your resume for this specific opening"
                    >
                      <Sparkles className="h-3 w-3 text-amber-300" />
                      <span>Tailor Resume</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedRecoveryJob(job);
                        setIsRecoveryModalOpen(true);
                      }}
                      className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold text-[11px] transition-colors"
                      title="Generate high-converting Cold Email / Direct DM to Hiring Manager"
                    >
                      <Zap className="h-3 w-3" />
                      <span>HR DM</span>
                    </button>

                    <button
                      onClick={() => setSelectedJobForApply(job)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs transition-all shadow-md"
                    >
                      <span>Apply</span>
                      <Send className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* VIEW 3: AI Resume Optimizer & Gap Calculator Agent */}
      {activeMarketTab === 'RESUME_AGENT' && (
        <ResumeOptimizerAgent 
          initialRoleTarget={selectedRoleForAgent} 
          onApplyWithTailoredResume={() => setActiveMarketTab('APPLICATIONS')}
        />
      )}

      {/* Application Details Modal */}
      {selectedAppDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="glass-card w-full max-w-lg rounded-3xl p-6 border border-purple-500/40 shadow-2xl relative space-y-4">
            <button
              onClick={() => setSelectedAppDetail(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <span className="text-[10px] font-semibold text-purple-400 uppercase tracking-wider">Application Summary Record</span>
              <h3 className="text-lg font-bold text-white mt-1">{selectedAppDetail.title}</h3>
              <p className="text-xs text-slate-400">{selectedAppDetail.startupName} • Applied: {selectedAppDetail.appliedDate}</p>
            </div>

            <div className="p-3 bg-slate-900 rounded-2xl border border-white/10 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Current Status:</span>
                <span className="font-bold text-emerald-400">{selectedAppDetail.status}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">ATS Match Score:</span>
                <span className="font-bold text-purple-400">{selectedAppDetail.atsMatchScore}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Resume Attached:</span>
                <span className="font-mono text-cyan-300">{selectedAppDetail.resumeUsed}</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">Submitted Cover Note:</span>
              <p className="p-3 bg-slate-950 rounded-2xl border border-white/10 text-xs text-slate-300 leading-relaxed font-mono">
                {selectedAppDetail.coverNote}
              </p>
            </div>

            <button
              onClick={() => setSelectedAppDetail(null)}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors"
            >
              Close Details
            </button>
          </div>
        </div>
      )}

      {/* Application Submission Modal */}
      {selectedJobForApply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="glass-card w-full max-w-lg rounded-3xl p-6 border border-purple-500/40 shadow-2xl relative">
            <button
              onClick={() => setSelectedJobForApply(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            {applicationSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Application Submitted!</h3>
                <p className="text-xs text-slate-400">
                  Your application has been added to your live tracker and transmitted to {selectedJobForApply.startupName}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div className="pb-3 border-b border-white/10">
                  <span className="text-[10px] font-semibold text-purple-400 uppercase tracking-wider">Direct Candidate Application</span>
                  <h3 className="text-lg font-bold text-white mt-1">{selectedJobForApply.title}</h3>
                  <p className="text-xs text-slate-400">{selectedJobForApply.startupName} • {selectedJobForApply.location}</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Portfolio / Resume URL</label>
                  <input
                    type="text"
                    required
                    placeholder="https://github.com/yourhandle or resume link"
                    value={resumeUrl}
                    onChange={(e) => setResumeUrl(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Cover Note &amp; Relevant Experience</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Explain your expertise with the required tech stack..."
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Submit Application &amp; Track Status
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Rejection Recovery Cold Outreach Modal */}
      <RejectionRecoveryModal
        isOpen={isRecoveryModalOpen}
        onClose={() => {
          setIsRecoveryModalOpen(false);
          setSelectedRecoveryJob(null);
        }}
        initialStartup={selectedRecoveryJob?.startupName || 'Quantum AI Labs'}
        initialRole={selectedRecoveryJob?.title || 'Lead AI Infrastructure Engineer'}
        initialTechStack={selectedRecoveryJob?.techStack?.join(', ') || 'Spring Boot, pgvector & React'}
      />

      {/* Autonomous Multi-Job Auto-Apply Agent Modal */}
      {isAutoApplyAgentOpen && (
        <AutoJobApplyAgent
          availableJobs={jobs}
          onClose={() => setIsAutoApplyAgentOpen(false)}
          onBatchApplySuccess={(newApps) => {
            handleBatchApplySuccess(newApps);
          }}
        />
      )}

    </div>
  );
}

