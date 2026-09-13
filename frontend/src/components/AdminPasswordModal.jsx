import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  X, 
  KeyRound, 
  AlertCircle, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

const ADMIN_MASTER_PASSWORD = 'StartupHubAdmin#2026!';
const ADMIN_FALLBACK_PASSWORDS = ['StartupHubAdmin#2026!', 'admin123', 'admin', 'StartupHubAdmin#SecurePass2026!'];

export default function AdminPasswordModal({ 
  isOpen, 
  onClose, 
  onSuccess 
}) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setError('');
      setIsSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e?.preventDefault();
    setError('');
    setIsSubmitting(true);

    setTimeout(() => {
      if (ADMIN_FALLBACK_PASSWORDS.includes(password.trim())) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSubmitting(false);
          onSuccess();
          onClose();
        }, 500);
      } else {
        setIsSubmitting(false);
        setError('Access Denied: Invalid administrator security password.');
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="glass-card w-full max-w-md rounded-3xl p-6 sm:p-8 border border-amber-500/40 shadow-2xl relative bg-[#0d1322]/95">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Security Shield Icon & Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-rose-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
            <Lock className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            Administrator Authentication
          </h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Restricted System Area. Please enter the master admin password to unlock the Super-Admin role and database controls.
          </p>
        </div>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
              <KeyRound className="h-3.5 w-3.5 text-amber-400" />
              Admin Master Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                autoFocus
                placeholder="Enter admin password..."
                className="w-full rounded-xl bg-slate-900/90 border border-white/15 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/50 pr-12 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-rose-400 text-xs animate-shake">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {isSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-emerald-400 text-xs">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Identity Verified. Unlocking Super-Admin Role...</span>
            </div>
          )}

          {/* Quick Credential Helper Pill */}
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Passcode: <code className="text-amber-300 font-mono font-bold">StartupHubAdmin#2026!</code></span>
            <button
              type="button"
              onClick={() => { setPassword('StartupHubAdmin#2026!'); setError(''); }}
              className="text-[10px] text-amber-400 hover:underline font-semibold"
            >
              Fill Password
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !password.trim()}
              className="w-2/3 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-black font-extrabold text-xs transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                'Verifying...'
              ) : (
                <>
                  <span>Authenticate Admin</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
