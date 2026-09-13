import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  Search, 
  Building2, 
  User, 
  Eye, 
  EyeOff,
  Lock, 
  History,
  AlertTriangle,
  Code,
  Database,
  KeyRound,
  Server,
  Play,
  Copy,
  ExternalLink,
  Check
} from 'lucide-react';

const INITIAL_QUEUE = [
  {
    id: 'kyc-001',
    applicantName: 'Alex Vance',
    role: 'STUDENT_FOUNDER',
    companyName: 'Quantum AI Labs',
    documentType: 'CIN Document',
    documentNumber: 'CIN-U72900KA2024PTC1001',
    submittedAt: '2026-08-22 10:15 AM',
    status: 'PENDING'
  },
  {
    id: 'kyc-002',
    applicantName: 'Sarah Jenkins',
    role: 'INVESTOR',
    companyName: 'Apex Capital Partners',
    documentType: 'SEBI VC Accreditation License',
    documentNumber: 'VC-REG-2023-887',
    submittedAt: '2026-08-22 11:45 AM',
    status: 'PENDING'
  },
  {
    id: 'kyc-003',
    applicantName: 'CloudScale Inc.',
    role: 'VENDOR',
    companyName: 'CloudScale Inc.',
    documentType: 'GSTIN Registration',
    documentNumber: 'GSTIN999000111',
    submittedAt: '2026-08-22 01:20 PM',
    status: 'PENDING'
  }
];

const INITIAL_AUDIT_LOGS = [
  {
    id: 'log-801',
    actorName: 'System Administrator',
    actionType: 'KYC_VERIFIED',
    entityName: 'User',
    entityId: 'user-b1eebc99',
    timestamp: '2026-08-22 09:30 AM',
    ipAddress: '192.168.1.100',
    detailsJson: {
      verified: true,
      documentType: 'CIN',
      verifiedBy: 'System Administrator',
      verificationNote: 'CIN document matched with MCA registrar registry.'
    }
  },
  {
    id: 'log-802',
    actorName: 'Sarah Jenkins (Investor)',
    actionType: 'FUNDING_ROUND_RECORDED',
    entityName: 'FundingTransaction',
    entityId: 'tx-e4eebc99',
    timestamp: '2026-08-22 11:00 AM',
    ipAddress: '10.0.4.12',
    detailsJson: {
      round: 'Seed Round',
      amount: '$1,200,000',
      equityPct: '15.0%',
      leadInvestor: 'Apex Capital Partners'
    }
  },
  {
    id: 'log-803',
    actorName: 'Alex Vance (Founder)',
    actionType: 'EQUITY_TRANSFERRED',
    entityName: 'Stakeholder',
    entityId: 'stakeholder-004',
    timestamp: '2026-08-22 02:15 PM',
    ipAddress: '172.16.0.44',
    detailsJson: {
      from: 'Alex Vance',
      to: 'CloudScale Inc.',
      sharePct: '5.0%',
      title: 'Enterprise Cloud Partner'
    }
  },
  {
    id: 'log-804',
    actorName: 'Super Admin',
    actionType: 'DB_CREDENTIALS_ACCESSED',
    entityName: 'DatabaseConfig',
    entityId: 'H2_POSTGRES_MEM',
    timestamp: '2026-09-07 00:58 AM',
    ipAddress: '127.0.0.1',
    detailsJson: {
      databaseUser: 'admin_db_user',
      accessType: 'ADMIN_CONSOLE_ACCESS',
      status: 'AUTHENTICATED'
    }
  }
];

