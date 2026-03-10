import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Settings,
  ShieldCheck,
  Zap,
  RefreshCw,
  Copy,
  CheckCircle2,
  Database,
  Code2,
  ListChecks
} from 'lucide-react';
import { cn } from '../lib/utils';

// Simplified ParallaxBackground for this page or we can just import from App if exported. Since it's not exported, recreate a simple one.
const Background = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-[#050505]">
    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-blue/10 blur-[120px] rounded-full" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-red/10 blur-[120px] rounded-full" />
    <div className="absolute inset-0 grid-pattern opacity-20" />
  </div>
);

const CodeBlock = ({ code, language }: { code: string, language: string }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#111] my-6">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
        <span className="text-xs font-mono text-white/50 lowercase">{language}</span>
        <button
          onClick={copyToClipboard}
          className="text-white/50 hover:text-white transition-colors flex items-center gap-2 text-xs font-mono"
        >
          {copied ? <CheckCircle2 size={14} className="text-brand-green" /> : <Copy size={14} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="p-4 overflow-x-auto text-sm font-mono text-white/80 leading-relaxed">
        <pre><code>{code}</code></pre>
      </div>
    </div>
  );
}

export default function ConsentDocs() {
  const htmlBannerCode = `<div id="nalla-banner" style="position: fixed; bottom: 0; width: 100%; background: #1a1a1a; color: #fff; padding: 20px; z-index: 10000; font-family: sans-serif; border-top: 3px solid #3498db;">
  <div style="max-width: 1000px; margin: 0 auto; display: flex; flex-direction: column; gap: 15px;">
    <div>
      <h3 style="margin: 0 0 10px 0;">Privacy Preferences (v2)</h3>
      <p style="font-size: 14px; color: #ccc;">Please select your preferences for each data type below.</p>
    </div>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 13px; background: #2c2c2c; padding: 15px; border-radius: 4px;">
      <label style="cursor:pointer;"><input type="checkbox" id="check-ad-storage" checked> Ad Storage</label>
      <label style="cursor:pointer;"><input type="checkbox" id="check-analytics-storage" checked> Analytics Storage</label>
      <label style="cursor:pointer;"><input type="checkbox" id="check-ad-user-data" checked> Ad User Data</label>
      <label style="cursor:pointer;"><input type="checkbox" id="check-ad-personalization" checked> Ad Personalization</label>
    </div>

    <div style="display: flex; gap: 10px;">
      <button onclick="sendConsent('denied', 'denied', 'denied', 'denied')" style="padding: 10px 20px; cursor: pointer; background: #444; color: #fff; border: none; border-radius: 4px;">Reject All</button>
      <button onclick="sendCustomConsent()" style="padding: 10px 20px; cursor: pointer; background: #3498db; color: #fff; border: none; border-radius: 4px; font-weight: bold;">Save My Choices</button>
      <button onclick="sendConsent('granted', 'granted', 'granted', 'granted')" style="padding: 10px 20px; cursor: pointer; background: #27ae60; color: #fff; border: none; border-radius: 4px; font-weight: bold;">Accept All</button>
    </div>
  </div>
</div>`;

  const scriptCode = `<script>
  const COOKIE_NAME = 'nalla_consent_preferences';

  function setNallaCookie(value) {
    const date = new Date();
    date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
    document.cookie = COOKIE_NAME + "=" + JSON.stringify(value) + "; expires=" + date.toUTCString() + "; path=/; SameSite=Lax";
  }

  function getNallaCookie() {
    const value = "; " + document.cookie;
    const parts = value.split("; " + COOKIE_NAME + "=");
    if (parts.length === 2) {
      try { return JSON.parse(parts.pop().split(";").shift()); } catch (e) { return null; }
    }
    return null;
  }

  // --- UI TOGGLE LOGIC ---
  function hideBanner() {
    document.getElementById('nalla-banner').style.display = 'none';
    document.getElementById('consent-icon').style.display = 'flex'; // Show floating icon
  }

  function showBanner() {
    document.getElementById('nalla-banner').style.display = 'block';
    document.getElementById('consent-icon').style.display = 'none'; // Hide floating icon
  }

  // --- CONSENT LOGIC ---
  function sendCustomConsent() {
    const adsStatus = document.getElementById('check-ad-storage').checked ? 'granted' : 'denied';
    const analyticsStatus = document.getElementById('check-analytics-storage').checked ? 'granted' : 'denied';
    const userDataStatus = document.getElementById('check-ad-user-data').checked ? 'granted' : 'denied';
    const personalizationStatus = document.getElementById('check-ad-personalization').checked ? 'granted' : 'denied';
    
    sendConsent(adsStatus, analyticsStatus, userDataStatus, personalizationStatus); 
  }

  function sendConsent(ad_val, analytics_val, userData_val, personalization_val) {
    const consentObject = {
      ad_storage: ad_val,
      analytics_storage: analytics_val,
      ad_user_data: userData_val,
      ad_personalization: personalization_val,
      consent_selected: true
    };

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'user_consent_update',
      ...consentObject
    });

    setNallaCookie(consentObject);
    hideBanner();
  }

  // ON PAGE LOAD
  window.addEventListener('DOMContentLoaded', function() {
    const savedConsent = getNallaCookie();
    
    if (savedConsent && savedConsent.consent_selected) {
      // User already interacted: Hide banner, show icon
      hideBanner();
      
      // Sync GTM
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'user_consent_update',
        ...savedConsent
      });

      // Update UI Checkboxes to match saved state
      document.getElementById('check-ad-storage').checked = (savedConsent.ad_storage === 'granted');
      document.getElementById('check-analytics-storage').checked = (savedConsent.analytics_storage === 'granted');
      document.getElementById('check-ad-user-data').checked = (savedConsent.ad_user_data === 'granted');
      document.getElementById('check-ad-personalization').checked = (savedConsent.ad_personalization === 'granted');
    } else {
      // First visit: Show banner, hide icon
      showBanner();
    }
  });
</script>

<div id="consent-icon" onclick="showBanner()" style="position: fixed; bottom: 20px; right: 20px; width: 50px; height: 50px; background: #3498db; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; cursor: pointer; z-index: 9999; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: none;">
  ⚙️
</div>`;

  return (
    <div className="relative min-h-screen">
      <Background />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-bold">
            <ArrowLeft size={16} /> Back to Home
          </a>
          <div className="font-display font-bold md:text-xl tracking-tighter">
            AJAY<span className="text-brand-blue">.</span>KUMAR
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto space-y-16">
          
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass mb-6">
              <ShieldCheck size={14} className="text-brand-green" />
              <span className="text-xs font-mono text-white/70 uppercase tracking-wider">Official Documentation</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              GTM Consent Mode <span className="text-brand-blue">(v2)</span> Template
            </h1>
            <p className="text-xl text-white/60 leading-relaxed">
              This template provides a lightweight, automated solution for managing Google Consent Mode (v2). 
              It acts as a bridge between the browser's cookie storage, the Data Layer, and GTM's internal consent engine. 
              It ensures that user privacy preferences are respected instantly upon interaction without requiring a page reload.
            </p>
          </motion.header>

          {/* Core Functionalities */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl font-display font-bold flex items-center gap-3">
              <Settings className="text-brand-blue" /> Core Functionalities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Automatic Dual-Source Detection',
                  icon: Database,
                  color: 'text-brand-blue',
                  desc: 'The template intelligently prioritizes "live" interaction data from the dataLayer during an update event. If no live event is detected (such as on a fresh page load), it falls back to reading the persisted JSON cookie.'
                },
                {
                  title: 'Seamless "No-Reload" Updates',
                  icon: RefreshCw,
                  color: 'text-brand-green',
                  desc: 'By utilizing the copyFromDataLayer API, the template captures consent changes the moment they occur. This allows tags to trigger immediately after a user clicks "Accept" or "Preferences."'
                },
                {
                  title: 'Strict Fallback Logic',
                  icon: ShieldCheck,
                  color: 'text-brand-red',
                  desc: 'To ensure compliance, any missing or malformed data defaults to a denied state, preventing unauthorized tracking.'
                },
                {
                  title: 'Simplified Mapping',
                  icon: ListChecks,
                  color: 'text-brand-yellow',
                  desc: 'Eliminates the need for creating multiple manual Data Layer Variables in GTM. It automatically maps the four primary consent keys: ad_storage, analytics_storage, ad_user_data, ad_personalization.'
                }
              ].map((feature, i) => (
                <div key={i} className="glass p-6 rounded-3xl hover:bg-white/5 transition-colors">
                  <div className={cn("w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4", feature.color)}>
                    <feature.icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* How It Works */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl font-display font-bold flex items-center gap-3">
              <Zap className="text-brand-yellow" /> How It Works
            </h2>
            <div className="glass p-8 rounded-3xl space-y-8">
              <div className="relative pl-8 border-l border-white/10">
                <div className="absolute left-[-17px] top-0 w-8 h-8 rounded-full bg-[#111] border border-white/20 flex items-center justify-center font-mono text-xs text-brand-blue">01</div>
                <h3 className="text-xl font-bold mb-2">Default State</h3>
                <p className="text-white/60 text-sm">On Consent Initialization, the tag reads the <code>nalla_consent_preferences</code> cookie. If the user is new, it sets the initial state to denied.</p>
              </div>
              <div className="relative pl-8 border-l border-white/10">
                <div className="absolute left-[-17px] top-0 w-8 h-8 rounded-full bg-[#111] border border-white/20 flex items-center justify-center font-mono text-xs text-brand-green">02</div>
                <h3 className="text-xl font-bold mb-2">User Interaction</h3>
                <p className="text-white/60 text-sm">When a user interacts with the banner, the banner script saves the cookie and pushes a <code>user_consent_update</code> event to the Data Layer.</p>
              </div>
              <div className="relative pl-8 border-l border-transparent">
                <div className="absolute left-[-17px] top-0 w-8 h-8 rounded-full bg-[#111] border border-white/20 flex items-center justify-center font-mono text-xs text-brand-red">03</div>
                <h3 className="text-xl font-bold mb-2">Instant Update</h3>
                <p className="text-white/60 text-sm">The template catches this event, extracts the new statuses directly from the Data Layer push, and executes an update command to GTM's Consent Mode.</p>
              </div>
            </div>
          </motion.section>

          {/* Technical Requirements */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-display font-bold flex items-center gap-3">
              <Database className="text-white" /> Technical Requirements
            </h2>
            <div className="glass p-8 rounded-3xl border-brand-green/20 space-y-4">
              <p className="text-white/80">
                <strong className="text-white">Permissions:</strong> Requires "Access Cookies" (for <code>nalla_consent_preferences</code>) and "Access Data Layer" (Wildcard or specific keys) enabled in the template settings.
              </p>
              <p className="text-white/80">
                <strong className="text-white">Cookie Format:</strong> Expects a JSON stringified object:
              </p>
              <div className="bg-black/50 p-4 rounded-xl border border-white/10 font-mono text-sm text-brand-green">
                &#123;"ad_storage":"granted", "analytics_storage":"granted", ...&#125;
              </div>
            </div>
          </motion.section>

          {/* Setup Code */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-display font-bold flex items-center gap-3">
              <Code2 className="text-brand-blue" /> Setup Instructions
            </h2>
            <p className="text-white/60">
              Include the following code snippets in the <code>&lt;head&gt;</code> section of your website across all pages.
            </p>

            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4 text-white/90">1. Cookie Banner HTML Code</h3>
              <p className="text-sm text-white/50 mb-2">This is the visual consent banner presented to the user.</p>
              <CodeBlock code={htmlBannerCode} language="html" />
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4 text-white/90">2. Consent Logic Script</h3>
              <p className="text-sm text-white/50 mb-2">Handles browser cookie storage, Data Layer pushes, and UI toggling.</p>
              <CodeBlock code={scriptCode} language="html" />
            </div>
          </motion.section>

        </div>
      </main>
    </div>
  );
}
