import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import {
  Github,
  Linkedin,
  Mail,
  Phone,
  ExternalLink,
  Code2,
  BarChart3,
  Cpu,
  Globe,
  ChevronRight,
  ArrowUpRight,
  Download,
  Award,
  BookOpen,
  Briefcase,
  Terminal,
  Zap,
  CheckCircle2,
  Send,
  User,
  MessageSquare,
  Box,
  ShieldCheck
} from 'lucide-react';
import { Scene3D } from './components/Scene3D';
import { AnimatedSignature } from './components/AnimatedSignature';
import { FramerVector } from './components/FramerVector';
import { SplashScreen } from './components/SplashScreen';
import { cn } from './lib/utils';

// --- Data ---

const SKILLS = [
  { name: 'Google Analytics (GA4)', category: 'Analytics', icon: BarChart3, color: 'text-brand-yellow' },
  { name: 'Google Tag Manager', category: 'Tracking', icon: Zap, color: 'text-brand-blue' },
  { name: 'Google Looker Studio', category: 'Visualization', icon: BarChart3, color: 'text-brand-green' },
  { name: 'Consent Mode & Enhanced Tracking', category: 'Compliance', icon: CheckCircle2, color: 'text-brand-blue' },
  { name: 'Offline Conversions & Customer Match', category: 'Advanced Ads', icon: Globe, color: 'text-brand-red' },
  { name: 'Google Tag Gateway', category: 'Infrastructure', icon: Cpu, color: 'text-white' },
  { name: 'Cost Data Import & Audiences', category: 'Strategy', icon: Terminal, color: 'text-brand-yellow' },
  { name: 'GTM Templates & Automation', category: 'Development', icon: Code2, color: 'text-brand-red' },
  { name: 'Website Design', category: 'Design & Development', icon: Globe, color: 'text-brand-blue' },
];

const CMS_EXPERTISE = [
  'Shopify', 'WordPress', 'Wix', 'Squarespace', 'Magento', 'Webflow', 'GoDaddy', 'BigCommerce',
  'HubSpot', 'Ghost', 'Strapi', 'Contentful', 'Drupal', 'Joomla', 'PrestaShop', 'Weebly'
];

const EXPERIENCE = [
  {
    company: 'Cognizant',
    role: 'Subject Matter Expert',
    description: 'Consulting for Google client projects (GCARE & GTECH). Specialized in architecting complex conversion tracking, GTM, and GA4 ecosystems.',
    highlights: [
      'Architected end-to-end conversion tracking strategies for high-value Google Ads clients.',
      'Optimized data collection workflows through advanced GTM configurations and server-side tagging.',
      'Implemented custom HTML for AJAX forms and iframe postMessage listeners.',
      'Resolved complex tracking issues and data discrepancies for enterprise-level accounts.',
      'Conducted Root Cause Analysis (RCA) for complex technical escalations to identify and resolve underlying tracking failures.',
      'Led technical training sessions on measurement best practices and advanced troubleshooting.'
    ]
  },
  {
    company: 'ZoomRX',
    role: 'Business Analyst Associate',
    description: 'Analyzed market trends and drug performance data for US-based pharmaceutical stakeholders.',
    highlights: [
      'Utilized Excel and Tableau for advanced data visualization and strategic reporting.',
      'Delivered comprehensive presentations to key stakeholders and clients.',
      'Summarized key data trends and provided actionable recommendations for market optimization.'
    ]
  }
];

