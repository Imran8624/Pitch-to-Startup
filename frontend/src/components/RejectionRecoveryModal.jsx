import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  MessageSquare, 
  Sparkles, 
  Copy, 
  Check, 
  ExternalLink, 
  Zap, 
  ShieldAlert, 
  X, 
  RefreshCw,
  Award,
  ArrowRight,
  TrendingUp,
  BrainCircuit
} from 'lucide-react';

export default function RejectionRecoveryModal({ 
  isOpen, 
  onClose, 
  initialStartup = 'Quantum AI Labs',
  initialRole = 'Lead AI Infrastructure Engineer',
  initialTechStack = 'Spring Boot, pgvector & React'
}) {
  const [startupName, setStartupName] = useState(initialStartup);
  const [roleTitle, setRoleTitle] = useState(initialRole);
  const [hrName, setHrName] = useState('Sarah Jenkins (Head of Talent)');
  const [techStack, setTechStack] = useState(initialTechStack);
  const [copiedKey, setCopiedKey] = useState('');
  const [activeFormat, setActiveFormat] = useState('EMAIL'); // EMAIL | DM | CHALLENGE
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchedSuccess, setDispatchedSuccess] = useState(false);

  if (!isOpen) return null;

  const emailSubject = `Quick perspective on ${startupName}'s ${techStack.split(',')[0].trim()} architecture (re: ${roleTitle})`;

  const coldEmailBody = `Hi ${hrName.split(' ')[0] || 'Team'},

I noticed the automated ATS update regarding the ${roleTitle} role at ${startupName} — completely understand you are vetting a high volume of candidates.

Rather than just resubmitting a resume, I spent the afternoon digging into ${startupName}'s technical roadmap. Given your focus on ${techStack}, I put together a brief technical benchmark demonstrating how introducing vector indexing and connection pool tuning can cut query latency by ~38%.

Here is the 2-minute Loom walkthrough + GitHub repo:
https://github.com/alexvance/${startupName.toLowerCase().replace(/[^a-z0-9]/g, '')}-benchmark-poc

No strings attached — if you have 10 minutes next Tuesday, I'd love to share my findings on scaling ${techStack}. If not, keep crushing the build!

Best regards,
Alex Vance
GitHub: github.com/alexvance | LinkedIn: linkedin.com/in/alexvance`;

  const directMessage = `Hey ${hrName.split(' ')[0] || 'there'} — saw the automated ATS update for ${roleTitle} at ${startupName}. Totally get it! Just built a quick working POC addressing ${techStack} scale & query latency for your product stack. Dropped the GitHub link here: github.com/alexvance/${startupName.toLowerCase().replace(/[^a-z0-9]/g, '')}-poc. Would love to send over a 60-sec demo if you're open to it!`;

  const challengePitch = `Hi ${hrName.split(' ')[0] || 'Team'}, I know standard ATS filters miss nuances. If you have an unassigned backlog ticket or a 48-hour take-home engineering challenge related to ${startupName}'s ${techStack} pipeline, send it over. I'll build and document it for free to prove production fit.`;

  const handleCopy = (key, text) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 2000);
  };

  const handleSendMail = () => {
    const mailtoUrl = `mailto:recruiting@${startupName.toLowerCase().replace(/[^a-z0-9]/g, '')}.io?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(coldEmailBody)}`;
    window.open(mailtoUrl, '_blank');
  };

  const handleSimulatedDispatch = () => {
    setIsDispatching(true);
    setTimeout(() => {
      setIsDispatching(false);
      setDispatchedSuccess(true);
      setTimeout(() => setDispatchedSuccess(false), 4000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in overflow-y-auto">
      <div className="glass-card w-full max-w-2xl rounded-3xl p-6 sm:p-8 border border-amber-500/40 shadow-2xl relative bg-[#0d1322]/95 my-8 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-rose-500/20 text-amber-400 border border-amber-500/30 shrink-0">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                Automated Rejection-Recovery &amp; HR Direct Outreach Agent
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              If an application or ATS scan is rejected, this agent automatically crafts high-conversion, value-first direct messages that bypass standard filters and land directly in HR &amp; Founder DMs.
            </p>
          </div>
        </div>

        {/* Context Configuration Row */}
        <div className="mt-5 p-4 rounded-2xl bg-slate-900/80 border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Company</label>
            <input
              type="text"
              value={startupName}
              onChange={(e) => setStartupName(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-2.5 py-1.5 text-white font-semibold focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Role Title</label>
            <input
              type="text"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-2.5 py-1.5 text-white font-semibold focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Key Tech Stack</label>
            <input
              type="text"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-2.5 py-1.5 text-white font-semibold focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Format Selector */}
        <div className="mt-5 flex bg-slate-900 p-1 rounded-2xl border border-white/10 text-xs">
          <button
            onClick={() => setActiveFormat('EMAIL')}
            className={`flex-1 py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeFormat === 'EMAIL' ? 'bg-amber-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mail className="h-3.5 w-3.5" />
            Value-First Cold Email
          </button>
          <button
            onClick={() => setActiveFormat('DM')}
            className={`flex-1 py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeFormat === 'DM' ? 'bg-amber-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            15-Sec LinkedIn / Twitter DM
          </button>
          <button
            onClick={() => setActiveFormat('CHALLENGE')}
            className={`flex-1 py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeFormat === 'CHALLENGE' ? 'bg-amber-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Award className="h-3.5 w-3.5" />
            48-Hour Proof Challenge
          </button>
        </div>

        {/* Content Box */}
        <div className="mt-4 p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
          
          {activeFormat === 'EMAIL' && (
            <>
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-500 block">Subject Line:</span>
                <div className="font-semibold text-xs text-amber-300 font-mono mt-0.5">{emailSubject}</div>
              </div>
              <div className="border-t border-white/10 pt-3">
                <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">Email Body:</span>
                <pre className="text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed">
                  {coldEmailBody}
                </pre>
              </div>
            </>
          )}

          {activeFormat === 'DM' && (
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">Punchy Direct Message (For LinkedIn InMail / Twitter DMs):</span>
              <pre className="text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed">
                {directMessage}
              </pre>
            </div>
          )}

          {activeFormat === 'CHALLENGE' && (
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">Direct Proof-of-Work Challenge Proposal:</span>
              <pre className="text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed">
                {challengePitch}
              </pre>
            </div>
          )}

        </div>

        {/* Psychological Hooks Strategy Card */}
        <div className="mt-4 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-xs space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-emerald-400 text-[11px]">
            <BrainCircuit className="h-4 w-4" />
            Why This Breaks Through 99% of HR Inboxes:
          </div>
          <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
            <li><strong>Value-In-Advance:</strong> Delivers a working benchmark/POC instead of asking for a favor.</li>
            <li><strong>Anti-Desperation Pivot:</strong> Acknowledges rejection gracefully with zero complaining.</li>
            <li><strong>Technical Specificity:</strong> Cites the exact {techStack} stack and quantifiable ROI (~38% latency reduction).</li>
          </ul>
        </div>

        {/* Success Alert */}
        {dispatchedSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <Check className="h-4 w-4 shrink-0" />
            <span>Outreach package dispatched to HR Direct Inbox simulator! Copied to clipboard.</span>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="mt-5 flex items-center justify-between gap-3 pt-3 border-t border-white/10">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy('content', activeFormat === 'EMAIL' ? coldEmailBody : activeFormat === 'DM' ? directMessage : challengePitch)}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
            >
              {copiedKey === 'content' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              {copiedKey === 'content' ? 'Copied' : 'Copy Message'}
            </button>

            {activeFormat === 'EMAIL' && (
              <button
                onClick={handleSendMail}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Open in Email App
              </button>
            )}
          </div>

          <button
            onClick={handleSimulatedDispatch}
            disabled={isDispatching}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-black font-extrabold text-xs transition-all shadow-lg flex items-center gap-2"
          >
            {isDispatching ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>Dispatching to HR DMs...</span>
              </>
            ) : (
              <>
                <Send className="h-3.5 w-3.5" />
                <span>Auto-Send Cold Outreach to HR</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
