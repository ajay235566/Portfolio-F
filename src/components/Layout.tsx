import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { SplashScreen } from './SplashScreen';
import { Navbar } from './Navbar';
import { trackEvent } from '../lib/analytics';

interface LayoutProps {
  children: React.ReactNode;
}

const ParallaxBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-blue/10 blur-[120px] rounded-full opacity-50 dark:opacity-100 transition-opacity duration-300" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-red/10 blur-[120px] rounded-full opacity-50 dark:opacity-100 transition-opacity duration-300" />
    <div className="absolute inset-0 grid-pattern opacity-20" />
  </div>
);

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
    trackEvent({
      action: 'toggle_theme',
      category: 'UX',
      label: theme === 'light' ? 'dark' : 'light'
    });
  };

  const [showSplash, setShowSplash] = useState(() => {
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
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-bg-primary text-text-primary transition-colors duration-300">
      <AnimatePresence mode="wait">
        {showSplash && <SplashScreen key="splash" />}
      </AnimatePresence>
      
      <ParallaxBackground />
      
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      
      <main className="relative z-10">
        {children}
      </main>
    </div>
  );
};