const PROJECTS = [
  {
    title: 'Task Tracker',
    description: 'A comprehensive task management application built for high-performance tracking and productivity.',
    impact: 'Streamlined daily operations and improved task completion visibility.',
    tags: ['React', 'Productivity', 'Web App'],
    link: 'https://task-tracker-phi-umber.vercel.app/'
  },
  {
    title: 'GTM Automation Tool',
    description: 'Advanced automation tool for Google Tag Manager to streamline measurement implementation.',
    impact: 'Reduced manual configuration time and minimized human error in tracking.',
    tags: ['Automation', 'GTM', 'Efficiency'],
    link: 'https://gtm-automation-omega.vercel.app/'
  },
  {
    title: 'OneDoc - CaseNote Automator',
    description: 'A productivity tool for Technical Solutions Team (GTech) that standardizes and automates case note documentation.',
    impact: 'Reduced documentation time by 50-60%, saving ~60 mins per agent daily.',
    tags: ['Automation', 'Productivity', 'Internal Tool'],
    link: '#'
  },
  {
    title: 'GTM Consent Mode (v2) Template',
    description: 'A lightweight, automated template for managing Google Consent Mode (v2) across your site. Perfect compliance without performance drops.',
    impact: 'Ensures user privacy preferences are respected instantly upon interaction.',
    tags: ['GTM', 'Consent Mode', 'Template'],
    link: '#gtm-consent-template'
  }
];

const EDUCATION = []; // Removed education data

// --- Components ---

const SectionHeading = ({ children, subtitle }: { children: React.ReactNode, subtitle?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className="mb-6 md:mb-8"
  >
    <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
      {children}
    </h2>
    {subtitle && (
      <p className="text-white/50 font-mono text-sm uppercase tracking-widest">
        {subtitle}
      </p>
    )}
  </motion.div>
);

const ParallaxBackground = () => {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 45]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div
        style={{ y: y1, rotate }}
        className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-blue/10 blur-[120px] rounded-full"
      />
      <motion.div
        style={{ y: y2, rotate: -rotate }}
        className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-red/10 blur-[120px] rounded-full"
      />
      <div className="absolute inset-0 grid-pattern opacity-20" />
    </div>
  );
};

