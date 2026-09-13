import React, { useState } from 'react';
import { X, FileText, CheckCircle2, Download, DollarSign, Send, ShieldCheck } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { soundEffects } from '../utils/audioEffects';

export default function TermSheetModal({
  isOpen,
  onClose,
  startup,
  initialTermSheet,
  onTermSheetSent
}) {
  if (!isOpen || !startup) return null;

  const [investmentAmount, setInvestmentAmount] = useState(
    initialTermSheet?.targetAmount || '$1,500,000'
  );
  const [valuationCap, setValuationCap] = useState(
    initialTermSheet?.valuationCap || '$10,000,000'
  );
  const [instrument, setInstrument] = useState('SAFE (Post-Money with MFN)');
  const [discountRate, setDiscountRate] = useState('20%');
  const [boardSeat, setBoardSeat] = useState(true);
  const [proRata, setProRata] = useState(true);
  const [isSent, setIsSent] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleSendOffer = () => {
    soundEffects.playMatchSuccess();
    setIsSent(true);
    if (onTermSheetSent) {
      onTermSheetSent({
        startupName: startup.name,
        investmentAmount,
        valuationCap,
        instrument,
        discountRate,
        date: new Date().toISOString()
      });
    }
  };

  const handleDownloadPdf = () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF();
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, 210, 30, 'F');
      
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(16, 185, 129);
      doc.setFontSize(14);
      doc.text('STARTUPHUB VENTURE SYNDICATE • TERM SHEET', 15, 20);

      doc.setTextColor(30, 41, 59);
      doc.setFontSize(18);
      doc.text(`CONFIDENTIAL INVESTMENT TERM SHEET`, 15, 45);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text(`Date: ${new Date().toLocaleDateString()} | Prepared for: ${startup.name}`, 15, 53);

      doc.setDrawColor(203, 213, 225);
      doc.line(15, 58, 195, 58);

      let y = 70;
      const terms = [
        ['Issuer / Company:', startup.name],
        ['Founder / Signatory:', startup.founder || startup.founderName || 'Founder'],
        ['Investment Amount:', investmentAmount],
        ['Post-Money Valuation Cap:', valuationCap],
        ['Investment Instrument:', instrument],
        ['Discount Rate:', discountRate],
        ['Board Governance:', boardSeat ? '1 Board Observer Seat Granted' : 'Standard Advisory Only'],
        ['Pro-Rata Rights:', proRata ? 'Major Investor Pro-Rata for Future Rounds' : 'None'],
        ['Information Rights:', 'Quarterly Financials & Monthly KPI Reports'],
        ['Governing Law:', 'State of Delaware / International Standard Safe'],
      ];

      doc.setFontSize(11);
      terms.forEach(([label, val]) => {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(51, 65, 85);
        doc.text(label, 15, y);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(15, 23, 42);
        doc.text(val, 85, y);
        y += 12;
      });

      y += 15;
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(15, y, 180, 45, 3, 3, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      doc.text('LEGAL NOTICE & SIGN-OFF INTENT', 20, y + 12);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('This term sheet summarizes the principal terms of the proposed financing and', 20, y + 22);
      doc.text('is non-binding except with respect to confidentiality and exclusivity provisions.', 20, y + 32);

      doc.save(`Term_Sheet_${startup.name.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="glass-card w-full max-w-xl rounded-3xl p-6 border border-emerald-500/30 shadow-2xl relative bg-slate-950/95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Generate Investment Term Sheet</h3>
              <p className="text-xs text-slate-400">Formalize round terms for {startup.name} ({startup.founder || startup.founderName})</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        {isSent ? (
          <div className="py-8 text-center space-y-3">
            <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h4 className="text-xl font-bold text-white">Term Sheet Dispatched!</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              The formal Term Sheet offer has been securely delivered to <strong>{startup.founder || startup.founderName}</strong>. You will receive real-time notifications on response status.
            </p>
            <div className="pt-4 flex items-center justify-center gap-3">
              <button
                onClick={handleDownloadPdf}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all border border-white/10"
              >
                <Download className="h-4 w-4 text-emerald-400" /> Download PDF Copy
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Investment Commitment
                </label>
                <input
                  type="text"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Valuation Cap
                </label>
                <input
                  type="text"
                  value={valuationCap}
                  onChange={(e) => setValuationCap(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Instrument Type
                </label>
                <select
                  value={instrument}
                  onChange={(e) => setInstrument(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                >
                  <option value="SAFE (Post-Money with MFN)">SAFE (Post-Money with MFN)</option>
                  <option value="SAFE (Pre-Money)">SAFE (Pre-Money)</option>
                  <option value="Convertible Promissory Note (8% Interest)">Convertible Note (8% Interest)</option>
                  <option value="Priced Preferred Series Equity">Priced Preferred Series Equity</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Discount Rate
                </label>
                <select
                  value={discountRate}
                  onChange={(e) => setDiscountRate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                >
                  <option value="15%">15% Standard</option>
                  <option value="20%">20% Market Norm</option>
                  <option value="25%">25% Early Backer</option>
                  <option value="0%">0% (No Discount)</option>
                </select>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={boardSeat}
                  onChange={(e) => setBoardSeat(e.target.checked)}
                  className="rounded text-emerald-500 focus:ring-0"
                />
                <span>Request 1 Board Observer Seat for Lead Syndicate</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={proRata}
                  onChange={(e) => setProRata(e.target.checked)}
                  className="rounded text-emerald-500 focus:ring-0"
                />
                <span>Include Pro-Rata Participation Rights in subsequent rounds</span>
              </label>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                onClick={handleDownloadPdf}
                disabled={isExporting}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-white/10 transition-all"
              >
                <Download className="h-4 w-4 text-emerald-400" /> Export PDF Draft
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendOffer}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
                >
                  <Send className="h-4 w-4" /> Send Official Term Sheet
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
