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
  Globe
} from 'lucide-react';
import { Ads3DScene, PlatformFilter, NodeData, NODES } from '../components/Ads3DScene';
import { trackEvent } from '../lib/analytics';

export default function AdsShowcase() {
  const [filter, setFilter] = useState<PlatformFilter>('all');
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(NODES[0]);
  const [payloadTab, setPayloadTab] = useState<'google' | 'meta'>('google');
  const [copied, setCopied] = useState(false);

  const googlePayload = `{
  "customer_id": "847-291-0394",
  "conversion_action": "customers/8472910394/conversionActions/194820194",
  "conversion_date_time": "2026-09-12 09:30:15+00:00",
  "conversion_value": 349.00,
  "currency_code": "USD",
  "order_id": "ORD-2026-99214",
  "gclid": "Cj0KCQjwm5e5BhCBARIsAOPjNpX8f9jLq2Yk3Zm9x...",
  "user_identifiers": [
    {
      "hashed_email": "7a38b31a89c22e4c02930491039da58f3b23e19823a8c4f72b6d194851720a4b",
      "user_identifier_source": "FIRST_PARTY"
    },
    {
      "hashed_phone_number": "8c48e02d8471e892c90184719284718293740192847192837401928374019283"
    },
    {
      "address_info": {
        "hashed_first_name": "d41d8cd98f00b204e9800998ecf8427e",
        "hashed_last_name": "e99a18c428cb38d5f260853678922e03",
        "postal_code": "10001",
        "country_code": "US"
      }
    }
  ],
  "consent": {
    "ad_user_data": "GRANTED",
    "ad_personalization": "GRANTED"
  }
}`;

  const metaPayload = `{
  "data": [
    {
      "event_name": "Purchase",
      "event_time": 1789198215,
      "event_id": "order_ORD-2026-99214",
      "event_source_url": "https://store.brand.com/checkout/thank-you",
      "action_source": "website",
      "user_data": {
        "em": ["7a38b31a89c22e4c02930491039da58f3b23e19823a8c4f72b6d194851720a4b"],
        "ph": ["8c48e02d8471e892c90184719284718293740192847192837401928374019283"],
        "fn": ["d41d8cd98f00b204e9800998ecf8427e"],
        "ln": ["e99a18c428cb38d5f260853678922e03"],
        "zp": ["10001"],
        "country": ["us"],
        "client_ip_address": "198.51.100.42",
        "client_user_agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)...",
        "fbp": "fb.1.1729482910.1982374921",
        "fbc": "fb.1.1729482910.IwAR2X948J_k8f9Z_9a4jLm7"
      },
      "custom_data": {
        "currency": "USD",
        "value": 349.00,
        "content_type": "product",
        "order_id": "ORD-2026-99214",
        "num_items": 3
      }
    }
  ]
}`;

  const handleCopy = () => {
    const textToCopy = payloadTab === 'google' ? googlePayload : metaPayload;
    navigator.clipboard.writeText(textToCopy);
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
          Enterprise Production Architecture • 2026 Stack
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
          <Sparkles size={14} /> Full-Funnel Attribution Matrix
        </div>

        <h1 className="text-4xl md:text-7xl font-display font-bold tracking-tight leading-[1.05]">
          GOOGLE & META ADS <br />
          <span className="text-gradient">MEASUREMENT ARCHITECTURE</span>
        </h1>

        <p className="text-lg md:text-xl text-text-secondary leading-relaxed max-w-3xl mx-auto">
          High-precision, server-side attribution engineering. Eliminating signal loss from iOS 14+, Safari ITP, and ad blockers using dual-tagging, first-party cryptographic hashing, and automated offline conversion pipelines.
        </p>

        {/* High-Impact Stat Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
          <div className="glass p-5 rounded-2xl border border-white/10 text-left">
            <p className="text-xs font-mono text-text-secondary uppercase">Verified Ad Spend</p>
            <p className="text-2xl md:text-3xl font-display font-bold text-brand-blue mt-1">$15M+</p>
            <p className="text-[11px] text-text-secondary/70 mt-1">Tracked across Google & Meta</p>
          </div>
          <div className="glass p-5 rounded-2xl border border-white/10 text-left">
            <p className="text-xs font-mono text-text-secondary uppercase">Meta EMQ Score</p>
            <p className="text-2xl md:text-3xl font-display font-bold text-brand-green mt-1">9.2 / 10</p>
            <p className="text-[11px] text-text-secondary/70 mt-1">Top 5% Event Match Quality</p>
          </div>
          <div className="glass p-5 rounded-2xl border border-white/10 text-left">
            <p className="text-xs font-mono text-text-secondary uppercase">Attribution Recovery</p>
            <p className="text-2xl md:text-3xl font-display font-bold text-brand-yellow mt-1">+34.8%</p>
            <p className="text-[11px] text-text-secondary/70 mt-1">Post-ITP Conversion Uplift</p>
          </div>
          <div className="glass p-5 rounded-2xl border border-white/10 text-left">
            <p className="text-xs font-mono text-text-secondary uppercase">Deduplication Rate</p>
            <p className="text-2xl md:text-3xl font-display font-bold text-brand-red mt-1">100%</p>
            <p className="text-[11px] text-text-secondary/70 mt-1">Zero duplicate pixel hits</p>
          </div>
        </div>
      </motion.div>

      {/* 3D Interactive Pipeline Stage */}
      <motion.section
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="relative rounded-[2.5rem] glass border border-white/15 overflow-hidden shadow-2xl p-4 md:p-8"
      >
        {/* Stage Controls */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 z-20 relative">
          <div>
            <h2 className="text-2xl font-display font-bold flex items-center gap-2">
              <Activity className="text-brand-blue" /> Live Data-Stream Architecture
            </h2>
            <p className="text-xs font-mono text-text-secondary">
              Real-time visualization of ad touchpoint parameters flowing into Server GTM and API endpoints.
            </p>
          </div>

          {/* Filter Switcher */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur">
            <button
              onClick={() => {
                setFilter('all');
                trackEvent({ action: 'click', category: '3D Showcase', label: 'Filter All' });
              }}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
                filter === 'all'
                  ? 'bg-white text-black font-bold shadow'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              Unified Pipeline
            </button>
            <button
              onClick={() => {
                setFilter('google');
                trackEvent({ action: 'click', category: '3D Showcase', label: 'Filter Google' });
              }}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
                filter === 'google'
                  ? 'bg-brand-blue text-white font-bold shadow'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              Google Ads
            </button>
            <button
              onClick={() => {
                setFilter('meta');
                trackEvent({ action: 'click', category: '3D Showcase', label: 'Filter Meta' });
              }}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
                filter === 'meta'
                  ? 'bg-[#0081FB] text-white font-bold shadow'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              Meta Ads (CAPI)
            </button>
          </div>
        </div>

        {/* 3D Canvas Viewport */}
        <div className="w-full h-[520px] md:h-[620px] rounded-3xl overflow-hidden bg-[#030712] relative border border-white/10">
          <Ads3DScene
            filter={filter}
            selectedNode={selectedNode}
            onSelectNode={setSelectedNode}
          />

          {/* Active Node Detail Card Overlay */}
          <AnimatePresence>
            {selectedNode && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-4 right-4 max-w-sm w-full glass p-5 rounded-2xl border border-white/20 shadow-2xl backdrop-blur-xl z-20"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-text-secondary px-2 py-0.5 rounded bg-white/10">
                    {selectedNode.category}
                  </span>
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: selectedNode.color }}
                  />
                </div>
                <h3 className="text-lg font-display font-bold mb-1">{selectedNode.name}</h3>
                <p className="text-xs text-text-secondary leading-relaxed mb-3">
                  {selectedNode.details}
                </p>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-brand-blue">
                  <span>Architecture Node Active</span>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="text-text-secondary hover:text-white"
                  >
                    Dismiss
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* Two Pillar Deep Dive: Google Ads vs Meta Ads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Google Ads Architecture Card */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass p-8 md:p-10 rounded-[2.5rem] border border-brand-blue/20 relative overflow-hidden flex flex-col justify-between"
        >
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-brand-blue">
              <Globe size={24} />
            </div>

            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-brand-blue">
                Google Marketing Platform
              </span>
              <h3 className="text-3xl font-display font-bold mt-1">
                Google Ads & Floodlight Engineering
              </h3>
              <p className="text-text-secondary mt-3 leading-relaxed">
                Precision tracking for search, Display, Performance Max, and YouTube campaigns with direct Google Ads API and Search Ads 360 (SA360) integration.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <h4 className="text-base font-bold flex items-center gap-2 text-brand-yellow">
                  <CheckCircle2 size={16} /> Enhanced Conversions for Web & Leads
                </h4>
                <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                  Automatic user-data extraction (Email, Phone, First/Last Name) with client-side SHA-256 hashing. Syncs un-hashed and hashed signals securely to recover up to 15% lost conversion volume.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <h4 className="text-base font-bold flex items-center gap-2 text-brand-green">
                  <Layers size={16} /> SA360 & CM360 Floodlight Tag Architecture
                </h4>
                <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                  Engineered Counter and Sales transaction activities across complex digital ecosystems. Configured custom variables (<code className="text-white">u1-u20</code>) for placement-level reporting and cross-engine bid optimization.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <h4 className="text-base font-bold flex items-center gap-2 text-brand-blue">
                  <ShieldCheck size={16} /> Consent Mode v2 Advanced Modeling
                </h4>
                <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                  Seamless execution of <code className="text-white">ad_storage</code>, <code className="text-white">ad_user_data</code>, and <code className="text-white">ad_personalization</code>. Guarantees GDPR/DMA compliance while preserving machine learning attribution through behavioral modeling.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <h4 className="text-base font-bold flex items-center gap-2 text-brand-red">
                  <RefreshCw size={16} /> Offline Conversion Tracking (OCT / OCI)
                </h4>
                <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                  Automated pipelines uploading closed deals, qualified SQLs, and actual revenue back to Google Ads via BigQuery and SFTP, optimizing campaigns for closed pipeline value rather than raw form clicks.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Meta Ads (CAPI) Architecture Card */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass p-8 md:p-10 rounded-[2.5rem] border border-[#0081FB]/20 relative overflow-hidden flex flex-col justify-between"
        >
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-[#0081FB]/10 flex items-center justify-center text-[#0081FB]">
              <Server size={24} />
            </div>

            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#0081FB]">
                Meta Graph API Ecosystem
              </span>
              <h3 className="text-3xl font-display font-bold mt-1">
                Meta Conversions API (CAPI) Architecture
              </h3>
              <p className="text-text-secondary mt-3 leading-relaxed">
                Server-to-Server direct event streaming to Meta Graph API, bypassing iOS privacy restrictions, Adblockers, and browser-side script drops.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <h4 className="text-base font-bold flex items-center gap-2 text-[#00C6FF]">
                  <CheckCircle2 size={16} /> Redundant Dual-Stream Event Ingestion
                </h4>
                <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                  Simultaneous firing of browser Meta Pixel and server-side Conversions API (CAPI) to guarantee zero single points of failure across all device classes.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <h4 className="text-base font-bold flex items-center gap-2 text-purple-400">
                  <Lock size={16} /> Robust Event Deduplication System
                </h4>
                <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                  Precision <code className="text-white">event_id</code> synchronization ensures that when both client and server fire a Purchase or Lead event, Meta processes exactly one instance, preventing over-reporting.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <h4 className="text-base font-bold flex items-center gap-2 text-pink-400">
                  <TrendingUp size={16} /> Advanced Matching & 9.0+ EMQ Score
                </h4>
                <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                  Injecting comprehensive customer information parameters (<code className="text-white">em</code>, <code className="text-white">ph</code>, <code className="text-white">fn</code>, <code className="text-white">ln</code>, <code className="text-white">fbp</code>, <code className="text-white">fbc</code>, <code className="text-white">client_ip_address</code>). Consistently elevates Event Match Quality to the top tier (8.5 - 9.5).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <h4 className="text-base font-bold flex items-center gap-2 text-brand-green">
                  <Cpu size={16} /> Conversion Leads & CRM Webhook Sync
                </h4>
                <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                  Configuring stage-based lead progression (Lead → Contacted → Qualified → Won) transmitted directly to Meta CAPI, lowering acquisition costs by training algorithmic bid models on actual buyers.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Interactive Live Payload Inspector */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="glass p-8 md:p-12 rounded-[2.5rem] border border-white/15"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-xs font-mono text-text-secondary mb-2">
              <Terminal size={14} className="text-brand-green" /> Production Payload Structure
            </div>
            <h3 className="text-3xl font-display font-bold">Interactive Ingestion Payload Inspector</h3>
            <p className="text-text-secondary text-sm mt-1">
              Inspect the exact cryptographic and parameter payload sent to Google Ads Enhanced Conversions vs Meta Graph API.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex p-1 rounded-2xl bg-black/40 border border-white/10">
              <button
                onClick={() => setPayloadTab('google')}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
                  payloadTab === 'google'
                    ? 'bg-brand-blue text-white font-bold shadow'
                    : 'text-text-secondary hover:text-white'
                }`}
              >
                Google Ads Payload
              </button>
              <button
                onClick={() => setPayloadTab('meta')}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
                  payloadTab === 'meta'
                    ? 'bg-[#0081FB] text-white font-bold shadow'
                    : 'text-text-secondary hover:text-white'
                }`}
              >
                Meta CAPI Payload
              </button>
            </div>

            <button
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-2xl glass border border-white/15 text-xs font-mono flex items-center gap-2 text-text-primary hover:bg-white/10 transition-colors"
            >
              {copied ? <CheckCircle2 size={14} className="text-brand-green" /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy JSON'}
            </button>
          </div>
        </div>

        {/* Code View */}
        <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#070b14] p-5">
          <pre className="font-mono text-xs md:text-sm text-text-primary/90 overflow-x-auto leading-relaxed max-h-[420px]">
            <code>{payloadTab === 'google' ? googlePayload : metaPayload}</code>
          </pre>
        </div>

        {/* Technical Annotations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-white/10 text-xs text-text-secondary">
          <div className="space-y-1">
            <p className="font-mono text-text-primary font-bold">1. Cryptographic Normalization</p>
            <p>Emails and phone numbers are trimmed, lowercased, and hashed with SHA-256 before leaving the client or server container.</p>
          </div>
          <div className="space-y-1">
            <p className="font-mono text-text-primary font-bold">2. First-Party Context (<code className="text-brand-blue">fbp</code> / <code className="text-brand-blue">fbc</code> / <code className="text-brand-blue">gclid</code>)</p>
            <p>Click IDs and cookie identifiers are preserved under true first-party domain context, extending cookie life to 1–2 years.</p>
          </div>
          <div className="space-y-1">
            <p className="font-mono text-text-primary font-bold">3. Atomic Event Deduplication</p>
            <p>Shared <code className="text-brand-green">order_id</code> / <code className="text-brand-green">event_id</code> correlates browser events with backend transactions instantaneously.</p>
          </div>
        </div>
      </motion.section>

      {/* Case Studies & Documented Impact */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-text-secondary">Proven Outcomes</span>
          <h3 className="text-3xl md:text-4xl font-display font-bold mt-1">Real-World Case Studies</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass p-8 rounded-3xl border border-white/10 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center text-brand-green">
                <BarChart4 size={20} />
              </div>
              <h4 className="text-xl font-display font-bold">High-Volume D2C Fashion Brand</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Deployed full Meta Conversions API (CAPI) with Server GTM alongside Google Ads Enhanced Conversions for Shopify Plus.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <p className="text-2xl font-display font-bold text-brand-green">+28.4%</p>
              <p className="text-[11px] font-mono text-text-secondary uppercase">Attributed ROAS Recovery</p>
            </div>
          </div>

          <div className="glass p-8 rounded-3xl border border-white/10 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                <Globe size={20} />
              </div>
              <h4 className="text-xl font-display font-bold">Enterprise Publishing (Conde Nast)</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Architected Google Tag Manager and Floodlight tag configurations for global digital properties, auditing real-time hits and eliminating pixel discrepancies.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <p className="text-2xl font-display font-bold text-brand-blue">100%</p>
              <p className="text-[11px] font-mono text-text-secondary uppercase">Audit Accuracy & Zero Data Leakage</p>
            </div>
          </div>

          <div className="glass p-8 rounded-3xl border border-white/10 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-yellow/10 flex items-center justify-center text-brand-yellow">
                <ShieldCheck size={20} />
              </div>
              <h4 className="text-xl font-display font-bold">B2B SaaS Lead Generation</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Engineered Offline Conversion Imports (OCI) syncing HubSpot deals back into Google Ads and Meta Conversion Leads.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <p className="text-2xl font-display font-bold text-brand-yellow">-42%</p>
              <p className="text-[11px] font-mono text-text-secondary uppercase">Reduction in Cost Per SQL</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Call To Action Banner */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="glass p-8 md:p-14 rounded-[2.5rem] border border-brand-blue/30 relative overflow-hidden text-center space-y-6 bg-gradient-to-br from-brand-blue/10 via-transparent to-brand-green/10"
      >
        <h3 className="text-3xl md:text-5xl font-display font-bold max-w-2xl mx-auto">
          Upgrade Your Google & Meta Ads Attribution
        </h3>
        <p className="text-text-secondary text-base max-w-xl mx-auto leading-relaxed">
          Need an end-to-end audit, Server GTM deployment, Enhanced Conversions setup, or Meta CAPI integration for your business?
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
