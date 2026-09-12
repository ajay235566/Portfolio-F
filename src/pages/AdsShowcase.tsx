import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Search,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Target,
  Wrench,
  ShieldAlert,
  Sliders,
  Layers,
  FileText,
  BarChart3,
  PhoneCall,
  Zap,
  Globe,
  Tag,
  ArrowRight,
  ExternalLink,
  MapPin,
  Building2,
  Filter
} from 'lucide-react';
import { Ads3DScene } from '../components/Ads3DScene';
import { trackEvent } from '../lib/analytics';

export interface ClientWork {
  id: string;
  name: string;
  niche: string;
  location: string;
  platform: 'google' | 'meta' | 'system';
  badgeColor: string;
  highlights: string[];
  interventions: {
    type: 'audit' | 'negative' | 'bid' | 'tracking' | 'compliance' | 'creative';
    text: string;
  }[];
  tags: string[];
}

export const CLIENT_WORK_LIST: ClientWork[] = [
  // Google Ads Clients
  {
    id: 'xtreme',
    name: 'Xtreme Autowerx',
    niche: 'Paintless Dent Repair & Paint Protection',
    location: 'Kansas City / Johnson County, KS',
    platform: 'google',
    badgeColor: '#4285F4',
    highlights: ['Excluded Tablets', 'Phrase Match Tightening', 'Negative Keywords Added', 'Click-to-Call Fix'],
    interventions: [
      {
        type: 'audit',
        text: 'Analyzed Search, Performance Max, and Demand Gen campaigns to identify wasted spend and geo-targeting overlap.'
      },
      {
        type: 'bid',
        text: 'Excluded tablets on both Search and PMax campaigns after device segmentation revealed zero conversion efficiency.'
      },
      {
        type: 'negative',
        text: 'Tightened "car paint coating" from broad to phrase match after identifying it as the account\'s worst-performing keyword.'
      },
      {
        type: 'negative',
        text: 'Added negative keywords for brand-confusion terms (xtreme color inc, extreme auto works, xtreme autoworx) and irrelevant queries (automotive paint paint, scratch removal on car, hail damage repair).'
      },
      {
        type: 'audit',
        text: 'Identified Johnson County as a redundant, underperforming location target overlapping with already-targeted cities.'
      },
      {
        type: 'tracking',
        text: "Coordinated a click-to-call phone number fix on the client's /services landing page to ensure call attribution capture."
      }
    ],
    tags: ['PMax', 'Search', 'Demand Gen', 'Negative Keywords', 'Device Bid Modifiers', 'Geo Overlap']
  },
  {
    id: 'kelley',
    name: 'Kelley Law',
    niche: 'Estate Planning Attorney',
    location: 'Prairie Village / Johnson County, KS',
    platform: 'google',
    badgeColor: '#4285F4',
    highlights: ['Scratch Campaign Build', '100+ Negative Keyword List', 'Fair Housing Review'],
    interventions: [
      {
        type: 'audit',
        text: 'Built a full Google Ads campaign from scratch: keyword research, RSA ad copy, sitelinks, and tailored account structure.'
      },
      {
        type: 'negative',
        text: 'Compiled a 100+ term negative keyword list from search-term analysis to filter out name-based, competitor, and off-service queries (e.g., family law and elder law terms not serviced by this practice).'
      },
      {
        type: 'compliance',
        text: 'Flagged Fair Housing and practice-area boundary considerations for client review before finalizing exclusions and geo-targeting.'
      }
    ],
    tags: ['Full Build', 'RSA Copy', 'Sitelinks', 'Legal Compliance', 'Negative Keywords', 'High-Intent']
  },
  {
    id: 'kc-shine',
    name: 'KC Mobile Shine',
    niche: 'Mobile Auto Detailing',
    location: 'Kansas City Metro',
    platform: 'google',
    badgeColor: '#4285F4',
    highlights: ['GTM Container Recovery', 'Broad-Match Waste Elimination', '$25 Target CPA Calibration'],
    interventions: [
      {
        type: 'audit',
        text: 'Diagnosed recurring CPA spikes driven by uncurated broad-match keyword spend bleeding into general search queries.'
      },
      {
        type: 'tracking',
        text: 'Identified and resolved a critical GTM container removal that had caused a complete conversion-tracking blackout.'
      },
      {
        type: 'bid',
        text: 'Set campaign target CPA to $25 to tighten Smart Bidding algorithms once conversion tracking integrity was restored.'
      },
      {
        type: 'audit',
        text: 'Proposed a structured mid-funnel (MOFU) campaign targeting high research-intent queries surfaced in search-term data.'
      }
    ],
    tags: ['GTM Recovery', 'CPA Control', 'Smart Bidding', 'MOFU Funnel', 'Broad Match Cleanup']
  },
  {
    id: 'cleaning',
    name: 'The Cleaning Authority — Lenexa',
    niche: 'Residential Cleaning Franchise',
    location: 'Lenexa, KS',
    platform: 'google',
    badgeColor: '#4285F4',
    highlights: ['Meta Tracking Gap Resolution', 'Out-of-Area Spend Audit', 'Top-Performer Keyword Scaling'],
    interventions: [
      {
        type: 'audit',
        text: 'Analyzed Google and Meta ad accounts across devices, locations, and historical search terms.'
      },
      {
        type: 'compliance',
        text: "Surfaced a compliance-adjacent flag: an unserviced Lee's Summit search term spending outside the client's authorized franchise territory."
      },
      {
        type: 'bid',
        text: 'Identified top-performing keywords by conversion volume and cost efficiency to reallocate budget toward highest-margin terms.'
      },
      {
        type: 'tracking',
        text: "Flagged a critical Meta tracking gap — the account's 'Results' metric was tracking low-funnel micro-actions, not real leads — and recommended a proper Lead event setup."
      }
    ],
    tags: ['Franchise Geo-Fencing', 'Meta Lead Gap', 'Search Terms', 'Cross-Platform Audit']
  },
  {
    id: 'fern-bar',
    name: 'Fern Bar KC',
    niche: 'Craft Cocktail Lounge',
    location: 'Kansas City, MO',
    platform: 'google',
    badgeColor: '#4285F4',
    highlights: ['Store-Visits vs Confirmed Actions', 'Maps vs Search Benchmarking', 'OpenTable Funnel Audit'],
    interventions: [
      {
        type: 'audit',
        text: "Built a customized Google Ads report distinguishing Google's modeled store-visit estimates from confirmed high-intent actions (OpenTable clicks, form submissions, phone calls)."
      },
      {
        type: 'bid',
        text: 'Benchmarked Search vs. Google Maps channel efficiency and mobile vs. desktop device performance for local hospitality traffic.'
      },
      {
        type: 'tracking',
        text: 'Reviewed the Meta reservation funnel and flagged a significant drop-off occurring in the third-party OpenTable booking flow.'
      }
    ],
    tags: ['Hospitality', 'Google Maps', 'Modeled vs Real Actions', 'OpenTable Analytics', 'Local Search']
  },
  {
    id: 'aladdin',
    name: 'The Aladdin KC',
    niche: 'Apartment Rental Community',
    location: 'Kansas City, MO',
    platform: 'google',
    badgeColor: '#4285F4',
    highlights: ['Urgent Suspension Risk Remediation', 'Fair Housing Act Audit', 'Google vs Meta CPL Comparison'],
    interventions: [
      {
        type: 'audit',
        text: 'Diagnosed an urgent billing/suspension risk and an inadvertently paused Search campaign during a routine reporting cycle, restoring active bidding.'
      },
      {
        type: 'audit',
        text: 'Analyzed landing page user journeys, mobile device splits, and geographic zip code performance across the entire account history.'
      },
      {
        type: 'compliance',
        text: 'Flagged Fair Housing Act considerations around familial-status-adjacent search terms for legal and fair-lending review.'
      },
      {
        type: 'bid',
        text: 'Compared Google Ads and Meta cost-per-lead (CPL) to provide data-backed guidance on seasonal channel budget reallocation.'
      }
    ],
    tags: ['Account Recovery', 'Fair Housing Compliance', 'Real Estate', 'Cross-Channel CPL']
  },
  {
    id: 'fox-cities',
    name: 'Fox Cities Painting',
    niche: 'Exterior Painting Contractor',
    location: 'Fox Cities Region, WI',
    platform: 'google',
    badgeColor: '#4285F4',
    highlights: ['Budget-to-tCPA Mismatch Correction', 'Switch to Maximize Conversions', 'Out-of-Area Spend Exclusion'],
    interventions: [
      {
        type: 'bid',
        text: 'Identified a severe budget-vs-target-CPA mismatch ($17/day budget throttled against a $50 Target CPA) that choked campaign learning and delivery.'
      },
      {
        type: 'bid',
        text: 'Recommended switching to Maximize Conversions to accumulate necessary conversion volume before re-engaging a reliable CPA target.'
      },
      {
        type: 'audit',
        text: 'Flagged out-of-service-area spend (Green Bay, Fond du Lac) diluting an already constrained daily budget, tightening location boundaries.'
      }
    ],
    tags: ['Smart Bidding Fix', 'Maximize Conversions', 'Budget Calibration', 'Contractor Geo-Exclusions']
  },
  {
    id: 'ati-security',
    name: 'ATI Security',
    niche: 'B2B Commercial Security Systems',
    location: 'Kansas City Metro',
    platform: 'google',
    badgeColor: '#4285F4',
    highlights: ['Complete Campaign Build', 'LinkedIn Lead Form Diagnostic', 'Frictionless Conversion Flow'],
    interventions: [
      {
        type: 'audit',
        text: 'Built a full Google Ads campaign structure from scratch: commercial keyword lists, RSA copy, negative keywords, and enterprise sitelinks.'
      },
      {
        type: 'tracking',
        text: 'Diagnosed a LinkedIn Lead Gen Form issue — a mandatory phone number field was causing 0% form completion rates among busy facilities directors.'
      },
      {
        type: 'creative',
        text: 'Shipped a streamlined, phone-free lead form and tailored ad creative that eliminated conversion friction and unlocked B2B inquiries.'
      }
    ],
    tags: ['B2B Security', 'RSA Architecture', 'LinkedIn Lead Gen', 'Form CRO', 'Full Build']
  },

  // Meta Ads Clients
  {
    id: 'skyview',
    name: 'Skyview MS',
    niche: 'Media & Real-Estate Visual Services',
    location: 'Kansas City Metro',
    platform: 'meta',
    badgeColor: '#0081FB',
    highlights: ['3-Stage Meta Ad Funnel', 'Tracking Blackout Resolution', 'Broad-Match DIY Traffic Elimination'],
    interventions: [
      {
        type: 'tracking',
        text: 'Diagnosed a persistent Lead campaign tracking failure in Meta Ads Manager that was reporting zero results despite active spend.'
      },
      {
        type: 'creative',
        text: 'Architected and launched a comprehensive three-stage Meta funnel: Cold Reach (TOF), Retargeting (MOF), and Direct Booking (BOF).'
      },
      {
        type: 'negative',
        text: 'Restructured the companion Google Ads account to eliminate broad-match keyword leakage pulling in irrelevant DIY and architectural hobbyist traffic.'
      },
      {
        type: 'audit',
        text: 'Delivered unified Google Ads + Meta Ads combined executive performance reporting with blended acquisition metrics.'
      }
    ],
    tags: ['Meta 3-Stage Funnel', 'Tracking Recovery', 'Cross-Platform', 'Google Search Restructure']
  },
  {
    id: 'unique',
    name: 'Unique Painting & Windows KC',
    niche: 'Home Improvement Contractor',
    location: 'Kansas City, MO/KS',
    platform: 'meta',
    badgeColor: '#0081FB',
    highlights: ['Meta Pixel GTM Implementation', 'Reels Creative Re-encoding', '2-Stage TOF/MOF Funnel'],
    interventions: [
      {
        type: 'tracking',
        text: 'Implemented robust Meta Pixel event tracking via Google Tag Manager with custom triggers and event verification.'
      },
      {
        type: 'creative',
        text: 'Launched an aggressive two-stage (TOF brand awareness / MOF estimate intent) Meta campaign structure.'
      },
      {
        type: 'creative',
        text: 'Re-encoded and reformatted client video creative for full Reels 9:16 compatibility and confirmed thank-you-page conversion firing.'
      }
    ],
    tags: ['Meta Pixel GTM', 'Reels Format', 'TOF/MOF', 'Lead Gen', 'Contractor']
  },
  {
    id: 'touring',
    name: 'Touring Tee',
    niche: 'E-Commerce Apparel Brand',
    location: 'Global / Direct-to-Consumer',
    platform: 'meta',
    badgeColor: '#7F00FF',
    highlights: ['Live Meta Ads Management', 'Creative Testing Pipeline', 'E-Commerce Scaling'],
    interventions: [
      {
        type: 'creative',
        text: 'Actively managing a live, scaling Meta Ads campaign focusing on Advantage+ catalog integration and high-converting lifestyle imagery.'
      },
      {
        type: 'bid',
        text: 'Conducting continuous ad creative variant testing, audience testing (broad vs lookalikes), and ROAS margin management.'
      }
    ],
    tags: ['E-Commerce', 'Advantage+', 'Apparel', 'Live Management', 'Creative Testing']
  },

  // Cross-Client Systems & Processes
  {
    id: 'reporting',
    name: 'Standardized Reporting System',
    niche: 'Cross-Client Business Intelligence & House Style',
    location: 'Agency-Wide Framework',
    platform: 'system',
    badgeColor: '#00E5FF',
    highlights: ['House Style Guide', 'Combined Google + Meta Pipeline', 'UTF-16 & Multi-Header CSV Handling'],
    interventions: [
      {
        type: 'audit',
        text: 'Built and refined a standardized reporting framework deployed consistently across all 11+ client accounts.'
      },
      {
        type: 'creative',
        text: 'Developed a consistent house style for client-facing reports: clear executive KPI summaries, plain-language takeaways, and supporting visual charts.'
      },
      {
        type: 'audit',
        text: 'Built a repeatable process for combined Google + Meta executive reporting when multi-channel budgets are active.'
      },
      {
        type: 'tracking',
        text: 'Established automated conventions for handling messy or platform-specific export formats (UTF-16 exports, multi-header CSVs, and segmented raw logs).'
      }
    ],
    tags: ['Executive Reporting', 'House Style', 'Data Normalization', 'CSV Cleaning', 'BI Framework']
  },
  {
    id: 'tracking',
    name: 'Conversion Tracking Implementation',
    niche: 'Enterprise Measurement, GTM & Pixels',
    location: 'Cross-Portfolio Technical Specialty',
    platform: 'system',
    badgeColor: '#00E676',
    highlights: ['GTM Container Recovery', 'Meta Pixel Deduplication', 'GA4 Path Exploration', 'LinkedIn Verification'],
    interventions: [
      {
        type: 'tracking',
        text: 'Recurring core specialty: deployed and audited Google Tag Manager containers across healthcare, legal, home services, and e-commerce.'
      },
      {
        type: 'tracking',
        text: 'Engineered Meta Pixel event tracking via GTM, including custom event triggers, value parameters, and duplicate-fire prevention.'
      },
      {
        type: 'audit',
        text: 'Conducted GA4 funnel and path exploration analyses to audit paid traffic behavior and identify pre-conversion drop-offs.'
      },
      {
        type: 'tracking',
        text: 'Configured and verified LinkedIn Insight Tag tracking and configured Google Ads call and lead conversion actions.'
      },
      {
        type: 'audit',
        text: 'Regularly diagnosed and resolved tracking blackouts caused by unintended tag-manager container removal or misconfigured custom conversions.'
      }
    ],
    tags: ['GTM Specialty', 'Meta Pixel', 'GA4 Funnels', 'LinkedIn Insight', 'Call Tracking', 'Zero Blindspots']
  }
];

