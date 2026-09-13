import React, { useState, useEffect, useRef } from 'react';
import { 
  Rocket, 
  Layers, 
  Users, 
  Sparkles, 
  ShieldCheck, 
  Video, 
  UserCircle, 
  Bot, 
  PlusCircle, 
  ChevronDown,
  Lock,
  Unlock,
  Megaphone,
  Briefcase,
  Target,
  Building2,
  Check,
  CheckCircle2,
  X,
  SlidersHorizontal
} from 'lucide-react';
import NotificationCenter from './NotificationCenter';

// Strict Role-Specific Navigation Contexts
export const ROLE_TABS = {
  INVESTOR: [
    { key: 'swipe', label: 'Swipe Pitch Deck', icon: Sparkles, color: 'emerald' },
    { key: 'tracker', label: 'Startup Growth Tracker', icon: Layers, color: 'emerald' },
    { key: 'webrtc', label: 'Pitch Call Room', icon: Video, color: 'rose' }
  ],
  STUDENT_FOUNDER: [
    { key: 'tracker', label: 'Startup & Cap Table Tracker', icon: Layers, color: 'cyan' },
    { key: 'marketing', label: 'Marketing Team AI', icon: Megaphone, color: 'purple' },
    { key: 'webrtc', label: 'Founder Pitch Room', icon: Video, color: 'rose' }
  ],
  TALENT: [
    { key: 'talent', label: 'Talent Marketplace & Resume AI', icon: Users, color: 'purple' },
    { key: 'webrtc', label: 'Technical Interview Room', icon: Video, color: 'rose' }
  ],
  VENDOR: [
    { key: 'tracker', label: 'Ecosystem Partner Directory', icon: Layers, color: 'amber' },
    { key: 'marketing', label: 'B2B Enterprise Marketing AI', icon: Megaphone, color: 'purple' },
    { key: 'webrtc', label: 'Partner Demo Room', icon: Video, color: 'rose' }
  ],
  ADMIN: [
    { key: 'admin', label: 'Super Admin Console', icon: ShieldCheck, color: 'amber', isProtected: true },
    { key: 'tracker', label: 'Ecosystem Audit Ledger', icon: Layers, color: 'slate' }
  ]
};

