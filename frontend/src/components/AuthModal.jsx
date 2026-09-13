import React, { useState } from 'react';
import { 
  X, 
  Rocket, 
  ShieldCheck, 
  UploadCloud, 
  CheckCircle2, 
  Building2, 
  User, 
  Mail, 
  Lock, 
  ArrowRight 
} from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onRegisterSuccess }) {
  const [role, setRole] = useState('STUDENT_FOUNDER');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [cinGstin, setCinGstin] = useState('');
  const [docFile, setDocFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onRegisterSuccess({
        name: fullName,
        role: role,
        email: email
      });
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="glass-card w-full max-w-lg rounded-3xl p-6 border border-emerald-500/40 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-bounce">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-white">KYC Registration Submitted</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Your credentials and documents have been queued for Super-Admin review. RBAC access granted.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Rocket className="h-5 w-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-white">StartupHub Multi-Role Onboarding</h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">Select your ecosystem role and submit verified credentials.</p>
            </div>

            {/* Role Selection Grid */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Select Ecosystem Role Context</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { key: 'STUDENT_FOUNDER', label: 'Student Founder' },
                  { key: 'INVESTOR', label: 'Accredited Investor / VC' },
                  { key: 'TALENT', label: 'Talent / Freelancer' },
                  { key: 'VENDOR', label: 'Enterprise Vendor' }
                ].map(r => (
                  <button
                    type="button"
                    key={r.key}
                    onClick={() => setRole(r.key)}
                    className={`p-2.5 rounded-xl border text-left font-semibold transition-all ${
                      role === r.key 
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
                        : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Vance"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  placeholder="alex@startup.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Company / Firm Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Quantum AI Labs"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">CIN / GSTIN / VC ID</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CIN-U72900KA..."
                  value={cinGstin}
                  onChange={(e) => setCinGstin(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Document Upload */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Upload KYC Verification Document</label>
              <div className="border-2 border-dashed border-white/10 rounded-xl p-3 text-center bg-slate-900/50 hover:border-emerald-500/40 transition-colors">
                <UploadCloud className="h-5 w-5 text-slate-400 mx-auto mb-1" />
                <span className="text-xs text-slate-300 block font-medium">Click to select PDF or image document</span>
                <span className="text-[10px] text-slate-500">Incorporation certificate, tax filing, or accreditation proof</span>
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={(e) => setDocFile(e.target.files[0])} 
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-glow py-3 rounded-xl text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2"
            >
              <span>Submit for Verification</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