export default function AdsShowcase() {
  const [activePlatform, setActivePlatform] = useState<'all' | 'google' | 'meta' | 'system'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<ClientWork | null>(null);

  // Filtered client list
  const filteredList = useMemo(() => {
    return CLIENT_WORK_LIST.filter((item) => {
      // Platform Filter
      if (activePlatform !== 'all' && item.platform !== activePlatform) return false;

      // Tag Filter
      if (activeTag && !item.tags.includes(activeTag)) return false;

      // Search Query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesNiche = item.niche.toLowerCase().includes(q);
        const matchesLocation = item.location.toLowerCase().includes(q);
        const matchesInterventions = item.interventions.some((inv) =>
          inv.text.toLowerCase().includes(q)
        );
        const matchesTags = item.tags.some((t) => t.toLowerCase().includes(q));

        return matchesName || matchesNiche || matchesLocation || matchesInterventions || matchesTags;
      }

      return true;
    });
  }, [activePlatform, activeTag, searchQuery]);

  // Handle 3D node selection
  const handleSelect3DNode = (id: string) => {
    const found = CLIENT_WORK_LIST.find((c) => c.id === id);
    if (found) {
      setSelectedClient(found);
      const element = document.getElementById(`client-${id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const getInterventionIcon = (type: string) => {
    switch (type) {
      case 'audit':
        return <Search size={15} className="text-cyan-400 shrink-0 mt-0.5" />;
      case 'negative':
        return <ShieldAlert size={15} className="text-red-400 shrink-0 mt-0.5" />;
      case 'bid':
        return <Sliders size={15} className="text-amber-400 shrink-0 mt-0.5" />;
      case 'tracking':
        return <CheckCircle2 size={15} className="text-brand-green shrink-0 mt-0.5" />;
      case 'compliance':
        return <Target size={15} className="text-purple-400 shrink-0 mt-0.5" />;
      case 'creative':
        return <Sparkles size={15} className="text-blue-400 shrink-0 mt-0.5" />;
      default:
        return <CheckCircle2 size={15} className="text-brand-blue shrink-0 mt-0.5" />;
    }
  };

  return (
    <div className="relative min-h-screen bg-[#030712] text-white selection:bg-brand-blue selection:text-white">
      {/* 1. Interactive 3D Hero Command Canvas */}
      <div className="relative h-[480px] sm:h-[540px] w-full border-b border-white/10 overflow-hidden bg-gradient-to-b from-[#030712] via-[#070e24] to-[#030712]">
        <Ads3DScene onSelectNode={handleSelect3DNode} />

        {/* Hero Overlay Text */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 sm:p-12 max-w-7xl mx-auto">
          {/* Top Breadcrumb */}
          <div className="pointer-events-auto flex items-center justify-between">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = '';
              }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-text-secondary hover:text-white transition-colors"
            >
              <ChevronLeft size={14} /> Back to Portfolio Home
            </a>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-text-secondary">
              <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
              Interactive 3D Marketing Command Core
            </div>
          </div>

          {/* Bottom Title Bar */}
          <div className="space-y-3 pointer-events-auto max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/20 border border-brand-blue/40 text-cyan-300 text-xs font-mono uppercase tracking-widest">
              Digital Marketing — Work Summary
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-white leading-tight">
              CAMPAIGN ARCHITECTURE & <span className="text-gradient">CLIENT OPTIMIZATIONS</span>
            </h1>
            <p className="text-sm sm:text-base text-text-secondary font-light">
              Exact changes, audits, and performance engineering delivered across Google Ads, Meta Ads, and Enterprise Conversion Tracking. Drag or interact with the 3D nodes above to inspect client accounts.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16 space-y-12">
        {/* Quick Highlights Counter Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
            <div className="text-2xl sm:text-3xl font-display font-bold text-white">11+</div>
            <div className="text-xs font-mono text-text-secondary mt-1">Direct Client Accounts</div>
            <div className="text-[11px] font-mono text-brand-blue mt-0.5">Google, Meta, & Hybrid</div>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
            <div className="text-2xl sm:text-3xl font-display font-bold text-cyan-400">100+</div>
            <div className="text-xs font-mono text-text-secondary mt-1">Negative Keyword Terms</div>
            <div className="text-[11px] font-mono text-cyan-400 mt-0.5">Filtered Wasted Spend</div>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
            <div className="text-2xl sm:text-3xl font-display font-bold text-amber-400">$25</div>
            <div className="text-xs font-mono text-text-secondary mt-1">Target CPA Calibrations</div>
            <div className="text-[11px] font-mono text-amber-400 mt-0.5">Tightened Smart Bidding</div>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
            <div className="text-2xl sm:text-3xl font-display font-bold text-brand-green">100%</div>
            <div className="text-xs font-mono text-text-secondary mt-1">Tracking Gap Recovery</div>
            <div className="text-[11px] font-mono text-brand-green mt-0.5">GTM & Meta Pixels Rescued</div>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-6 backdrop-blur-xl space-y-6">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Category Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  setActivePlatform('all');
                  setActiveTag(null);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-mono tracking-wider transition-all cursor-pointer ${
                  activePlatform === 'all'
                    ? 'bg-white text-black font-bold shadow-lg shadow-white/10'
                    : 'bg-white/5 text-text-secondary hover:text-white border border-white/10'
                }`}
              >
                All Work ({CLIENT_WORK_LIST.length})
              </button>

              <button
                onClick={() => {
                  setActivePlatform('google');
                  setActiveTag(null);
                }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono tracking-wider transition-all cursor-pointer ${
                  activePlatform === 'google'
                    ? 'bg-brand-blue text-white font-bold shadow-lg shadow-brand-blue/20'
                    : 'bg-white/5 text-text-secondary hover:text-white border border-white/10'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-brand-blue" />
                Google Ads Clients (8)
              </button>

              <button
                onClick={() => {
                  setActivePlatform('meta');
                  setActiveTag(null);
                }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono tracking-wider transition-all cursor-pointer ${
                  activePlatform === 'meta'
                    ? 'bg-[#0081FB] text-white font-bold shadow-lg shadow-blue-500/20'
                    : 'bg-white/5 text-text-secondary hover:text-white border border-white/10'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#0081FB]" />
                Meta Ads Clients (3)
              </button>

              <button
                onClick={() => {
                  setActivePlatform('system');
                  setActiveTag(null);
                }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono tracking-wider transition-all cursor-pointer ${
                  activePlatform === 'system'
                    ? 'bg-cyan-500 text-black font-bold shadow-lg shadow-cyan-500/20'
                    : 'bg-white/5 text-text-secondary hover:text-white border border-white/10'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                Systems & Tracking (2)
              </button>
            </div>

            {/* Live Search Bar */}
            <div className="relative min-w-[280px]">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
              <input
                type="text"
                placeholder="Search clients, actions, terms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/50 border border-white/10 text-xs font-mono text-white placeholder:text-text-secondary focus:outline-none focus:border-brand-blue transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-secondary hover:text-white cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Quick Tag Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
            <span className="text-[11px] font-mono text-text-secondary flex items-center gap-1 mr-2">
              <Filter size={12} /> Filter by Strategic Technique:
            </span>
            {[
              'Negative Keywords',
              'GTM Recovery',
              'Smart Bidding',
              'PMax',
              'TOF/MOF',
              'Legal Compliance',
              'Executive Reporting'
            ].map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer ${
                  activeTag === tag
                    ? 'bg-white text-black font-semibold'
                    : 'bg-white/5 text-text-secondary hover:text-white border border-white/10'
                }`}
              >
                #{tag}
              </button>
            ))}
            {activeTag && (
              <button
                onClick={() => setActiveTag(null)}
                className="text-[11px] font-mono text-cyan-400 hover:underline ml-2 cursor-pointer"
              >
                Reset filter
              </button>
            )}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs font-mono text-text-secondary px-2">
          <span>Showing {filteredList.length} verified client accounts & cross-client architectures</span>
          {searchQuery && <span>Filtered by "{searchQuery}"</span>}
        </div>

        {/* Client Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredList.map((client) => {
            const isGoogle = client.platform === 'google';
            const isMeta = client.platform === 'meta';
            const isSystem = client.platform === 'system';

            return (
              <div
                key={client.id}
                id={`client-${client.id}`}
                className="group relative rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 hover:border-white/20 backdrop-blur-xl p-6 sm:p-8 space-y-6 transition-all duration-300 shadow-lg"
              >
                {/* Header Row */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2.5 py-0.5 rounded-md text-[11px] font-mono uppercase tracking-wider font-semibold"
                        style={{
                          backgroundColor: `${client.badgeColor}20`,
                          color: client.badgeColor,
                          border: `1px solid ${client.badgeColor}40`
                        }}
                      >
                        {isGoogle ? 'Google Ads' : isMeta ? 'Meta Ads' : 'Systems & BI'}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-mono text-text-secondary">
                        <MapPin size={12} className="text-text-secondary" />
                        {client.location}
                      </span>
                    </div>

                    <h3 className="text-2xl font-display font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {client.name}
                    </h3>

                    <p className="text-xs font-mono text-text-secondary font-medium">
                      {client.niche}
                    </p>
                  </div>
                </div>

                {/* Highlight Pills */}
                <div className="flex flex-wrap gap-2">
                  {client.highlights.map((h, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-mono text-cyan-200"
                    >
                      ✓ {h}
                    </span>
                  ))}
                </div>

                {/* Interventions & Actions List */}
                <div className="space-y-3 pt-2 border-t border-white/5">
                  <div className="text-xs font-mono text-text-secondary uppercase tracking-wider">
                    [ Actions Implemented & Technical Audits ]
                  </div>
                  <ul className="space-y-3 text-xs sm:text-sm font-mono text-text-secondary">
                    {client.interventions.map((inv, idx) => (
                      <li key={idx} className="flex items-start gap-3 leading-relaxed">
                        {getInterventionIcon(inv.type)}
                        <span>{inv.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tags Footer */}
                <div className="flex flex-wrap items-center gap-1.5 pt-4 border-t border-white/5 text-[11px] font-mono text-text-secondary">
                  <Tag size={12} className="mr-1" />
                  {client.tags.map((t, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/5"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredList.length === 0 && (
          <div className="text-center py-20 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
            <Search size={32} className="mx-auto text-text-secondary" />
            <div className="text-lg font-display text-white">No matching client campaigns found</div>
            <p className="text-xs font-mono text-text-secondary max-w-md mx-auto">
              No results for "{searchQuery}". Try clearing search or selecting "All Work".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActivePlatform('all');
                setActiveTag(null);
              }}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono text-white transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Deep Dive Section: Cross-Client Systems & Infrastructure */}
        <section className="pt-8 space-y-8">
          <div className="border-b border-white/10 pb-6">
            <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">
              [ ENTERPRISE REPEATABILITY ]
            </div>
            <h2 className="text-2xl sm:text-4xl font-display font-bold tracking-tight">
              STANDARDIZED SYSTEMS & <span className="text-gradient">CONVERSION TRACKING</span>
            </h2>
            <p className="text-text-secondary text-sm sm:text-base max-w-3xl mt-2 font-light">
              Rather than managing ad accounts in silos, I engineer repeatable data conventions and measurement protocols across every account in the portfolio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Standardized Reporting System Card */}
            <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-6 sm:p-8 space-y-6 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-cyan-400/10 border border-cyan-400/30 text-cyan-300">
                  <BarChart3 size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-white">Standardized Reporting System</h3>
                  <p className="text-xs font-mono text-text-secondary">Built and refined across all client accounts</p>
                </div>
              </div>

              <ul className="space-y-3.5 text-xs sm:text-sm font-mono text-text-secondary">
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Consistent House Style:</strong> Developed clear client-facing KPI summaries, plain-language executive takeaways, and high-clarity supporting charts.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Combined Multi-Channel Process:</strong> Built a repeatable process for unified Google + Meta reporting when both acquisition channels are active.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Data Normalization Pipelines:</strong> Established robust conventions for handling messy platform exports (UTF-16 encodings, multi-header CSV tables).</span>
                </li>
              </ul>
            </div>

            {/* Conversion Tracking Implementation Card */}
            <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-6 sm:p-8 space-y-6 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-green-400/10 border border-green-400/30 text-green-300">
                  <Zap size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-white">Conversion Tracking Implementation</h3>
                  <p className="text-xs font-mono text-text-secondary">Recurring specialty across the client portfolio</p>
                </div>
              </div>

              <ul className="space-y-3.5 text-xs sm:text-sm font-mono text-text-secondary">
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-brand-green shrink-0 mt-0.5" />
                  <span><strong>Meta Pixel via Google Tag Manager:</strong> Custom event tags, lead value passing, and duplicate-fire suppression algorithms.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-brand-green shrink-0 mt-0.5" />
                  <span><strong>GA4 Funnel & Path Exploration:</strong> Behavioral paid traffic exploration to diagnose landing page leakages.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-brand-green shrink-0 mt-0.5" />
                  <span><strong>Tracking Blackout Remediation:</strong> Swift diagnosis of GTM container removal, unverified LinkedIn tags, or broken custom conversions.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Bottom CTA Section */}
        <section className="relative rounded-3xl bg-gradient-to-r from-brand-blue/20 via-black to-brand-purple/20 border border-white/15 p-8 sm:p-14 text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-white">
              NEED AN AUDIT ON YOUR GOOGLE OR META ADS?
            </h2>
            <p className="text-xs sm:text-sm font-mono text-text-secondary">
              Whether diagnosing recurring CPA spikes, pruning negative keyword waste, or restoring broken GTM containers, I can help audit and optimize your account.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#contact"
                className="px-6 py-3 rounded-xl bg-white text-black font-mono text-xs uppercase font-bold tracking-wider hover:bg-white/90 transition-colors shadow-lg"
              >
                Schedule Account Audit
              </a>
              <a
                href="#gtm-consent-template"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-mono text-xs uppercase tracking-wider transition-colors"
              >
                View GTM Consent Stack
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
