// Generates rich 7-slide Pitch Decks, Elevator Audio Pitches, and AI Diligence Scorecards
export function getEnhancedStartupPitchData(startup) {
  if (!startup) return null;

  const sector = startup.sector || 'AI & Enterprise Tech';
  const stage = startup.stage || 'SEED';
  const name = startup.name || 'Nexus Labs';
  const founder = startup.founder || startup.founderName || 'Founder & CEO';
  const valuation = startup.valuation || '$10,000,000';
  const totalFunding = startup.totalFunding || startup.askAmount || '$2,000,000';
  const arr = startup.arr || '$500,000';
  const mrr = startup.mrr || '$42,000';
  const growth = startup.arrGrowthPct || startup.growth || '+220%';
  const city = startup.city || 'Global Tech Hub';
  const country = startup.country || 'Global';
  const flag = startup.flag || '🌐';

  // Specific bespoke profiles for prominent startups or intelligent derivation
  const isAI = sector.toLowerCase().includes('ai') || sector.toLowerCase().includes('ml');
  const isFintech = sector.toLowerCase().includes('fintech') || sector.toLowerCase().includes('payment');
  const isHealth = sector.toLowerCase().includes('health') || sector.toLowerCase().includes('bio');
  const isCleanTech = sector.toLowerCase().includes('clean') || sector.toLowerCase().includes('mobility') || sector.toLowerCase().includes('ev');
  const isSecurity = sector.toLowerCase().includes('security') || sector.toLowerCase().includes('cyber');

  // 1. Seven High-Impact Pitch Deck Slides
  const slides = [
    {
      id: 1,
      tag: 'Executive Summary',
      title: name,
      subtitle: startup.tagline || 'Pioneering next-generation infrastructure for the autonomous enterprise era.',
      slideType: 'COVER',
      stats: [
        { label: 'Target Ask', value: totalFunding, color: 'text-emerald-400' },
        { label: 'Valuation Cap', value: valuation, color: 'text-cyan-400' },
        { label: 'Current ARR', value: arr, color: 'text-amber-400' },
        { label: 'YoY Velocity', value: growth, color: 'text-purple-400' },
      ],
      bulletPoints: [
        `HQ: ${city}, ${country} ${flag} • Global Cross-Border Distribution Ready`,
        `Leadership: Founded by ${founder} with deep domain expertise`,
        `Round Status: ${stage} Round actively syndicate-backed • 65% Committed`,
      ],
      aiMoatTakeaway: 'Strong market timing with clear proprietary advantage and rapid customer adoption trajectory.',
    },
    {
      id: 2,
      tag: 'The Urgent Problem',
      title: isAI 
        ? 'High Inference Latency & Astronomical Compute Token Costs'
        : isFintech 
        ? 'Legacy Settlement Friction & High Payment Gateway Interchange'
        : isHealth 
        ? 'Severe Diagnostic Backlogs & Burdensome Clinical EHR Documentation'
        : isCleanTech
        ? 'Grid Fleet Congestion & High Battery Degradation Downtime'
        : 'Fragmented Cloud Infrastructure & Escalating Security Vulnerabilities',
      subtitle: 'Enterprises are bleeding operational margins on archaic architectures built over a decade ago.',
      slideType: 'PROBLEM',
      painPoints: [
        { icon: '⚠️', title: 'Operational Inefficiency', desc: 'Over 68% of enterprise tech spend is lost to redundant processing bottlenecks.' },
        { icon: '💸', title: 'Prohibitive Unit Economics', desc: 'Existing vendor monopolies charge 4x-10x markup on raw throughput capacity.' },
        { icon: '🔒', title: 'Data Sovereignty Concerns', desc: 'Strict regulatory frameworks (GDPR, DPDP, HIPAA) prohibit unvetted multi-tenant relays.' }
      ],
      bulletPoints: [
        'Total Addressable Enterprise Waste exceeds $45B annually in current legacy workflows.',
        'Incumbent tools require 6-12 month procurement and complex on-premise integration.',
        'Customer satisfaction scores across existing market solutions average below 34 NPS.'
      ],
      aiMoatTakeaway: 'The customer pain point is hair-on-fire urgent, demonstrated by willingness to deploy pilot budgets immediately.',
    },
    {
      id: 3,
      tag: 'Proprietary Solution & IP Moat',
      title: `The ${name} Architecture & Technological Advantage`,
      subtitle: 'A single unified platform offering 10x performance gains at a fraction of incumbent cost.',
      slideType: 'SOLUTION',
      architecturePoints: [
        { title: 'Sub-millisecond Latency', desc: 'Kernel-level acceleration pipeline with zero serialization overhead.', metric: '< 8ms' },
        { title: 'Proprietary IP & Caching', desc: 'Patent-pending vectorized memory algorithms reducing compute burn by 62%.', metric: '62% Savings' },
        { title: 'Enterprise Isolation', desc: 'Zero-knowledge cryptographic boundaries certified for SOC2 Type II & ISO27001.', metric: '100% Compliant' },
        { title: 'Instant Drop-In SDK', desc: 'Developers integrate in under 15 minutes with single-line configuration.', metric: '15 Min Deploy' },
      ],
      bulletPoints: [
        'Protected by 2 provisional utility patents and proprietary algorithmic weights.',
        '3.2x faster deployment cycle compared to legacy enterprise alternatives.',
        'Self-healing high availability architecture with 99.999% SLA uptime guarantee.'
      ],
      aiMoatTakeaway: 'Defensibility stems from deep technical IP and switching costs once integrated into core client pipelines.',
    },
    {
      id: 4,
      tag: 'Market Size & Expansion Horizon',
      title: 'Target Market Opportunity (TAM / SAM / SOM)',
      subtitle: 'Capturing explosive secular tailwinds across international high-growth regions.',
      slideType: 'MARKET',
      marketSizing: [
        { level: 'TAM (Total Addressable)', size: '$128.4 Billion', desc: 'Global enterprise software market for specialized infrastructure by 2030 (CAGR 28.4%).' },
        { level: 'SAM (Serviceable Addressable)', size: '$24.6 Billion', desc: 'Mid-to-Large Tier 1 enterprises adopting modern cloud & AI telemetry solutions.' },
        { level: 'SOM (Immediate Obtainable)', size: '$1.85 Billion', desc: 'High-velocity international cross-border corridors in US, EU, and Asia-Pacific.' }
      ],
      bulletPoints: [
        'Market expanding at 31.8% compound annual growth rate over the next 5 years.',
        'Zero platform lock-in allows seamless inbound developer viral adoption.',
        'Strategic channel partnerships initiated with Tier-1 cloud providers and accelerators.'
      ],
      aiMoatTakeaway: 'Massive runway allows this company to reach $100M+ ARR without hitting market saturation limits.',
    },
    {
      id: 5,
      tag: 'Traction & Financial Unit Economics',
      title: 'Hyper-Growth Metrics & Best-in-Class Capital Efficiency',
      subtitle: `Consistent month-over-month ARR velocity with healthy net revenue retention.`,
      slideType: 'TRACTION',
      unitEconomics: [
        { label: 'Annual Recurring Revenue', value: arr, highlight: true },
        { label: 'Monthly Recurring Revenue', value: mrr, highlight: false },
        { label: 'YoY Growth Rate', value: growth, highlight: true },
        { label: 'Net Revenue Retention', value: '142%', highlight: false },
        { label: 'Gross Margins', value: '84.2%', highlight: false },
        { label: 'CAC Payback Period', value: '4.8 Months', highlight: false },
        { label: 'LTV to CAC Ratio', value: '6.8x', highlight: true },
        { label: 'Monthly Cash Burn', value: '$22,500', highlight: false },
      ],
      bulletPoints: [
        'Top decile SaaS unit economics: LTV:CAC of 6.8x with under 5 month payback.',
        'Net negative churn driven by automatic tier expansion as client transaction volume scales.',
        'Pipeline of 28 enterprise pilots currently in advanced proof-of-concept stages.'
      ],
      aiMoatTakeaway: 'Rare capital efficiency profile; startup generates high leverage on every dollar deployed into growth.',
    },
    {
      id: 6,
      tag: 'Leadership Team & Cap Table',
      title: 'World-Class Founders & Strategic Investors',
      subtitle: 'Repeat operators, research scientists, and tier-1 ecosystem backing.',
      slideType: 'TEAM',
      teamMembers: [
        { name: founder, role: 'Co-Founder & CEO', bio: 'Ex-BigTech Infrastructure Lead, 2x founder with previous successful exit in distributed systems.' },
        { name: 'Dr. Elena Rostova', role: 'Co-Founder & Chief Scientist', bio: 'PhD in Applied Machine Learning, 14 published papers in top-tier peer-reviewed conferences.' },
        { name: 'Marcus Chen', role: 'VP of Global Growth', bio: 'Scaled previous venture from $1M to $35M ARR across North America and APAC.' },
      ],
      capTableSummary: [
        { party: 'Founding Team & Pool', share: '56.0%', badge: 'Common Stock' },
        { party: 'Seed Syndicate & Angels', share: '24.0%', badge: 'Preferred Seed' },
        { party: 'Employee Option Pool (ESOP)', share: '12.0%', badge: 'Unallocated' },
        { party: 'Open Series Round Allocation', share: '8.0%', badge: 'This Round' },
      ],
      aiMoatTakeaway: 'Founder-market fit is top 5%. The technical co-founder combination provides unbeatable execution speed.',
    },
    {
      id: 7,
      tag: 'The Investment Ask & Milestones',
      title: `Raising ${totalFunding} to Accelerate Global Scale`,
      subtitle: '18-month strategic plan to achieve $5M+ ARR and Series A/B market leadership.',
      slideType: 'ASK',
      useOfFunds: [
        { category: 'Engineering & R&D Talent', percent: 50, amount: 'Expanding core systems & compiler team' },
        { category: 'Enterprise Go-to-Market', percent: 30, amount: 'Sales engineering & international hub distribution' },
        { category: 'Compute & Cloud Infrastructure', percent: 12, amount: 'GPU cluster reservations & high-availability nodes' },
        { category: 'Legal & Regulatory Compliance', percent: 8, amount: 'Multi-jurisdictional licensing & data patents' },
      ],
      milestones: [
        'Q1: Expand developer ecosystem to 5,000+ active enterprise instances.',
        'Q2: Close 12 Tier-1 annual enterprise contracts ($100k+ ACV each).',
        'Q3: Launch cross-border automated mesh relay nodes in Europe & Asia.',
        'Q4: Reach $3.5M ARR run-rate and prepare for $20M+ growth round.'
      ],
      aiMoatTakeaway: 'Clear capital allocation discipline with direct line of sight to key inflection milestones.',
    }
  ];

  // 2. Interactive Founder Elevator Audio Pitch Script & Audio Simulation
  const elevatorPitch = {
    founderName: founder,
    founderAvatar: startup.logoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    durationSeconds: 60,
    audioWaveform: [35, 55, 75, 40, 60, 90, 85, 45, 70, 95, 65, 50, 80, 100, 70, 60, 85, 40, 65, 80, 95, 75, 50, 60, 45, 85, 70, 90, 65, 40],
    chapters: [
      { timestamp: '0:00', title: 'The Hook', text: `Hi, I'm ${founder}, founder of ${name}. Over the past 3 years, enterprise systems have been crushed under spiraling throughput costs.` },
      { timestamp: '0:18', title: 'The Breakthrough', text: `We engineered a groundbreaking solution from the ground up that delivers 10x performance improvements while cutting operational spend by over 60%.` },
      { timestamp: '0:38', title: 'Market Proof', text: `Our traction speaks for itself: We're already clocking ${arr} in ARR growing ${growth} year-over-year with a remarkable 6.8x LTV to CAC ratio.` },
      { timestamp: '0:50', title: 'The Ask', text: `We are raising ${totalFunding} at a ${valuation} valuation cap to accelerate our global sales push. We'd love to partner with you.` },
    ]
  };

  // 3. AI Diligence Scorecard & Investment Thesis
  const aiScore = Math.floor(Math.random() * 8) + 91; // 91 - 98
  const aiEvaluation = {
    overallScore: aiScore,
    verdict: aiScore >= 94 ? 'Strong Buy • High Conviction' : 'Favorable • Proceed to Partner Review',
    moatGrade: 'A+ (Proprietary IP & High Switching Costs)',
    burnEfficiency: 'Excellent (4.8 Month CAC Payback)',
    growthVelocity: growth,
    highlights: [
      `Exceptional ARR growth of ${growth} with strong customer retention (142% NRR).`,
      `Gross margins exceed 84%, providing significant cash flow resilience at scale.`,
      `Founder ${founder} demonstrates proven execution capability with deep industry patents.`
    ],
    risks: [
      `Rapid hiring of senior engineering talent required to service ballooning pilot pipeline.`,
      `Potential enterprise sales cycle lengthening in uncertain macroeconomic environments.`
    ],
    comparableMultiples: [
      { peer: 'Pinecone / Vector Cloud', multiple: '26x ARR', stage: 'Series B' },
      { peer: 'Databricks ML Core', multiple: '22x ARR', stage: 'Late Stage' },
      { peer: 'Stripe Billing Rails', multiple: '18x ARR', stage: 'Unicorn' }
    ],
    suggestedPartnerQuestions: [
      'What percentage of new ARR is driven by organic developer inbound vs direct outbound sales?',
      'Can you walk through the technical architecture benchmarks against open-source alternatives?',
      'How does the pricing tier model scale as enterprise clients 10x their query throughput?'
    ]
  };

  // 4. Term Sheet Configuration
  const termSheet = {
    startupName: name,
    founderName: founder,
    targetAmount: totalFunding,
    valuationCap: valuation,
    securityType: 'SAFE (Simple Agreement for Future Equity) with MFN Rights',
    discountRate: '20%',
    proRataRights: 'Granted to Major Investors ($250k+ commitment)',
    boardSeat: '1 Board Observer Seat granted to Lead Syndicate',
    informationRights: 'Quarterly financial reports & monthly investor KPI memos',
    expirationDate: '14 Days from issuance'
  };

  return {
    slides,
    elevatorPitch,
    aiEvaluation,
    termSheet
  };
}
