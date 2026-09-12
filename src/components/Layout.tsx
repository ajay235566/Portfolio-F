import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import LanyardSplash from './LanyardSplash';
import { Navbar } from './Navbar';
import PokemonCursor from './PokemonCursor';
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
      const isMobile = window.innerWidth < 1024 || window.matchMedia('(max-width: 1023px)').matches;
      if (isMobile) return false;
      return !sessionStorage.getItem('splash_seen');
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024 || window.matchMedia('(max-width: 1023px)').matches) {
        setShowSplash(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Splash screen is now interaction-driven. User must drag the lanyard to enter on desktop.

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-bg-primary text-text-primary transition-colors duration-300">
      {showSplash && (
        <div className="hidden lg:block fixed inset-0 w-[100vw] h-[100vh] z-[999999] bg-[#050505] overflow-hidden m-0 p-0">
          <LanyardSplash 
            onComplete={() => {
              setShowSplash(false);
              sessionStorage.setItem('splash_seen', 'true');
            }} 
          />
        </div>
      )}
      <ParallaxBackground />
      <PokemonCursor />
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main className="relative z-10">
        {children}
      </main>
    </div>
  );
};