const ContactForm = () => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => setStatus('sent'), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass p-8 md:p-12 rounded-[2.5rem] border-white/10 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Send size={120} className="rotate-12" />
      </div>

      <div className="relative z-10">
        <h3 className="text-3xl font-display font-bold mb-2">Get in Touch</h3>
        <p className="text-white/50 mb-8">Have a project in mind? Let's discuss how we can work together.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-mono text-white/40 uppercase ml-1">Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input
                  required
                  type="text"
                  placeholder="John Doe"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-brand-blue transition-colors text-white placeholder:text-white/20"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono text-white/40 uppercase ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input
                  required
                  type="email"
                  placeholder="john@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-brand-blue transition-colors text-white placeholder:text-white/20"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-white/40 uppercase ml-1">Message</label>
            <div className="relative">
              <MessageSquare className="absolute left-4 top-6 text-white/20" size={18} />
              <textarea
                required
                rows={4}
                placeholder="help me with your queries..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-brand-blue transition-colors text-white placeholder:text-white/20 resize-none"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={status !== 'idle'}
            className={cn(
              "w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-300",
              status === 'sent' ? "bg-brand-green text-white" : "bg-brand-blue text-white shadow-lg shadow-brand-blue/20"
            )}
          >
            {status === 'idle' && (
              <>Send Message <Send size={18} /></>
            )}
            {status === 'sending' && (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {status === 'sent' && (
              <>Message Sent! <CheckCircle2 size={18} /></>
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [showSplash, setShowSplash] = useState(() => {
    // Only show splash if haven't seen in this session
    if (typeof window !== 'undefined') {
      return !sessionStorage.getItem('splash_seen');
    }
    return true;
  });

  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem('splash_seen', 'true');
      }, 5000); // 5 seconds
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <AnimatePresence mode="wait">
        {showSplash && <SplashScreen key="splash" />}
      </AnimatePresence>
      <ParallaxBackground />

      {/* Navigation */}
      <nav className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 px-6 py-4",
        scrolled ? "glass py-3" : "bg-transparent"
      )}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-display font-bold text-xl tracking-tighter"
          >
            AJAY<span className="text-brand-blue">.</span>KUMAR
          </motion.div>

          <div className="hidden md:flex gap-8 text-sm font-medium text-white/70">
            {['About', 'Experience', 'Skills', 'Projects', 'Freelance', 'Blog'].map((item) => (
              <a
                key={item}
                href={item === 'Blog' ? '#' : `#${item.toLowerCase()}`}
                className="hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <motion.a
              href="/AjayKumarNallamothu.pdf"
              download
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden sm:flex items-center gap-2 text-sm font-bold text-white/70 hover:text-white transition-colors"
            >
              Resume <Download size={16} />
            </motion.a>
            <motion.a
              href="mailto:ajayignited@gmail.com"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2 rounded-full bg-white text-black text-sm font-bold flex items-center gap-2"
            >
              Hire Me <ChevronRight size={16} />
            </motion.a>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col justify-center px-6 pt-20">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass mb-6">
                    <ArrowUpRight size={14} className="text-brand-green animate-pulse" />
                    <span className="text-xs font-mono text-white/70 uppercase tracking-wider">Available for new opportunities</span>
                  </div>

                  <h1 className="text-5xl md:text-8xl font-display font-bold tracking-tight mb-8 leading-[1.1] md:leading-[0.9] flex flex-col">
                    <span>SUBJECT</span>
                    <span className="text-gradient">MATTER</span>
                    <span>EXPERT</span>
                  </h1>

                  <p className="text-xl md:text-2xl text-white/60 max-w-2xl mb-10 leading-relaxed">
                    I bridge the gap between complex data tracking and business growth.
                    Specializing in <span className="text-white">Google Ads</span>, <span className="text-white">Analytics</span>, and <span className="text-white">Automation</span>.
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                      className="px-8 py-4 rounded-2xl bg-brand-blue text-white font-bold flex items-center gap-3 shadow-lg shadow-brand-blue/20"
                    >
                      View Projects <Zap size={18} />
                    </motion.button>
                    <motion.button
                      onClick={() => document.getElementById('freelance')?.scrollIntoView({ behavior: 'smooth' })}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-8 py-4 rounded-2xl glass text-white font-bold flex items-center gap-3"
                    >
                      Freelance & Training <ArrowUpRight size={18} />
                    </motion.button>
                    <motion.a
                      href="/AjayKumarNallamothu.pdf"
                      download
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-8 py-4 rounded-2xl border border-brand-green/30 bg-brand-green/5 text-brand-green font-bold flex items-center gap-3 hover:bg-brand-green/10 transition-colors"
                    >
                      Download Resume <Download size={18} />
                    </motion.a>
                  </div>
                </motion.div>
              </div>

              <div className="lg:col-span-5 relative">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="w-full relative h-[650px]"
                >
                  <div className="w-full h-full absolute inset-0 z-10">
                    <Scene3D />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <motion.section
          id="about"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="py-10 md:py-12 px-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
              <SectionHeading subtitle="The Strategy">About Me</SectionHeading>
              <div className="space-y-6 text-lg text-white/70 leading-relaxed">
                <p>
                  I am a results-driven <span className="text-white font-medium">Technical Consultant</span> specializing in advanced measurement strategy and implementation.
                  My expertise lies in architecting robust tracking solutions that bridge the gap between raw data and actionable business intelligence.
                </p>
                <p>
                  Currently, I serve as a <span className="text-white font-medium">Subject Matter Expert</span> at Cognizant, where I consult for global clients on complex tracking ecosystems.
                  My technical depth extends across all major CMS platforms including <span className="text-white">Shopify, WordPress, Wix, Squarespace, and Magento</span>.
                </p>
                <p>
                  I am also available for <span className="text-brand-blue font-medium">freelance consulting</span> and <span className="text-brand-green font-medium">technical training</span>, helping businesses and teams master the modern measurement stack.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Experience Section */}
        <motion.section
          id="experience"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="py-10 md:py-12 px-6 bg-white/[0.02]"
        >
          <div className="max-w-7xl mx-auto">
            <SectionHeading subtitle="Career Path">Professional Experience</SectionHeading>

            <div className="space-y-12">
              {EXPERIENCE.map((exp, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="relative pl-8 md:pl-12 border-l border-white/10"
                >
                  <div className="absolute left-[-8px] top-0 w-4 h-4 flex items-center justify-center bg-[#050505]">
                    <ChevronRight size={16} className="text-brand-blue" />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4">
                      <h3 className="text-2xl font-display font-bold">{exp.company}</h3>
                      <p className="text-white/60 font-medium">{exp.role}</p>
                    </div>
                    <div className="lg:col-span-8">
                      <p className="text-white/80 mb-6">{exp.description}</p>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {exp.highlights.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-white/50">
                            <ChevronRight size={14} className="text-brand-green shrink-0 mt-1" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Skills Section */}
        <motion.section
          id="skills"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="py-10 md:py-12 px-6"
        >
          <div className="max-w-7xl mx-auto">
            <SectionHeading subtitle="Technical Stack">Expertise & Skills</SectionHeading>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SKILLS.map((skill, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -5 }}
                  className="p-8 rounded-3xl glass group transition-all duration-300 hover:bg-white/10"
                >
                  <div className={cn("w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform", skill.color)}>
                    <skill.icon size={24} />
                  </div>
                  <p className="text-xs font-mono text-white/40 uppercase mb-2">{skill.category}</p>
                  <h3 className="text-xl font-display font-bold">{skill.name}</h3>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Freelance & Training Section */}
        <motion.section
          id="freelance"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="py-10 md:py-12 px-6 bg-brand-blue/[0.03]"
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <SectionHeading subtitle="Services">Freelance & Training</SectionHeading>
                <div className="space-y-8">
                  <div className="glass p-8 rounded-3xl border-brand-blue/20">
                    <h3 className="text-2xl font-display font-bold mb-4 flex items-center gap-3">
                      <Globe className="text-brand-blue" /> Precision Analytics
                    </h3>
                    <p className="text-white/60 mb-6">
                      End-to-end measurement consulting for businesses. I specialize in setting up advanced tracking for complex ecosystems, ensuring data accuracy across all touchpoints.
                    </p>
                    <ul className="space-y-3 mb-8">
                      {[
                        'Custom GTM Implementation',
                        'GA4 Migration & Audits',
                        'Looker Studio Dashboarding',
                        'Consent Mode Verification',
                        'Server-Side Tagging'
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                          <ChevronRight size={14} className="text-brand-blue" /> {item}
                        </li>
                      ))}
                    </ul>
                    <a
                      href="https://precison-analytics.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-brand-blue font-bold hover:underline"
                    >
                      Visit Precision Analytics <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="glass p-8 rounded-3xl border-brand-green/20">
                  <h3 className="text-2xl font-display font-bold mb-4 flex items-center gap-3">
                    <BookOpen className="text-brand-green" /> Technical Training
                  </h3>
                  <p className="text-white/60 mb-6">
                    Empowering teams with the knowledge to manage their own measurement stack. I provide tailored training sessions for agencies and in-house teams.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      'Conversion Tracking',
                      'GTM Mastery',
                      'GA4 Deep Dive',
                      'Looker Studio',
                      'Enhanced Conversions',
                      'Audience Building'
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-white/5 text-xs font-medium">
                        <CheckCircle2 size={14} className="text-brand-green" /> {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass p-8 rounded-3xl">
                  <h4 className="text-sm font-mono text-white/40 uppercase mb-4 tracking-widest">CMS Ecosystem Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {CMS_EXPERTISE.map(cms => (
                      <span key={cms} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-white/70 hover:bg-brand-blue/20 hover:border-brand-blue/30 hover:text-white transition-all duration-300 cursor-default">
                        {cms}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Projects Section */}
        <motion.section
          id="projects"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="py-10 md:py-12 px-6"
        >
          <div className="max-w-7xl mx-auto">
            <SectionHeading subtitle="Featured Work">Key Projects</SectionHeading>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {PROJECTS.map((project, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group relative p-1 rounded-[2rem] overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-blue to-brand-red opacity-20 group-hover:opacity-40 transition-opacity" />
                  <div className="relative h-full glass rounded-[1.9rem] p-10 flex flex-col">
                    <div className="flex justify-between items-start mb-8">
                      <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                        <Award size={28} className="text-brand-yellow" />
                      </div>
                      <div className="flex gap-2">
                        {project.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 rounded-md bg-white/5 text-[10px] font-mono text-white/40 uppercase">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <h3 className="text-3xl font-display font-bold mb-4">{project.title}</h3>
                    <p className="text-white/60 mb-8 flex-grow">{project.description}</p>

                    <div className="p-4 rounded-2xl bg-brand-green/10 border border-brand-green/20 mb-8">
                      <p className="text-xs font-mono text-brand-green uppercase mb-1">Impact</p>
                      <p className="text-sm font-medium text-white/90">{project.impact}</p>
                    </div>

                    <a href={project.link} className="inline-flex items-center gap-2 text-sm font-bold group-hover:text-brand-blue transition-colors">
                      View Case Study <ExternalLink size={16} />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Hobbies Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="py-10 md:py-12 px-6"
        >
          <div className="max-w-7xl mx-auto">
            <SectionHeading subtitle="Life Beyond Work">Interests</SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="md:col-span-2 p-8 rounded-3xl glass flex flex-col justify-between group hover:bg-brand-blue/5 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center mb-6">
                  <Globe size={24} className="text-brand-blue" />
                </div>
                <div>
                  <h3 className="text-2xl font-display font-bold mb-2">Global Exploration</h3>
                  <p className="text-white/50 text-sm">Traveling to new cultures and environments to gain fresh perspectives on problem-solving and life.</p>
                </div>
              </div>

              <div className="p-8 rounded-3xl glass flex flex-col justify-between group hover:bg-brand-red/5 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-brand-red/10 flex items-center justify-center mb-6">
                  <BookOpen size={24} className="text-brand-red" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold mb-2">Manga & Art</h3>
                  <p className="text-white/50 text-xs">Appreciating visual storytelling and complex narratives through Japanese manga.</p>
                </div>
              </div>

              <div className="p-8 rounded-3xl glass flex flex-col justify-between group hover:bg-brand-green/5 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-brand-green/10 flex items-center justify-center mb-6">
                  <Cpu size={24} className="text-brand-green" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold mb-2">AI Agents</h3>
                  <p className="text-white/50 text-xs">Experimenting with autonomous agents to automate complex cognitive tasks.</p>
                </div>
              </div>

              <div className="md:col-span-2 lg:col-span-1 p-8 rounded-3xl glass flex flex-col justify-between group hover:bg-brand-yellow/5 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-brand-yellow/10 flex items-center justify-center mb-6">
                  <Zap size={24} className="text-brand-yellow" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold mb-2">N8N Workflows</h3>
                  <p className="text-white/50 text-xs">Building intricate automation pipelines to connect disparate data sources.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          id="contact"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="py-10 md:py-12 px-6"
        >
          <div className="max-w-4xl mx-auto">
            <SectionHeading subtitle="Get in Touch">Contact</SectionHeading>
            <ContactForm />
          </div>
        </motion.section>

        {/* Footer / Contact */}
        <footer className="py-10 md:py-12 px-6 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-12">
              <div className="text-center md:text-left flex flex-col gap-2">
                <h2 className="text-4xl font-display font-bold mb-4">Let's build something <br /><span className="text-brand-blue">impactful</span>.</h2>
                <div className="w-48 h-auto mt-2 hidden md:block">
                  <FramerVector />
                </div>
              </div>

              <div className="flex flex-col items-center md:items-end gap-6">
                <div className="flex gap-4">
                  <a href="https://github.com/ajay235566" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-2xl glass flex items-center justify-center hover:bg-brand-blue transition-colors group">
                    <Github size={24} className="group-hover:scale-110 transition-transform" />
                  </a>
                  <a href="mailto:ajayignited@gmail.com" className="w-14 h-14 rounded-2xl glass flex items-center justify-center hover:bg-brand-blue transition-colors group">
                    <Mail size={24} className="group-hover:scale-110 transition-transform" />
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-2xl glass flex items-center justify-center hover:bg-brand-blue transition-colors group">
                    <Linkedin size={24} className="group-hover:scale-110 transition-transform" />
                  </a>
                  <a href="tel:+919952917578" className="w-14 h-14 rounded-2xl glass flex items-center justify-center hover:bg-brand-blue transition-colors group">
                    <Phone size={24} className="group-hover:scale-110 transition-transform" />
                  </a>
                </div>
                <p className="text-xs text-white/20 font-mono">© 2025 AJAY KUMAR NALLAMOTHU. ALL RIGHTS RESERVED.</p>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
