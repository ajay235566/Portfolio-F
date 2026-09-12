import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Zap,
  CheckCircle2,
  Copy,
  ExternalLink,
  ArrowRight,
  ChevronRight,
  Terminal,
  Activity,
  Server,
  Layers,
  Sparkles,
  Lock,
  TrendingUp,
  Cpu,
  BarChart4,
  RefreshCw,
  Globe,
  Play,
  Filter,
  Check,
  Code2
} from 'lucide-react';
import { Ads3DScene, PlatformFilter, FunnelStage, FUNNEL_STAGES } from '../components/Ads3DScene';
import { trackEvent } from '../lib/analytics';

export default function AdsShowcase() {
  const [filter, setFilter] = useState<PlatformFilter>('all');
  const [activeStage, setActiveStage] = useState<FunnelStage>(FUNNEL_STAGES[0]);
  const [isBursting, setIsBursting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [simulationLog, setSimulationLog] = useState<string | null>(null);

  const handleSimulateBurst = () => {
    setIsBursting(true);
    setSimulationLog('Simulating live ad click: gclid + fbclid generated → routing through Server GTM...');

    setTimeout(() => {
      setSimulationLog('Normalizing & hashing user identifiers (SHA-256) → Consent state: GRANTED...');
    }, 700);

    setTimeout(() => {
      setSimulationLog('Direct API stream verified: Google Ads API 200 OK • Meta CAPI Graph API 200 OK (Match EMQ: 9.2)');
    }, 1400);

    setTimeout(() => {
      setIsBursting(false);
      setTimeout(() => setSimulationLog(null), 4000);
    }, 2000);

    trackEvent({ action: 'click', category: '3D Funnel', label: 'Simulate Live Event' });
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeStage.codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto space-y-16">
      {/* Navigation Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.location.hash = '';
          }}
          className="inline-flex items-center gap-2 text-sm font-mono text-text-secondary hover:text-brand-blue transition-colors"
        >
          <ChevronRight size={16} className="rotate-180" /> Back to Portfolio Home
        </a>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-white/10 text-xs font-mono text-text-secondary">
          <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
          Interactive 3D Visual Funnel • Google & Meta Ads
        </div>
      </div>

      {/* Main Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-4xl mx-auto space-y-6"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-brand-blue/30 text-brand-blue text-xs font-mono uppercase tracking-widest">
          <Layers size={14} /> End-to-End Measurement Journey
        </div>

        <h1 className="text-4xl md:text-7xl font-display font-bold tracking-tight leading-[1.05]">
          3D CONVERSION & <br />
          <span className="text-gradient">ATTRIBUTION FUNNEL</span>
        </h1>

        <p className="text-lg md:text-xl text-text-secondary leading-relaxed max-w-3xl mx-auto">
          Rotate and step through each tier of the enterprise tracking funnel—from initial paid ad click, through client consent and Server-Side GTM cryptographic hashing, down to verified Google Ads & Meta CAPI attribution.
        </p>

        {/* Funnel Stage Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-4">
          {FUNNEL_STAGES.map((stage) => {
            const isActive = activeStage.id === stage.id;
            return (
              <button
                key={stage.id}
                onClick={() => {
                  setActiveStage(stage);
                  trackEvent({ action: 'click', category: '3D Funnel', label: `Stage ${stage.id}` });
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden ${
                  isActive
                    ? 'glass border-white/40 shadow-lg shadow-brand-blue/10 bg-white/10'
                    : 'glass border-white/10 hover:border-white/20 opacity-80'
                }`}
              >
                {isActive && (
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ backgroundColor: stage.color }}
                  />
                )}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-text-secondary">
                    Step 0{stage.id}
                  </span>
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: stage.color }}
                  />
                </div>
                <p className="text-xs font-display font-bold text-text-primary mt-1 line-clamp-1">
                  {stage.name.split(':')[1] || stage.name}
                </p>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* 3D Visual Funnel Stage + Deep Dive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left / Center 3D Funnel Canvas (7 Cols) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="lg:col-span-7 rounded-[2.5rem] glass border border-white/15 overflow-hidden shadow-2xl p-4 md:p-6 space-y-4"
        >
          {/* Top Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-text-secondary">Filter Traffic:</span>
              <div className="flex p-1 rounded-xl bg-black/40 border border-white/10 backdrop-blur text-[11px] font-mono">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    filter === 'all' ? 'bg-white text-black font-bold' : 'text-text-secondary hover:text-white'
                  }`}
                >
                  All Ads
                </button>
                <button
                  onClick={() => setFilter('google')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    filter === 'google' ? 'bg-brand-blue text-white font-bold' : 'text-text-secondary hover:text-white'
                  }`}
                >
                  Google
                </button>
                <button
                  onClick={() => setFilter('meta')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    filter === 'meta' ? 'bg-[#0081FB] text-white font-bold' : 'text-text-secondary hover:text-white'
                  }`}
                >
                  Meta
                </button>
              </div>
            </div>

            {/* Simulation Button */}
            <button
              onClick={handleSimulateBurst}
              disabled={isBursting}
              className={`px-4 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
                isBursting
                  ? 'bg-brand-green text-white animate-pulse'
                  : 'bg-brand-blue text-white hover:scale-105 shadow-md shadow-brand-blue/20'
              }`}
            >
              <Play size={12} fill="currentColor" />
              {isBursting ? 'Event Cascading...' : 'Simulate Live Event'}
            </button>
          </div>

          {/* 3D Canvas */}
          <div className="w-full h-[480px] md:h-[580px] rounded-3xl overflow-hidden bg-[#02050e] relative border border-white/10">
            <Ads3DScene
              activeStage={activeStage}
              onSelectStage={setActiveStage}
              isBursting={isBursting}
              filter={filter}
            />

            {/* Live Simulation Toast Notification */}
            <AnimatePresence>
              {simulationLog && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-4 right-4 max-w-sm glass px-4 py-2.5 rounded-xl border border-brand-green/30 bg-black/80 backdrop-blur shadow-2xl flex items-center gap-2.5 text-xs font-mono text-brand-green z-20"
                >
                  <span className="w-2 h-2 rounded-full bg-brand-green animate-ping shrink-0" />
                  <span className="truncate">{simulationLog}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Interactive Step Quick Navigator at bottom of 3D Scene */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 glass px-4 py-2 rounded-full border border-white/20 backdrop-blur shadow-xl">
              <button
                disabled={activeStage.id === 1}
                onClick={() => {
                  const prev = FUNNEL_STAGES.find(s => s.id === activeStage.id - 1);
                  if (prev) setActiveStage(prev);
                }}
                className="text-xs font-mono text-text-secondary hover:text-white disabled:opacity-30 px-2 py-1"
              >
                ◀ Previous Tier
              </button>

              <span className="text-xs font-mono font-bold text-white px-2 border-x border-white/10">
                Tier {activeStage.id} / 4
              </span>

              <button
                disabled={activeStage.id === 4}
                onClick={() => {
                  const next = FUNNEL_STAGES.find(s => s.id === activeStage.id + 1);
                  if (next) setActiveStage(next);
                }}
                className="text-xs font-mono text-text-secondary hover:text-white disabled:opacity-30 px-2 py-1"
              >
                Next Tier ▶
              </button>
            </div>
          </div>
        </motion.div>

        {/* Right Active Tier Deep Dive & Parameters (5 Cols) */}
        <motion.div
          key={activeStage.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-5 space-y-6"
        >
          {/* Active Stage Overview Card */}
          <div className="glass p-7 rounded-[2.5rem] border border-white/15 space-y-5">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-text-secondary">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeStage.color }} />
                Stage {activeStage.id} Technical Specification
              </div>
              <span className="text-xs font-mono text-text-secondary uppercase">
                Tier Depth: {activeStage.id * 25}%
              </span>
            </div>

            <div>
              <h3 className="text-2xl font-display font-bold">{activeStage.name}</h3>
              <p className="text-xs font-mono text-brand-blue mt-1">{activeStage.subtitle}</p>
              <p className="text-sm text-text-secondary mt-3 leading-relaxed">
                {activeStage.description}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-1">
              {activeStage.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-mono text-text-secondary"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Extracted Parameters Table */}
            <div className="space-y-3 pt-2">
              <p className="text-xs font-mono uppercase tracking-widest text-text-secondary">
                Data Parameters Extracted & Ingested
              </p>
              <div className="space-y-2">
                {activeStage.parameters.map((param) => (
                  <div
                    key={param.key}
                    className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs font-mono space-y-1"
                  >
                    <div className="flex items-center justify-between text-text-primary">
                      <span className="text-brand-blue font-bold">{param.key}</span>
                      <span className="text-text-secondary/70 truncate max-w-[140px]">{param.val}</span>
                    </div>
                    <p className="text-[11px] text-text-secondary leading-snug">{param.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Implementation Code Snippet Card */}
          <div className="glass p-6 rounded-[2.5rem] border border-white/15 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-text-secondary flex items-center gap-2">
                <Code2 size={14} className="text-brand-green" /> Production Implementation Logic
              </span>
              <button
                onClick={handleCopyCode}
                className="text-xs font-mono text-text-secondary hover:text-white flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check size={12} className="text-brand-green" /> : <Copy size={12} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            <div className="rounded-xl overflow-hidden border border-white/10 bg-[#040814] p-4">
              <pre className="font-mono text-[11px] text-text-primary/90 overflow-x-auto leading-relaxed max-h-[190px]">
                <code>{activeStage.codeSnippet}</code>
              </pre>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Funnel Health & Signal Retention Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="glass p-8 rounded-[2.5rem] border border-white/15 space-y-6"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-brand-green">
              Signal Durability Benchmark
            </span>
            <h3 className="text-2xl md:text-3xl font-display font-bold mt-1">
              Client-Side Pixel vs. 3D Server Funnel Retention
            </h3>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-green/10 border border-brand-green/20 text-brand-green text-xs font-mono">
            <CheckCircle2 size={14} /> +34.8% Verified Attribution Recovery
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-xs font-mono text-text-secondary">Browser Adblock Resilience</p>
            <p className="text-2xl font-display font-bold text-brand-green mt-1">100%</p>
            <p className="text-[11px] text-text-secondary mt-1">First-party subdomain proxy bypasses client blocklists</p>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-xs font-mono text-text-secondary">Safari ITP Cookie Life</p>
            <p className="text-2xl font-display font-bold text-brand-blue mt-1">180 Days</p>
            <p className="text-[11px] text-text-secondary mt-1">Extended from standard 24-hour Safari cap</p>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-xs font-mono text-text-secondary">Meta EMQ Score</p>
            <p className="text-2xl font-display font-bold text-brand-yellow mt-1">9.2 / 10</p>
            <p className="text-[11px] text-text-secondary mt-1">Top-tier matching through 7 customer parameters</p>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-xs font-mono text-text-secondary">Conversion Deduplication</p>
            <p className="text-2xl font-display font-bold text-brand-red mt-1">Zero Dups</p>
            <p className="text-[11px] text-text-secondary mt-1">Deterministic deduplication via shared event_id</p>
          </div>
        </div>
      </motion.div>

      {/* Call To Action Banner */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="glass p-8 md:p-14 rounded-[2.5rem] border border-brand-blue/30 relative overflow-hidden text-center space-y-6 bg-gradient-to-br from-brand-blue/10 via-transparent to-brand-green/10"
      >
        <h3 className="text-3xl md:text-5xl font-display font-bold max-w-2xl mx-auto">
          Engineer Your Conversion Funnel
        </h3>
        <p className="text-text-secondary text-base max-w-xl mx-auto leading-relaxed">
          Want this end-to-end 3D conversion funnel implemented across your Google Ads, Search Ads 360, and Meta Conversions API accounts?
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              window.location.hash = '';
              setTimeout(() => {
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }, 150);
            }}
            className="px-8 py-4 rounded-2xl bg-brand-blue text-white font-bold flex items-center gap-3 shadow-lg shadow-brand-blue/30 hover:scale-105 transition-transform"
          >
            Request Tracking Audit <ArrowRight size={18} />
          </a>

          <a
            href="mailto:ajayignited@gmail.com"
            className="px-8 py-4 rounded-2xl glass text-text-primary font-bold flex items-center gap-3 hover:bg-white/10 transition-colors"
          >
            Direct Inquiry <ExternalLink size={18} />
          </a>
        </div>
      </motion.div>
    </div>
  );
}