export const ROLES_CONFIG = [
  { 
    key: 'INVESTOR', 
    label: 'Accredited Investor', 
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    workspaceTitle: 'Investor Dealflow Workspace',
    defaultName: 'Sarah Jenkins',
    defaultEmail: 'investor.sarah@apexvc.com',
    defaultTab: 'swipe',
    color: 'emerald'
  },
  { 
    key: 'STUDENT_FOUNDER', 
    label: 'Student Founder', 
    badgeClass: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    workspaceTitle: 'Founder Venture Workspace',
    defaultName: 'Alex Vance (Founder)',
    defaultEmail: 'alex.vance@quantumlabs.ai',
    defaultTab: 'tracker',
    color: 'cyan'
  },
  { 
    key: 'TALENT', 
    label: 'Tech Talent / Freelancer', 
    badgeClass: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    workspaceTitle: 'Candidate Career Workspace',
    defaultName: 'Alex Vance (Candidate)',
    defaultEmail: 'alex.vance@startuphub.io',
    defaultTab: 'talent',
    color: 'purple'
  },
  { 
    key: 'VENDOR', 
    label: 'Enterprise Vendor', 
    badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    workspaceTitle: 'Enterprise Partner Workspace',
    defaultName: 'David Chen (Cloud Partner)',
    defaultEmail: 'david.chen@cloudscale.io',
    defaultTab: 'tracker',
    color: 'amber'
  },
  { 
    key: 'ADMIN', 
    label: 'Super Admin (Password Protected)', 
    badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    workspaceTitle: 'Super Admin Console',
    defaultName: 'Super Admin',
    defaultEmail: 'admin@startuphub.internal',
    defaultTab: 'admin',
    color: 'rose'
  },
];

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  currentUser, 
  setCurrentUser, 
  toggleAiDrawer, 
  openAuthModal, 
  notifications, 
  markAsRead, 
  unreadCount,
  isAdminAuthenticated,
  onAdminRequest,
  onLockAdmin
}) {
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsRoleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentRoleInfo = ROLES_CONFIG.find(r => r.key === currentUser.role) || ROLES_CONFIG[0];
  const visibleTabs = ROLE_TABS[currentUser.role] || ROLE_TABS.INVESTOR;

  const handleRoleSelect = (roleKey) => {
    setIsRoleDropdownOpen(false);

    if (roleKey === 'ADMIN') {
      onAdminRequest();
      return;
    }

    const targetRole = ROLES_CONFIG.find(r => r.key === roleKey);
    if (targetRole) {
      setCurrentUser({
        ...currentUser,
        role: roleKey,
        name: targetRole.defaultName,
        email: targetRole.defaultEmail
      });

      // Navigate exclusively to this role's default primary context tab
      setCurrentTab(targetRole.defaultTab);
    }
  };

  const handleTabClick = (tab) => {
    if (tab.isProtected && !isAdminAuthenticated) {
      onAdminRequest();
    } else {
      setCurrentTab(tab.key);
    }
  };

  const handleLogoClick = () => {
    setCurrentTab(currentRoleInfo.defaultTab);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#080c14]/95 backdrop-blur-xl shadow-xl">
      
      {/* Top Primary Bar */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo & Active Workspace Title */}
        <div className="flex items-center gap-6">
          <button 
            onClick={handleLogoClick}
            className="flex items-center gap-2.5 group text-left"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Rocket className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                Startup<span className="text-emerald-400">Hub</span>
              </span>
              <span className="block text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                {currentRoleInfo.workspaceTitle}
              </span>
            </div>
          </button>

          {/* Filtered Navigation Links (Strictly Role Specific for Desktop) */}
          <nav className="hidden md:flex items-center gap-1.5">
            {visibleTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.key;
              
              return (
                <button
                  key={tab.key}
                  onClick={() => handleTabClick(tab)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-purple-500/20 text-white border border-emerald-500/40 shadow-lg shadow-emerald-500/10' 
                      : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${
                    tab.color === 'emerald' ? 'text-emerald-400' :
                    tab.color === 'cyan' ? 'text-cyan-400' :
                    tab.color === 'purple' ? 'text-purple-400' :
                    tab.color === 'amber' ? 'text-amber-400' :
                    tab.color === 'rose' ? 'text-rose-400' : 'text-slate-400'
                  }`} />
                  <span>{tab.label}</span>
                  {tab.isProtected && !isAdminAuthenticated && (
                    <Lock className="h-3 w-3 text-amber-400/80 ml-0.5" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* AI Copilot Trigger */}
          <button
            onClick={toggleAiDrawer}
            className="flex items-center gap-1.5 sm:gap-2 px-3 py-2 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] border border-emerald-500/40 text-emerald-300 hover:text-white hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20 text-xs font-bold transition-all"
          >
            <Bot className="h-4 w-4 text-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">AI Copilot</span>
          </button>

          {/* Notification Center Bell */}
          <NotificationCenter 
            notifications={notifications} 
            markAsRead={markAsRead} 
            unreadCount={unreadCount} 
            onSelectMatch={() => setCurrentTab('webrtc')}
          />

          {/* User Role Switcher Dropdown (Explicit Click Control) */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className={`flex items-center gap-2 pl-2.5 pr-3 py-1.5 rounded-2xl border transition-all text-xs shadow-lg ${
                isRoleDropdownOpen 
                  ? 'border-emerald-400 bg-[#162035]' 
                  : 'border-white/20 bg-[#0c121e] hover:bg-[#162035]'
              }`}
              title="Click to switch role context"
            >
              <UserCircle className="h-5 w-5 text-emerald-400" />
              <div className="text-left hidden sm:block">
                <div className="font-bold text-slate-100 text-xs leading-none">{currentUser.name}</div>
                <span className={`inline-block px-1.5 py-0.2 rounded text-[9px] border font-black uppercase tracking-wider mt-0.5 ${currentRoleInfo.badgeClass}`}>
                  {currentRoleInfo.label}
                </span>
              </div>
              <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${isRoleDropdownOpen ? 'rotate-180 text-emerald-400' : ''}`} />
            </button>

            {/* Dropdown Popover - Solid Dark & High Contrast */}
            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-3xl border border-emerald-500/50 bg-[#070b14] p-3.5 shadow-2xl shadow-black z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-2 border-b border-white/10 mb-2.5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
                      Switch Role Context
                    </span>
                    <p className="text-[11px] text-slate-400 font-medium">Filters workspace strictly to role</p>
                  </div>
                  {isAdminAuthenticated && (
                    <button
                      onClick={() => {
                        setIsRoleDropdownOpen(false);
                        onLockAdmin();
                      }}
                      className="text-[10px] text-rose-400 hover:underline flex items-center gap-1 font-bold"
                      title="Lock Admin Session"
                    >
                      <Lock className="h-3 w-3" /> Lock Admin
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {ROLES_CONFIG.map((r) => {
                    const isSelected = currentUser.role === r.key;
                    return (
                      <button
                        key={r.key}
                        onClick={() => handleRoleSelect(r.key)}
                        className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold text-left transition-all border ${
                          isSelected 
                            ? 'bg-gradient-to-r from-emerald-950 to-slate-900 text-white border-emerald-400 shadow-md shadow-emerald-500/20' 
                            : r.key === 'ADMIN' 
                              ? 'bg-[#0f172a] text-amber-300 hover:bg-[#1a233b] border-white/10 hover:border-amber-500/30'
                              : 'bg-[#0f172a] text-slate-200 hover:bg-[#1a233b] hover:text-white border-white/10'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className={`mt-0.5 p-1.5 rounded-xl ${
                            isSelected ? 'bg-emerald-400 text-slate-950 font-black' : 'bg-[#1e293b] text-slate-400'
                          }`}>
                            {r.key === 'ADMIN' ? (
                              <Lock className="h-3.5 w-3.5" />
                            ) : (
                              <SlidersHorizontal className="h-3.5 w-3.5" />
                            )}
                          </div>
                          <div>
                            <div className="font-black text-xs text-white">{r.label}</div>
                            <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                              {r.workspaceTitle}
                            </div>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="h-5 w-5 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center shrink-0 shadow-sm">
                            <Check className="h-3 w-3 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="border-t border-white/10 mt-3 pt-2.5">
                  <button 
                    onClick={() => {
                      setIsRoleDropdownOpen(false);
                      openAuthModal();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors shadow-sm"
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span>Register / KYC Onboarding Profile</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Sub-Header: Role Quick Switch & Mobile Nav Bar - Solid Dark Background */}
      <div className="border-t border-b border-white/10 bg-[#05080f] px-4 sm:px-6 py-2 shadow-inner">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-4 overflow-x-auto text-xs">
          
          {/* Quick Role Switcher Chips */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 mr-1 hidden sm:inline">Role Workspace:</span>
            {ROLES_CONFIG.map((r) => {
              const isSelected = currentUser.role === r.key;
              return (
                <button
                  key={r.key}
                  onClick={() => handleRoleSelect(r.key)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition-all whitespace-nowrap flex items-center gap-1.5 shadow-sm ${
                    isSelected
                      ? 'bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/30 border border-emerald-300'
                      : 'bg-[#0f172a] text-slate-300 hover:text-white hover:bg-[#1e293b] border border-white/10'
                  }`}
                >
                  {r.key === 'ADMIN' && <Lock className="h-3 w-3" />}
                  <span>{r.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Tab Pills (when screen is narrow) */}
          <div className="flex md:hidden items-center gap-1 shrink-0 pl-2 border-l border-white/10">
            {visibleTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => handleTabClick(tab)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-[#0f172a] text-slate-300 hover:text-white border border-white/10'
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  <span>{tab.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

        </div>
      </div>

    </header>
  );
}
