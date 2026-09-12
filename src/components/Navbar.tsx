import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Phone } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '../lib/utils';
import { trackEvent } from '../lib/analytics';

interface NavbarProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'About', href: '#about' },
    { name: 'Experience', href: '#experience' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Ads Architecture', href: '#ads-showcase', isSpecial: true },
    { name: 'Freelance', href: '#freelance' },
    { name: 'Blog', href: '#blog' }
  ];

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300 px-6 py-4",
      scrolled ? "glass py-3" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="font-display font-bold text-xl tracking-tighter"
          onClick={() => window.location.hash = ''}
          style={{ cursor: 'pointer' }}
        >
          AJAY<span className="text-brand-blue">.</span>KUMAR
        </motion.div>
 
        <div className="hidden md:flex gap-7 text-sm font-medium text-text-secondary items-center">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={cn(
                "transition-colors",
                item.isSpecial
                  ? "text-brand-blue hover:text-white px-3 py-1 rounded-full border border-brand-blue/30 bg-brand-blue/10 flex items-center gap-1.5 font-semibold"
                  : "hover:text-text-primary"
              )}
            >
              {item.isSpecial && <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />}
              {item.name}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          
          <motion.a
            href="mailto:ajayignited@gmail.com"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-2 rounded-full bg-text-primary text-bg-primary text-sm font-bold flex items-center gap-2"
          >
            Hire Me <ChevronRight size={16} />
          </motion.a>
          
          <motion.a
            href="tel:+919952917578"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-8 h-8 rounded-full glass flex items-center justify-center text-text-primary hover:text-brand-blue transition-colors"
            onClick={() => trackEvent({ action: 'click', category: 'Engagement', label: 'Call Nav' })}
          >
            <Phone size={16} />
          </motion.a>
        </div>
      </div>
    </nav>
  );
};