const DATABASE_TABLES = [
  { name: 'users', records: 12, description: 'Platform stakeholders, founders, investors, talents', columns: 'id, email, full_name, role, kyc_status, created_at' },
  { name: 'startups', records: 8, description: 'Registered startup ventures and pitch deck data', columns: 'id, founder_id, company_name, industry, funding_stage, valuation' },
  { name: 'investor_swipes', records: 45, description: 'Investor Tinder-style swipes and deal matches', columns: 'id, investor_id, startup_id, direction, note, swiped_at' },
  { name: 'cap_table_stakeholders', records: 15, description: 'Cap-table ownership & equity distribution', columns: 'id, startup_id, stakeholder_name, equity_pct, share_count' },
  { name: 'kyc_verifications', records: 3, description: 'Pending & verified compliance documents', columns: 'id, user_id, document_type, document_number, status, verified_at' },
  { name: 'system_audit_logs', records: 804, description: 'Immutable administrative audit trail', columns: 'id, actor_email, action_type, entity_name, entity_id, ip_address' }
];

const SAMPLE_QUERY_RESULTS = {
  'users': [
    { id: 'usr-1', email: 'admin@startuphub.internal', full_name: 'Super Admin', role: 'ADMIN', kyc_status: 'VERIFIED' },
    { id: 'usr-2', email: 'alex@quantumai.io', full_name: 'Alex Vance', role: 'STUDENT_FOUNDER', kyc_status: 'VERIFIED' },
    { id: 'usr-3', email: 'sarah@apexvc.com', full_name: 'Sarah Jenkins', role: 'INVESTOR', kyc_status: 'VERIFIED' }
  ],
  'startups': [
    { id: 'stp-101', company_name: 'Quantum AI Labs', industry: 'Artificial Intelligence', funding_stage: 'SEED', valuation: '$8,500,000' },
    { id: 'stp-102', company_name: 'BioSynthetix', industry: 'Biotechnology', funding_stage: 'SERIES_A', valuation: '$14,000,000' },
    { id: 'stp-103', company_name: 'NanoClean Tech', industry: 'CleanTech', funding_stage: 'PRE_SEED', valuation: '$3,200,000' }
  ],
  'investor_swipes': [
    { id: 'swp-901', investor_id: 'usr-3', startup_id: 'stp-101', direction: 'RIGHT_LIKE', note: 'Strong defensible AI patent' },
    { id: 'swp-902', investor_id: 'usr-3', startup_id: 'stp-102', direction: 'RIGHT_LIKE', note: 'Promising clinical trial phase 1' }
  ]
};

