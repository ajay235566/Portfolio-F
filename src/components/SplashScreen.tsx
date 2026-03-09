import React from 'react';
import { motion } from 'framer-motion';
import { SplashLogo } from './SplashLogo';

export const SplashScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed inset-0 bg-[#050505] z-[100] flex items-center justify-center p-6"
    >
      <div className="w-full max-w-4xl flex items-center justify-center">
        <SplashLogo />
      </div>
    </motion.div>
  );
};
