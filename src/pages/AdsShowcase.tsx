import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Zap,
  TrendingUp,
  Sliders,
  Activity,
  Database,
  CheckCircle2,
  Play,
  Layers,
  Cpu,
  BarChart3,
  Terminal,
  Lock,
  Globe,
  Server,
  ArrowUpRight,
  Filter,
  Check,
  Code2
} from 'lucide-react';
import { Ads3DScene } from '../components/Ads3DScene';
import { trackEvent } from '../lib/analytics';

interface CaseStudy {
  id: string;
  client: string;
  category: string;
  title: string;
  highlight: string;
  platform: 'google' | 'meta' | 'both';
  tags: string[];
  metrics: { label: string; value: string; change: string }[];
  problem: string;
  solution: string;
  techStack: string[];
  codeSample: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'cnb-floodlight',
    client: 'City National Bank & Wealth',
    category: 'Enterprise Banking • SA360',
    title: 'Server-Side Floodlight Architecture with Real-Time Loan Funding Ingestion',
    highlight: '+46% Verified Conversions Attributed • -31% Blended Cost-per-Acquisition',
    platform: 'google',
    tags: ['Google SA360', 'Floodlight API', 'Server GTM', 'GCP Cloud Run', 'SOC2 / HIPAA'],
    metrics: [
      { label: 'Attributed Conversion Volume', value: '+46.4%', change: 'vs client-side tag' },
      { label: 'Blended Cost Per Funded Loan', value: '-31.2%', change: 'improved efficiency' },
      { label: 'First-Party Cookie Retention', value: '180 Days', change: 'bypassed Safari ITP' }
    ],
    problem:
      'Safari ITP 7-day cookie caps and Safari 17.0 stripped gclid parameters, blinding Google Search & SA360 bidding engines on high-value 45-day commercial loan cycles. Over 42% of funded loans appeared as "Direct/Unattributed".',
    solution:
      'Engineered an enterprise Server-Side Google Tag Manager cluster on GCP Cloud Run. Implemented first-party HTTP-only cookie emission (_gcl_aw) combined with asynchronous offline conversion upload via the Google Search Ads 360 REST API with multi-touch hashed customer match IDs.',
    techStack: ['GCP Cloud Run', 'Server-Side GTM', 'SA360 REST API', 'Google Cloud Pub/Sub', 'BigQuery'],
    codeSample: `// Server-side SA360 Floodlight Conversion Dispatch
const payload = {
  conversion: [{
    floodlightActivityId: "FL_COMMERCIAL_LOAN_FUNDED",
    clickId: session.gclid, // Captured from first-party HTTP cookie
    conversionTimestampMicros: Date.now() * 1000,
    revenueValue: loanAmountUSD,
    currencyCode: "USD",
    userIdentifiers: [
      { hashedEmail: sha256(applicant.email.toLowerCase().trim()) },
      { hashedPhoneNumber: sha256(normalizeE164(applicant.phone)) }
    ]
  }]
};
await fetch('https://searchads360.googleapis.com/v1/customers/...', {
  method: 'POST',
  headers: { 'Authorization': \`Bearer \${sa360Token}\` },
  body: JSON.stringify(payload)
});`
  },
  {
    id: 'luxe-meta-capi',
    client: 'AURA Atelier London',
    category: 'High-Growth D2C • Meta CAPI',
    title: 'Meta Conversions API (CAPI) 9.2 EMQ Scale Engine with Automated Deduplication',
    highlight: '9.2 / 10 Event Match Quality • +58% Catalog ROAS • $4.2M Seasonal Revenue',
    platform: 'meta',
    tags: ['Meta CAPI', 'Advantage+ Shopping', 'Event Match Quality', 'Shopify Plus', 'SHA-256'],
    metrics: [
      { label: 'Event Match Quality (EMQ)', value: '9.2 / 10', change: 'Meta Verified Top 5%' },
      { label: 'Advantage+ Catalog ROAS', value: '4.85x', change: '+58% QoQ lift' },
      { label: 'Server Deduplication Accuracy', value: '100.0%', change: 'zero double-counting' }
    ],
    problem:
      'Post-iOS 14.5 app tracking transparency crippled Meta pixel match quality down to 3.8/10. Ad sets entered perpetual learning phases, and high-frequency creative fatigue drove CAC up by 64% in international markets.',
    solution:
      'Built custom webhook-driven Server CAPI infrastructure piping Shopify checkout webhooks directly into the Meta Graph API v20.0. Ingested 9 distinct customer matching parameters (fn, ln, em, ph, ct, st, zp, fbp, fbc) with rigorous client/server event deduplication via unique event_id tokens.',
    techStack: ['Meta Graph API v20', 'AWS Lambda', 'Shopify Webhooks', 'Cloudflare Workers', 'Redis Cache'],
    codeSample: `// Meta Conversions API (CAPI) Dual-Channel Ingestion
const eventData = {
  data: [{
    event_name: 'Purchase',
    event_time: Math.floor(Date.now() / 1000),
    event_id: order.id, // Exact match with browser fbq('track', 'Purchase', {}, {eventID})
    action_source: 'website',
    user_data: {
      em: [sha256(order.email)],
      ph: [sha256(order.phone)],
      fbp: cookieStore.get('_fbp'),
      fbc: cookieStore.get('_fbc') || generateFbc(order.fbclid),
      client_ip_address: req.ip,
      client_user_agent: req.headers['user-agent']
    },
    custom_data: {
      currency: 'USD',
      value: order.totalPrice,
      content_type: 'product'
    }
  }]
};`
  },
  {
    id: 'b2b-offline-conversion',
    client: 'StrataGrid Cloud Enterprise',
    category: 'B2B SaaS • Offline Closed-Loop',
    title: 'Hubspot-to-Google Offline Conversion Pipeline for High-ACV Pipeline Valuation',
    highlight: '+72% Qualified Sales Pipeline • -44% Junk MQL Ad Spend Wasted',
    platform: 'google',
    tags: ['Google Search', 'Offline Conversion Import', 'HubSpot CRM API', 'tROAS Value Bidding'],
    metrics: [
      { label: 'SQL Pipeline Volume', value: '+72.3%', change: 'high-intent enterprise' },
      { label: 'Wasted Spend on Low-Intent', value: '-44.0%', change: 'filtered spam leads' },
      { label: 'Smart Bidding Conversion Rate', value: '18.4%', change: '+6.2pp vs baseline' }
    ],
    problem:
      'Google Smart Bidding (Maximize Conversions) was optimizing for hundreds of student and hobbyist form submissions rather than enterprise decision-makers. Cost-per-MQL was low, but Cost-per-Closed-Deal was skyrocketing.',
    solution:
      'Transitioned the Google Ads bidding strategy from Max Conversions to Value-Based Smart Bidding (Target ROAS). Automated an hourly synchronization worker that ingests CRM Opportunity Stage Changes (Discovery -> Demo Completed -> Closed Won) back into Google Ads with calibrated deal valuation scores.',
    techStack: ['Hubspot Webhooks', 'Google Ads REST API v17', 'Node.js Microservice', 'PostgreSQL'],
    codeSample: `// Google Ads Offline Conversion Import (OCI) Worker
async function uploadCrmMilestoneToGoogle(lead) {
  const milestoneValue = lead.stage === 'CLOSED_WON' ? lead.contractValue : 1250;
  return await googleAdsClient.conversionUploads.uploadClickConversions({
    customerId: process.env.GOOGLE_ADS_CUSTOMER_ID,
    conversions: [{
      conversionAction: 'customers/123/conversionActions/SQL_QUALIFIED',
      gclid: lead.gclid,
      conversionDateTime: formatGoogleDateTime(lead.stageChangedAt),
      conversionValue: milestoneValue,
      currencyCode: 'USD'
    }],
    partialFailure: true
  });
}`
  },
  {
    id: 'pmax-cannibalization-guard',
    client: 'OmniVeloce Logistics & Mobility',
    category: 'Global E-Commerce • PMax Guardrails',
    title: 'Performance Max Algorithmic Governance & Brand Cannibalization Protection',
    highlight: '4.8x Blended ROAS • +34% Net-New Customer Acquisition Across 12 Countries',
    platform: 'both',
    tags: ['Google PMax', 'Brand Exclusions', 'New Customer Acquisition', 'Meta Retargeting Sync'],
    metrics: [
      { label: 'Blended Omnichannel ROAS', value: '4.82x', change: 'across $380k/mo spend' },
      { label: 'Net-New Customer Share', value: '68.5%', change: '+34% incremental lift' },
      { label: 'Brand Keyword Cost Savings', value: '$28.4k', change: 'monthly budget reclaimed' }
    ],
    problem:
      'Google Performance Max was taking credit for organic brand queries, inflating vanity ROAS while real incremental sales remained stagnant. Simultaneously, Meta retargeting ads were bombarding users who had already converted via Google.',
    solution:
      'Instituted strict brand negative lists in PMax, configured Google New Customer Acquisition value rules (+40% bid modifier on first-time buyers), and created a cross-platform exclusion webhook sync that automatically suppresses recent Google converters from Meta campaigns within 180 seconds of checkout.',
    techStack: ['Google Ads Scripts', 'PMax Asset Group API', 'Meta Custom Audiences API', 'AWS DynamoDB'],
    codeSample: `// Cross-Platform Real-Time Exclusion Sync
app.post('/webhooks/order-paid', async (req) => {
  const { email, phone, timestamp } = req.body;
  
  // Instantly push to Meta Exclusion Custom Audience to prevent wasted retargeting spend
  await metaAudienceClient.addUsers({
    audienceId: process.env.META_RECENT_CONVERTERS_AUDIENCE_ID,
    schema: ['EMAIL_SHA256', 'PHONE_SHA256'],
    data: [[sha256(email), sha256(phone)]]
  });
  
  console.log(\`[Excluded] User suppressed from Meta ad delivery within 3s of Google conversion\`);
});`
  }
];