export default function AdminConsole({ onLockAdmin }) {
  const [queue, setQueue] = useState(INITIAL_QUEUE);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);
  const [activeSubTab, setActiveSubTab] = useState('DATABASE'); // VERIFICATION | AUDIT_LOGS | DATABASE
  const [selectedJsonDetails, setSelectedJsonDetails] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedKey, setCopiedKey] = useState('');
  const [activeSql, setActiveSql] = useState('SELECT * FROM users LIMIT 10;');
  const [queryResult, setQueryResult] = useState(SAMPLE_QUERY_RESULTS['users']);
  const [queryExecuting, setQueryExecuting] = useState(false);

  const dbCredentials = {
    username: 'admin_db_user',
    password: 'StartupHubAdmin#SecurePass2026!',
    jdbcUrl: 'jdbc:h2:mem:startuphubdb',
    driver: 'org.h2.Driver',
    consoleUrl: 'http://localhost:8080/h2-console'
  };

  const handleCopy = (key, value) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 2000);
  };

  const handleExecuteSql = (sqlText) => {
    setQueryExecuting(true);
    const sql = sqlText || activeSql;
    setTimeout(() => {
      if (sql.toLowerCase().includes('startup')) {
        setQueryResult(SAMPLE_QUERY_RESULTS['startups']);
      } else if (sql.toLowerCase().includes('swipe')) {
        setQueryResult(SAMPLE_QUERY_RESULTS['investor_swipes']);
      } else {
        setQueryResult(SAMPLE_QUERY_RESULTS['users']);
      }
      setQueryExecuting(false);

      // Add audit log
      const newAuditLog = {
        id: 'log-' + Math.floor(Math.random() * 1000 + 805),
        actorName: 'Super Admin',
        actionType: 'DB_QUERY_EXECUTED',
        entityName: 'SQL_CONSOLE',
        entityId: 'ADMIN_SESSION',
        timestamp: new Date().toLocaleTimeString(),
        ipAddress: '127.0.0.1',
        detailsJson: { sqlQuery: sql, rowsReturned: 3, executedBy: 'admin_db_user' }
      };
      setAuditLogs(prev => [newAuditLog, ...prev]);
    }, 400);
  };

  const handleApprove = (id) => {
    setQueue(prev => prev.map(item => item.id === id ? { ...item, status: 'VERIFIED' } : item));
    const newAuditLog = {
      id: 'log-' + Math.floor(Math.random() * 1000),
      actorName: 'Super Admin',
      actionType: 'KYC_VERIFIED',
      entityName: 'VerificationRequest',
      entityId: id,
      timestamp: new Date().toLocaleString(),
      ipAddress: '127.0.0.1',
      detailsJson: { status: 'VERIFIED', adminApproved: true }
    };
    setAuditLogs(prev => [newAuditLog, ...prev]);
  };

  const handleReject = (id) => {
    setQueue(prev => prev.map(item => item.id === id ? { ...item, status: 'REJECTED' } : item));
    const newAuditLog = {
      id: 'log-' + Math.floor(Math.random() * 1000),
      actorName: 'Super Admin',
      actionType: 'KYC_REJECTED',
      entityName: 'VerificationRequest',
      entityId: id,
      timestamp: new Date().toLocaleString(),
      ipAddress: '127.0.0.1',
      detailsJson: { status: 'REJECTED', reason: 'Failed document check.' }
    };
    setAuditLogs(prev => [newAuditLog, ...prev]);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <ShieldCheck className="h-7 w-7 text-amber-400" />
              Super-Admin Console &amp; Governance
            </h1>
            {onLockAdmin && (
              <button
                onClick={onLockAdmin}
                className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[11px] font-bold flex items-center gap-1 transition-colors"
                title="Lock admin session and return to user mode"
              >
                <Lock className="h-3 w-3" /> Lock Admin
              </button>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Strict role-restricted administration: Database credentials, KYC verification queue, and immutable audit logs.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setActiveSubTab('DATABASE')}
            className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-1.5 ${activeSubTab === 'DATABASE' ? 'bg-amber-500 text-black shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            <Database className="h-3.5 w-3.5" />
            Database Management
          </button>
          <button
            onClick={() => setActiveSubTab('VERIFICATION')}
            className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-1.5 ${activeSubTab === 'VERIFICATION' ? 'bg-amber-500 text-black shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            <Clock className="h-3.5 w-3.5" />
            Verification Queue ({queue.filter(q => q.status === 'PENDING').length})
          </button>
          <button
            onClick={() => setActiveSubTab('AUDIT_LOGS')}
            className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-1.5 ${activeSubTab === 'AUDIT_LOGS' ? 'bg-amber-500 text-black shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            <History className="h-3.5 w-3.5" />
            Audit Ledger ({auditLogs.length})
          </button>
        </div>
      </div>

      {/* SUB-TAB: Database Management (Admin Only) */}
      {activeSubTab === 'DATABASE' && (
        <div className="space-y-6">
          
          {/* Top Security Banner */}
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-3xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/20 rounded-2xl text-amber-400 border border-amber-500/30">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-white">Database Access Control: Admin Restricted</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    ROLE_ADMIN_ONLY
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Database management and direct console access is isolated exclusively to authenticated System Administrators.
                </p>
              </div>
            </div>
            
            <a
              href="http://localhost:8080/h2-console"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs transition-all shadow-lg flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Open Protected H2 Console
            </a>
          </div>

          {/* Credentials & Connection Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Dedicated Database Admin Credentials Card */}
            <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-amber-400" />
                  Dedicated Database Admin Credentials
                </h3>
                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5" /> Active &amp; Isolated
                </span>
              </div>

              <div className="space-y-3">
                {/* Username */}
                <div className="p-3 bg-slate-900/80 rounded-2xl border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">Database User (Admin)</span>
                    <span className="font-mono text-xs text-white font-bold">{dbCredentials.username}</span>
                  </div>
                  <button
                    onClick={() => handleCopy('user', dbCredentials.username)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 transition-colors"
                    title="Copy Username"
                  >
                    {copiedKey === 'user' ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>

                {/* Password */}
                <div className="p-3 bg-slate-900/80 rounded-2xl border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">Admin Password</span>
                    <span className="font-mono text-xs text-amber-300 font-bold">
                      {showPassword ? dbCredentials.password : '••••••••••••••••••••••••••••'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 transition-colors"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => handleCopy('pass', dbCredentials.password)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 transition-colors"
                      title="Copy Password"
                    >
                      {copiedKey === 'pass' ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* JDBC URL */}
                <div className="p-3 bg-slate-900/80 rounded-2xl border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">JDBC URL (PostgreSQL Mode)</span>
                    <span className="font-mono text-xs text-slate-300">{dbCredentials.jdbcUrl}</span>
                  </div>
                  <button
                    onClick={() => handleCopy('url', dbCredentials.jdbcUrl)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 transition-colors"
                    title="Copy JDBC URL"
                  >
                    {copiedKey === 'url' ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>

                {/* Driver */}
                <div className="p-3 bg-slate-900/80 rounded-2xl border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">Driver Class</span>
                    <span className="font-mono text-xs text-slate-300">{dbCredentials.driver}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                    H2 v2.2+ Engine
                  </span>
                </div>
              </div>
            </div>

            {/* Database Tables & Schema Overview */}
            <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Server className="h-4 w-4 text-cyan-400" />
                  Database Tables &amp; Record Counters
                </h3>
                <span className="text-[10px] font-mono text-slate-400">6 Registered Tables</span>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {DATABASE_TABLES.map((table) => (
                  <div 
                    key={table.name}
                    onClick={() => {
                      const sql = `SELECT * FROM ${table.name} LIMIT 10;`;
                      setActiveSql(sql);
                      handleExecuteSql(sql);
                    }}
                    className="p-3 bg-slate-900/60 hover:bg-slate-800/80 cursor-pointer rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-white">{table.name}</span>
                        <span className="text-[10px] font-mono text-slate-500">({table.columns})</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{table.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-300 font-mono font-bold text-xs border border-amber-500/20">
                        {table.records} rows
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Interactive SQL Admin Inspection Console */}
          <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Code className="h-4 w-4 text-emerald-400" />
                Live SQL Query &amp; Table Inspector
              </h3>
              
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="text-slate-500 text-[11px]">Quick Queries:</span>
                <button
                  onClick={() => { const sql = 'SELECT * FROM users;'; setActiveSql(sql); handleExecuteSql(sql); }}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 font-mono text-[11px] transition-colors"
                >
                  users
                </button>
                <button
                  onClick={() => { const sql = 'SELECT * FROM startups;'; setActiveSql(sql); handleExecuteSql(sql); }}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 font-mono text-[11px] transition-colors"
                >
                  startups
                </button>
                <button
                  onClick={() => { const sql = 'SELECT * FROM investor_swipes;'; setActiveSql(sql); handleExecuteSql(sql); }}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 font-mono text-[11px] transition-colors"
                >
                  investor_swipes
                </button>
              </div>
            </div>

            {/* SQL Input Box */}
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={activeSql}
                onChange={(e) => setActiveSql(e.target.value)}
                placeholder="e.g. SELECT * FROM users LIMIT 10;"
                className="flex-1 bg-slate-950 border border-white/15 rounded-2xl px-4 py-2.5 font-mono text-xs text-amber-300 focus:outline-none focus:border-amber-500/60"
              />
              <button
                onClick={() => handleExecuteSql()}
                disabled={queryExecuting}
                className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold text-xs transition-all flex items-center gap-2 shadow-lg"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                {queryExecuting ? 'Executing...' : 'Run Query'}
              </button>
            </div>

            {/* Query Results Table */}
            {queryResult && queryResult.length > 0 && (
              <div className="overflow-x-auto border border-white/10 rounded-2xl bg-slate-900/60">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800/80 text-amber-400 font-mono font-semibold uppercase text-[10px] border-b border-white/10">
                    <tr>
                      {Object.keys(queryResult[0]).map((key) => (
                        <th key={key} className="p-3">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300 font-mono text-xs">
                    {queryResult.map((row, i) => (
                      <tr key={i} className="hover:bg-white/5 transition-colors">
                        {Object.values(row).map((val, idx) => (
                          <td key={idx} className="p-3 text-slate-200">
                            {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

      {/* SUB-TAB: Verification Queue */}
      {activeSubTab === 'VERIFICATION' && (
        <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-400" />
            Pending Onboarding &amp; KYC Verification Requests
          </h3>

          <div className="divide-y divide-white/10 border border-white/10 rounded-2xl overflow-hidden bg-slate-900/60">
            {queue.map((item) => (
              <div key={item.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{item.applicantName}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-slate-300">
                      {item.role}
                    </span>
                  </div>
                  <p className="text-slate-400 mt-0.5">{item.companyName} • Document: {item.documentType} ({item.documentNumber})</p>
                  <span className="text-[10px] text-slate-500 block mt-1">Submitted: {item.submittedAt}</span>
                </div>

                <div className="flex items-center gap-2">
                  {item.status === 'PENDING' ? (
                    <>
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs transition-colors"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(item.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/40 font-semibold text-xs transition-colors"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className={`px-3 py-1 rounded-full font-bold text-[11px] ${item.status === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'}`}>
                      {item.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB: Immutable System Audit Logs */}
      {activeSubTab === 'AUDIT_LOGS' && (
        <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <History className="h-4 w-4 text-emerald-400" />
              Immutable System Audit Log History
            </h3>
            <span className="text-[10px] font-mono text-slate-400">PostgreSQL Immutable Append Ledger</span>
          </div>

          <div className="overflow-x-auto border border-white/10 rounded-2xl bg-slate-900/60">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/60 text-slate-400 font-semibold uppercase text-[10px] border-b border-white/10">
                <tr>
                  <th className="p-3">Actor</th>
                  <th className="p-3">Action Type</th>
                  <th className="p-3">Entity</th>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">IP Address</th>
                  <th className="p-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 font-semibold text-white">{log.actorName}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px] border border-emerald-500/30">
                        {log.actionType}
                      </span>
                    </td>
                    <td className="p-3">{log.entityName} ({log.entityId})</td>
                    <td className="p-3 text-slate-400 font-mono">{log.timestamp}</td>
                    <td className="p-3 text-slate-400 font-mono">{log.ipAddress}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedJsonDetails(log.detailsJson)}
                        className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-slate-200 text-[11px] font-semibold transition-colors inline-flex items-center gap-1"
                      >
                        <Code className="h-3 w-3" /> View JSON
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* JSON Viewer Modal */}
      {selectedJsonDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="glass-card w-full max-w-lg rounded-3xl p-6 border border-amber-500/40 shadow-2xl relative">
            <h3 className="text-sm font-bold text-amber-400 mb-3 flex items-center gap-2">
              <Code className="h-4 w-4" /> System Audit Event Change Details
            </h3>
            <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto border border-white/10 max-h-72">
              {JSON.stringify(selectedJsonDetails, null, 2)}
            </pre>
            <button
              onClick={() => setSelectedJsonDetails(null)}
              className="mt-4 w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors"
            >
              Close Viewer
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
