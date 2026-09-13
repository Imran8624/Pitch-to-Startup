import React, { useState, useEffect } from 'react';
import Navbar, { ROLE_TABS, ROLES_CONFIG } from './components/Navbar';
import InvestorSwipeDeck from './components/InvestorSwipeDeck';
import WebRtcPitchRoom from './components/WebRtcPitchRoom';
import StartupTracker from './components/StartupTracker';
import TalentMarketplace from './components/TalentMarketplace';
import MarketingTeamAgent from './components/MarketingTeamAgent';
import AiCopilotDrawer from './components/AiCopilotDrawer';
import AdminConsole from './components/AdminConsole';
import AuthModal from './components/AuthModal';
import AdminPasswordModal from './components/AdminPasswordModal';
import { Sparkles, Bell, X, ShieldCheck, Lock } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState('swipe');
  const [currentUser, setCurrentUser] = useState({
    id: 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    name: 'Sarah Jenkins',
    email: 'investor.sarah@apexvc.com',
    role: 'INVESTOR'
  });

  // Ensure currentTab is strictly valid for active role context
  useEffect(() => {
    const allowed = (ROLE_TABS[currentUser.role] || []).map(t => t.key);
    if (allowed.length > 0 && !allowed.includes(currentTab)) {
      const cfg = ROLES_CONFIG.find(r => r.key === currentUser.role);
      if (cfg) {
        setCurrentTab(cfg.defaultTab);
      }
    }
  }, [currentUser.role]);

  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminPasswordModalOpen, setIsAdminPasswordModalOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // In-App Notification Center State
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Dealflow Alert: New Pitch Deck Uploaded',
      message: 'Quantum AI Labs uploaded a new $2.5M Seed round pitch deck in AI/ML sector.',
      category: 'NEW_STARTUP',
      time: '10 mins ago',
      isRead: false
    },
    {
      id: 'notif-2',
      title: 'Instant Match! 1-on-1 Pitch Call Unlocked',
      message: 'Founder Alex Vance accepted your swipe interest. Room ID: pitch-room-7842',
      category: 'SWIPE_MATCH',
      time: '1 hour ago',
      isRead: false
    }
  ]);

  const [toastAlert, setToastAlert] = useState(null);

  // Real-time STOMP notification simulation / interval ping
  useEffect(() => {
    const interval = setInterval(() => {
      const newAlert = {
        id: 'toast-' + Date.now(),
        title: 'New High-Growth Startup Listed!',
        message: 'BioGenix Health listed a Pre-Seed round ($1.8M Ask) in HealthTech.',
        category: 'NEW_STARTUP',
        time: 'Just now',
        isRead: false
      };
      
      // Push toast alert
      setToastAlert(newAlert);
      setNotifications(prev => [newAlert, ...prev]);

      // Auto dismiss toast
      setTimeout(() => setToastAlert(null), 5000);
    }, 45000);

    return () => clearInterval(interval);
  }, []);

  const markAsRead = (id) => {
    if (id === null) {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } else {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Intercept Admin Access to enforce password challenge
  const handleAdminRequest = () => {
    if (isAdminAuthenticated) {
      setCurrentUser(prev => ({
        ...prev,
        name: 'Super Admin',
        email: 'admin@startuphub.internal',
        role: 'ADMIN'
      }));
      setCurrentTab('admin');
    } else {
      setIsAdminPasswordModalOpen(true);
    }
  };

  // Called when Admin successfully enters master password
  const handleAdminAuthSuccess = () => {
    setIsAdminAuthenticated(true);
    setCurrentUser({
      id: 'adm-001',
      name: 'Super Admin',
      email: 'admin@startuphub.internal',
      role: 'ADMIN'
    });
    setCurrentTab('admin');
    
    setToastAlert({
      id: 'toast-admin-auth',
      title: 'Super-Admin Authenticated',
      message: 'Admin role and database controls unlocked successfully.',
      category: 'SYSTEM_ALERT',
      time: 'Just now',
      isRead: false
    });
    setTimeout(() => setToastAlert(null), 4000);
  };

  // Called when locking admin session
  const handleLockAdmin = () => {
    setIsAdminAuthenticated(false);
    setCurrentUser({
      id: 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
      name: 'Sarah Jenkins',
      email: 'investor.sarah@apexvc.com',
      role: 'INVESTOR'
    });
    setCurrentTab('swipe');

    setToastAlert({
      id: 'toast-admin-lock',
      title: 'Admin Session Locked',
      message: 'Switched back to Investor mode. Admin credentials required for re-entry.',
      category: 'SYSTEM_ALERT',
      time: 'Just now',
      isRead: false
    });
    setTimeout(() => setToastAlert(null), 4000);
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Top Sticky Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        toggleAiDrawer={() => setIsAiDrawerOpen(!isAiDrawerOpen)}
        openAuthModal={() => setIsAuthModalOpen(true)}
        notifications={notifications}
        markAsRead={markAsRead}
        unreadCount={unreadCount}
        isAdminAuthenticated={isAdminAuthenticated}
        onAdminRequest={handleAdminRequest}
        onLockAdmin={handleLockAdmin}
      />

      {/* Real-time Floating Toast Manager */}
      {toastAlert && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up max-w-sm">
          <div className="glass-card rounded-2xl p-4 border border-emerald-500/50 shadow-2xl flex items-start gap-3 bg-slate-900/95">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-white">{toastAlert.title}</h4>
              <p className="text-xs text-slate-300 mt-0.5 line-clamp-2">{toastAlert.message}</p>
            </div>
            <button 
              onClick={() => setToastAlert(null)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main View Router */}
      <main className="flex-1">
        {currentTab === 'swipe' && (
          <InvestorSwipeDeck
            currentUser={currentUser}
            onNavigateToWebRtc={() => setCurrentTab('webrtc')}
          />
        )}

        {currentTab === 'tracker' && (
          <StartupTracker 
            onNavigateToMarketing={() => setCurrentTab('marketing')} 
            onNavigateToWebRtc={() => setCurrentTab('webrtc')}
          />
        )}

        {currentTab === 'talent' && (
          <TalentMarketplace 
            currentUser={currentUser} 
            onNavigateToPitchRoom={() => setCurrentTab('webrtc')}
          />
        )}

        {currentTab === 'marketing' && (
          <MarketingTeamAgent />
        )}

        {currentTab === 'webrtc' && (
          <WebRtcPitchRoom currentUser={currentUser} />
        )}

        {currentTab === 'admin' && (
          <AdminConsole onLockAdmin={handleLockAdmin} />
        )}
      </main>

      {/* Autonomous AI Copilot Drawer */}
      <AiCopilotDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        currentUser={currentUser}
      />

      {/* Multi-Role Registration & Onboarding KYC Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onRegisterSuccess={(newUser) => {
          const targetRoleKey = newUser.role || 'INVESTOR';
          let defaultTab = 'swipe';
          if (targetRoleKey === 'STUDENT_FOUNDER') defaultTab = 'tracker';
          else if (targetRoleKey === 'TALENT') defaultTab = 'talent';
          else if (targetRoleKey === 'VENDOR') defaultTab = 'tracker';
          else if (targetRoleKey === 'ADMIN') defaultTab = 'admin';

          setCurrentUser({
            ...currentUser,
            name: newUser.name,
            role: targetRoleKey,
            email: newUser.email
          });
          setCurrentTab(defaultTab);

          setToastAlert({
            id: 'toast-reg-' + Date.now(),
            title: 'Context Switched: ' + targetRoleKey,
            message: `Switched active workspace to ${newUser.name}'s profile.`,
            category: 'SYSTEM_ALERT',
            time: 'Just now',
            isRead: false
          });
          setTimeout(() => setToastAlert(null), 4000);
        }}
      />


      {/* Admin Password Challenge Modal */}
      <AdminPasswordModal
        isOpen={isAdminPasswordModalOpen}
        onClose={() => setIsAdminPasswordModalOpen(false)}
        onSuccess={handleAdminAuthSuccess}
      />

      {/* Minimal Footer */}
      <footer className="border-t border-white/10 bg-slate-950/60 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 StartupHub Inc. All rights reserved.</span>
          <span className="font-mono text-[11px] text-emerald-400">
            PostgreSQL 16 + pgvector • Spring Boot 3 • WebRTC • STOMP
          </span>
        </div>
      </footer>

    </div>
  );
}