export default function AdsShowcase() {
  const [platformFilter, setPlatformFilter] = useState<'all' | 'google' | 'meta'>('all');
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simLog, setSimLog] = useState<string | null>(null);

  // Live ROAS & Signal Loss Recovery Calculator State
  const [monthlySpend, setMonthlySpend] = useState<number>(45000);
  const [targetRoas, setTargetRoas] = useState<number>(3.2);
  const [signalLossPct, setSignalLossPct] = useState<number>(32);

  // Filtered case studies
  const filteredCases = useMemo(() => {
    if (platformFilter === 'all') return CASE_STUDIES;
    return CASE_STUDIES.filter(c => c.platform === platformFilter || c.platform === 'both');
  }, [platformFilter]);

  const activeCase = filteredCases[activeCaseIndex] || filteredCases[0];

  // Calculated Real-Time Simulator Outputs
  const currentAttributedRevenue = monthlySpend * targetRoas;
  const lostRevenueVolume = currentAttributedRevenue * (signalLossPct / 100);
  const recoveredRevenuePotential = lostRevenueVolume * 0.78; // 78% average recovery via CAPI + Enhanced Conversions
  const recoveredRoasProjected = (currentAttributedRevenue + recoveredRevenuePotential) / monthlySpend;
  const annualGains = recoveredRevenuePotential * 12;

  const handleNextCase = () => {
    setActiveCaseIndex((prev) => (prev + 1) % filteredCases.length);
  };

  const handlePrevCase = () => {
    setActiveCaseIndex((prev) => (prev - 1 + filteredCases.length) % filteredCases.length);
  };

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setSimLog('DISPATCHING TELEMETRY: Simulating live high-value checkout across Google & Meta...');

    setTimeout(() => {
      setSimLog('CAPTURING SIGNALS: gclid, fbclid, hashed PII (SHA-256) captured in First-Party Cookie context...');
    }, 600);

    setTimeout(() => {
      setSimLog('PARALLEL INGESTION: Server GTM -> Google Ads API (200 OK) • Meta CAPI Graph API (200 OK, EMQ 9.2)...');
    }, 1300);

    setTimeout(() => {
      setSimLog('SMART BIDDING RE-WEIGHTED: Algorithm received full revenue value within 420ms. Learning phase intact.');
      setTimeout(() => {
        setIsSimulating(false);
        setTimeout(() => setSimLog(null), 3500);
      }, 1500);
    }, 2000);

    trackEvent({ action: 'simulate_signal_burst', category: 'Lineout Showcase', label: 'Ad Tech Simulator' });
  };

  return (
    <div className="relative min-h-screen bg-[#030712] text-white selection:bg-brand-blue selection:text-white overflow-hidden">
      {/* 1. Full-Screen Interactive WebGL Canvas */}
      <div className="fixed inset-0 pointer-events-auto z-0 opacity-80">
        <Ads3DScene />
      </div>

      {/* Atmospheric Vignette Gradients */}
      <div className="fixed inset-0 bg-radial-gradient pointer-events-none z-0 opacity-60" />
      <div className="fixed inset-x-0 top-0 h-40 bg-gradient-to-b from-[#030712] to-transparent pointer-events-none z-0" />
      <div className="fixed inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#030712] to-transparent pointer-events-none z-0" />

      {/* Foreground Content Container */}
      <div className="relative z-10 pt-28 pb-28 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto space-y-28">
        {/* Top Minimal Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.location.hash = '';
            }}
            className="group inline-flex items-center gap-2 text-xs font-mono tracking-widest text-text-secondary hover:text-white uppercase transition-colors"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>[ RETURN TO HOME ]</span>
          </a>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-text-secondary">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
              INTERACTIVE 3D WEBGL SHADER ACTIVE
            </span>
            <span className="hidden sm:inline-block text-[11px] font-mono text-brand-blue uppercase tracking-widest">
              AGY // ADS ARCHITECTURE
            </span>
          </div>
        </div>

        {/* 2. Hero Section: Massive Lineout-Style Typography & Statement */}
        <div className="space-y-8 max-w-5xl">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-brand-blue/10 border border-brand-blue/30 text-brand-blue text-xs font-mono tracking-wider uppercase">
            <Sparkles size={14} className="animate-spin-slow" />
            <span>Performance Marketing & Signal Architecture</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-8xl font-display font-extrabold tracking-tight leading-[1.02]">
            WE ENGINEER AD SIGNALS FOR{' '}
            <span className="italic font-serif font-light text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-cyan-400 to-brand-purple">
              RADICAL ATTRIBUTION.
            </span>
          </h1>

          <p className="text-lg sm:text-2xl text-text-secondary font-light max-w-3xl leading-relaxed">
            Media, machine learning, and ad algorithms have evolved. Traditional pixel tagging has collapsed under Safari ITP, iOS 14.5+, and cookie degradation.
            I architect <strong className="text-white font-medium">server-side Google SA360 & Meta CAPI pipelines</strong> that restore complete data clarity and supercharge smart bidding ROAS.
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-display font-bold text-white">$14.2M+</div>
              <div className="text-xs font-mono text-text-secondary mt-1">Managed Ad Spend</div>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-display font-bold text-brand-blue">9.2 / 10</div>
              <div className="text-xs font-mono text-text-secondary mt-1">Meta CAPI EMQ Avg</div>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-display font-bold text-cyan-400">180-Day</div>
              <div className="text-xs font-mono text-text-secondary mt-1">First-Party Cookie Life</div>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-display font-bold text-brand-green">+54.6%</div>
              <div className="text-xs font-mono text-text-secondary mt-1">Average ROAS Uplift</div>
            </div>
          </div>

          {/* Interaction Tip */}
          <div className="flex items-center gap-2 text-xs font-mono text-text-secondary/70 pt-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Move or drag your cursor anywhere on screen to distort the live WebGL attribution mesh.</span>
          </div>
        </div>

        {/* 3. Interactive Case Study Reel (Signature Lineout Horizontal Feature) */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-brand-blue mb-2">
                [ FLAGSHIP CASE STUDIES ]
              </div>
              <h2 className="text-3xl sm:text-5xl font-display font-bold tracking-tight">
                PROVEN ENTERPRISE <span className="text-gradient">OUTCOMES</span>
              </h2>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  setPlatformFilter('all');
                  setActiveCaseIndex(0);
                }}
                className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
                  platformFilter === 'all'
                    ? 'bg-white text-black font-semibold shadow-lg shadow-white/10'
                    : 'bg-white/5 text-text-secondary hover:text-white border border-white/10'
                }`}
              >
                All Platforms ({CASE_STUDIES.length})
              </button>
              <button
                onClick={() => {
                  setPlatformFilter('google');
                  setActiveCaseIndex(0);
                }}
                className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
                  platformFilter === 'google'
                    ? 'bg-brand-blue text-white font-semibold shadow-lg shadow-brand-blue/20'
                    : 'bg-white/5 text-text-secondary hover:text-white border border-white/10'
                }`}
              >
                Google Ads & SA360
              </button>
              <button
                onClick={() => {
                  setPlatformFilter('meta');
                  setActiveCaseIndex(0);
                }}
                className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
                  platformFilter === 'meta'
                    ? 'bg-brand-purple text-white font-semibold shadow-lg shadow-brand-purple/20'
                    : 'bg-white/5 text-text-secondary hover:text-white border border-white/10'
                }`}
              >
                Meta Ads & CAPI
              </button>
            </div>
          </div>

          {/* Active Case Study Spotlight Card */}
          <div className="relative rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl p-6 sm:p-10 lg:p-12 overflow-hidden shadow-2xl">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-purple/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-8">
              {/* Header Meta */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-mono text-cyan-300">
                    {activeCase.category}
                  </span>
                  <span className="text-sm font-mono text-text-secondary">
                    Client: <strong className="text-white">{activeCase.client}</strong>
                  </span>
                </div>

                {/* Slider Controls */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-text-secondary mr-2">
                    {activeCaseIndex + 1} / {filteredCases.length}
                  </span>
                  <button
                    onClick={handlePrevCase}
                    aria-label="Previous Case Study"
                    className="p-2.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white transition-colors cursor-pointer"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={handleNextCase}
                    aria-label="Next Case Study"
                    className="p-2.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white transition-colors cursor-pointer"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              {/* Title & Key Highlight */}
              <div className="space-y-3">
                <h3 className="text-2xl sm:text-4xl font-display font-bold text-white leading-tight">
                  {activeCase.title}
                </h3>
                <div className="inline-block px-4 py-1.5 rounded-lg bg-brand-green/10 border border-brand-green/30 text-brand-green font-mono text-sm sm:text-base font-medium">
                  {activeCase.highlight}
                </div>
              </div>

              {/* Verified Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {activeCase.metrics.map((metric, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/[0.04] border border-white/10">
                    <div className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                      {metric.value}
                    </div>
                    <div className="text-xs font-mono text-text-secondary mt-1">{metric.label}</div>
                    <div className="text-[11px] font-mono text-cyan-400 mt-0.5">{metric.change}</div>
                  </div>
                ))}
              </div>

              {/* Problem & Solution Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="p-5 rounded-xl bg-red-950/20 border border-red-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-red-400 text-xs font-mono uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    The Signal Breakdown
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">{activeCase.problem}</p>
                </div>

                <div className="p-5 rounded-xl bg-brand-blue/10 border border-brand-blue/30 space-y-2">
                  <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    Architectural Remedy
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">{activeCase.solution}</p>
                </div>
              </div>

              {/* Tags & Action Row */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
                <div className="flex flex-wrap gap-2">
                  {activeCase.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-mono text-text-secondary"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowCodeModal(!showCodeModal)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-mono text-white transition-all cursor-pointer"
                  >
                    <Code2 size={14} />
                    <span>{showCodeModal ? 'Hide Ingestion Code' : 'Inspect Code Payload'}</span>
                  </button>
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-blue hover:bg-brand-blue/90 text-xs font-mono text-white font-medium transition-all"
                  >
                    <span>Deploy Architecture</span>
                    <ArrowRight size={14} />
                  </a>
                </div>
              </div>

              {/* Expandable Code Snippet Drawer */}
              <AnimatePresence>
                {showCodeModal && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden pt-4"
                  >
                    <div className="p-5 rounded-xl bg-black/80 border border-brand-blue/40 font-mono text-xs text-cyan-200 overflow-x-auto space-y-3">
                      <div className="flex items-center justify-between text-[11px] text-text-secondary border-b border-white/10 pb-2">
                        <span className="flex items-center gap-2 text-brand-blue">
                          <Terminal size={14} /> Production Payload: {activeCase.client}
                        </span>
                        <span>TypeScript / Node.js</span>
                      </div>
                      <pre className="text-xs leading-relaxed whitespace-pre font-mono">
                        {activeCase.codeSample}
                      </pre>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* 4. Interactive Live ROAS & Signal Loss Recovery Engine (Simulator) */}
        <section className="space-y-8">
          <div className="border-b border-white/10 pb-6">
            <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">
              [ REAL-TIME VALUE CALCULATOR ]
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-bold tracking-tight">
              INTERACTIVE SIGNAL LOSS & <span className="text-gradient">ROAS RECOVERY</span> SIMULATOR
            </h2>
            <p className="text-text-secondary text-base sm:text-lg max-w-3xl mt-3 font-light">
              See what happens to your advertising efficiency when server-side conversion ingestion and first-party identity resolution are plugged into your Google and Meta ad accounts.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Input Sliders (7 Cols) */}
            <div className="lg:col-span-7 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl p-6 sm:p-8 space-y-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2 text-sm font-mono text-white">
                  <Sliders size={16} className="text-brand-blue" />
                  <span>Configure Your Advertising Parameters</span>
                </div>
                <span className="text-xs font-mono text-text-secondary">Interactive Sliders</span>
              </div>

              {/* Slider 1: Monthly Media Spend */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-mono">
                  <span className="text-text-secondary">Monthly Ad Spend (Google + Meta):</span>
                  <span className="text-xl font-bold text-white font-display">
                    ${monthlySpend.toLocaleString()} / mo
                  </span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="300000"
                  step="5000"
                  value={monthlySpend}
                  onChange={(e) => setMonthlySpend(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-blue"
                />
                <div className="flex justify-between text-[11px] font-mono text-text-secondary">
                  <span>$10,000</span>
                  <span>$150,000</span>
                  <span>$300,000+</span>
                </div>
              </div>

              {/* Slider 2: Target ROAS */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-mono">
                  <span className="text-text-secondary">Current Blended ROAS:</span>
                  <span className="text-xl font-bold text-cyan-400 font-display">
                    {targetRoas.toFixed(1)}x ROAS
                  </span>
                </div>
                <input
                  type="range"
                  min="1.5"
                  max="6.0"
                  step="0.1"
                  value={targetRoas}
                  onChange={(e) => setTargetRoas(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[11px] font-mono text-text-secondary">
                  <span>1.5x (Break-even)</span>
                  <span>3.5x (Healthy)</span>
                  <span>6.0x (Elite)</span>
                </div>
              </div>

              {/* Slider 3: Signal Loss Estimate */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-mono">
                  <span className="text-text-secondary">Estimated Signal Blindness (iOS / Ad Blockers):</span>
                  <span className="text-xl font-bold text-red-400 font-display">
                    {signalLossPct}% Lost Signals
                  </span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="50"
                  step="1"
                  value={signalLossPct}
                  onChange={(e) => setSignalLossPct(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-red-400"
                />
                <div className="flex justify-between text-[11px] font-mono text-text-secondary">
                  <span>15% (Low impact)</span>
                  <span>30% (Standard Safari / iOS)</span>
                  <span>50% (High Tech / B2B)</span>
                </div>
              </div>

              {/* Interactive Telemetry Trigger Button */}
              <div className="pt-4 border-t border-white/10">
                <button
                  onClick={handleRunSimulation}
                  disabled={isSimulating}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-brand-blue to-brand-purple hover:opacity-90 disabled:opacity-50 text-white font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-brand-blue/20 transition-all cursor-pointer"
                >
                  <Play size={14} className={isSimulating ? 'animate-spin' : ''} />
                  <span>{isSimulating ? 'Simulating High-Value Conversion Stream...' : 'Simulate Live Server-Side Ingestion Telemetry'}</span>
                </button>

                {simLog && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 rounded-lg bg-black/90 border border-brand-blue/50 text-xs font-mono text-cyan-300"
                  >
                    <span className="text-brand-green mr-2">●</span> {simLog}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Calculated Output Card (5 Cols) */}
            <div className="lg:col-span-5 rounded-2xl bg-gradient-to-b from-brand-blue/15 to-white/[0.02] border border-brand-blue/30 backdrop-blur-xl p-6 sm:p-8 space-y-6">
              <div className="text-xs font-mono uppercase tracking-widest text-cyan-300">
                [ SIMULATION RESULTS ]
              </div>

              <div className="space-y-1">
                <div className="text-xs font-mono text-text-secondary">Monthly Recoverable Attributed Revenue:</div>
                <div className="text-3xl sm:text-5xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-300">
                  +${Math.round(recoveredRevenuePotential).toLocaleString()}
                </div>
                <div className="text-xs font-mono text-text-secondary">
                  Annual Impact: <strong className="text-white">+${Math.round(annualGains).toLocaleString()} / year</strong>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-text-secondary">Blended ROAS Evolution:</span>
                  <span className="text-green-400 font-bold">
                    {targetRoas.toFixed(1)}x → {recoveredRoasProjected.toFixed(2)}x (+{Math.round(((recoveredRoasProjected - targetRoas) / targetRoas) * 100)}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-blue to-green-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (recoveredRoasProjected / 6.0) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Machine Learning Impacts */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 text-xs font-mono text-text-secondary">
                  <CheckCircle2 size={16} className="text-brand-green shrink-0 mt-0.5" />
                  <span><strong>Exit Learning Phase 40% Faster:</strong> Meta and Google smart bidding engines receive 25-35% more confirmed conversion density.</span>
                </div>
                <div className="flex items-start gap-3 text-xs font-mono text-text-secondary">
                  <CheckCircle2 size={16} className="text-brand-green shrink-0 mt-0.5" />
                  <span><strong>Zero Safari 7-Day Amnesia:</strong> First-party HTTP-only cookie parameters retain user attribution across full 90-day purchase funnels.</span>
                </div>
                <div className="flex items-start gap-3 text-xs font-mono text-text-secondary">
                  <CheckCircle2 size={16} className="text-brand-green shrink-0 mt-0.5" />
                  <span><strong>Enhanced Conversion PII Hashing:</strong> Automated SHA-256 normalized phone and email matching with zero privacy exposure.</span>
                </div>
              </div>

              <a
                href="#contact"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-white text-black font-mono text-xs uppercase font-bold tracking-wider hover:bg-white/90 transition-colors"
              >
                <span>Audit My Ad Tracking Signals</span>
                <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </section>

        {/* 5. Direct Architecture Comparison (Client-Side Fragility vs Server-Side Power) */}
        <section className="space-y-8">
          <div className="border-b border-white/10 pb-6">
            <div className="text-xs font-mono uppercase tracking-widest text-brand-purple mb-2">
              [ ARCHITECTURE COMPARISON ]
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-bold tracking-tight">
              CLIENT-SIDE BLINDNESS VS <span className="text-gradient">SERVER-SIDE OMNIPRESENCE</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* The Fragile Past */}
            <div className="rounded-2xl bg-red-950/15 border border-red-500/20 p-6 sm:p-8 space-y-6 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-mono">
                  TRADITIONAL / INSUFFICIENT
                </span>
                <span className="text-xs font-mono text-red-400/80">Browser-Only Tagging</span>
              </div>

              <h3 className="text-xl font-display font-bold text-white">
                Client-Side JavaScript Pixels
              </h3>

              <ul className="space-y-4 text-xs sm:text-sm font-mono text-text-secondary">
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold">✕</span>
                  <span><strong>Ad-Blockers & Brave:</strong> Up to 35% of conversion network requests are silently dropped at the browser level.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold">✕</span>
                  <span><strong>Safari ITP 7-Day Cap:</strong> High-ticket purchase journeys taking longer than 7 days lose all Google Search and Meta campaign attribution.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold">✕</span>
                  <span><strong>Page Load Bloat:</strong> Heavy third-party SDK scripts degrade Core Web Vitals (LCP, INP) and tank landing page conversion rates.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold">✕</span>
                  <span><strong>Degraded Meta EMQ (3.5 - 5.0):</strong> Inability to securely hash and pass phone, email, and external_id without violating user trust.</span>
                </li>
              </ul>
            </div>

            {/* The Resilient Future */}
            <div className="rounded-2xl bg-brand-blue/15 border border-brand-blue/40 p-6 sm:p-8 space-y-6 backdrop-blur-md shadow-xl shadow-brand-blue/10">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-300 text-xs font-mono">
                  ENGINEERED EXCELLENCE
                </span>
                <span className="text-xs font-mono text-cyan-300">Ajay's Server Architecture</span>
              </div>

              <h3 className="text-xl font-display font-bold text-white">
                First-Party Cloud GTM & Direct CAPI
              </h3>

              <ul className="space-y-4 text-xs sm:text-sm font-mono text-text-secondary">
                <li className="flex items-start gap-3">
                  <span className="text-brand-green font-bold">✓</span>
                  <span><strong>100% Signal Resilience:</strong> Ingestion occurs directly from custom server endpoints hosted on your custom domain (e.g. data.brand.com).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-green font-bold">✓</span>
                  <span><strong>180-Day Cookie Immortality:</strong> True first-party Set-Cookie HTTP headers preserve click IDs across months of buyer deliberation.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-green font-bold">✓</span>
                  <span><strong>Sub-Millisecond Browser Overhead:</strong> Single lightweight beacon sent to server container, saving over 400KB of browser JavaScript execution.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-green font-bold">✓</span>
                  <span><strong>Top-Tier Meta EMQ (9.0+):</strong> Multi-key SHA-256 hashed identity clustering for unparalleled Advantage+ bidding accuracy.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 6. Signature Lineout Kinetic Editorial Manifesto & Bottom CTA */}
        <section className="relative rounded-3xl bg-gradient-to-r from-brand-blue/20 via-black to-brand-purple/20 border border-white/15 p-8 sm:p-14 lg:p-20 overflow-hidden text-center space-y-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-mono tracking-widest uppercase">
              [ THE ATTRIBUTION MANDATE ]
            </div>

            <h2 className="text-3xl sm:text-6xl font-display font-extrabold tracking-tight text-white leading-tight">
              STOP FEEDING SMART BIDDING{' '}
              <span className="italic font-serif font-light text-cyan-400">INCOMPLETE TRUTHS.</span>
            </h2>

            <p className="text-base sm:text-xl text-text-secondary font-light max-w-2xl mx-auto leading-relaxed">
              Google Ads and Meta Advantage+ are only as smart as the conversion signal density you provide. Let's fix your tracking pipeline and unlock compounding ROAS.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <a
                href="#contact"
                className="px-8 py-4 rounded-xl bg-white hover:bg-white/90 text-black font-mono text-xs uppercase font-bold tracking-wider shadow-2xl transition-all"
              >
                Schedule Free Signal Audit
              </a>
              <a
                href="#gtm-consent-template"
                className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-mono text-xs uppercase tracking-wider transition-all"
              >
                Explore GTM Consent Stack
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
