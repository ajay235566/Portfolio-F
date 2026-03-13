import React from 'react';
import { motion } from 'framer-motion';
import { SplashLogo } from './SplashLogo';
import Lanyard from './Lanyard';
import { Suspense } from 'react';

export const SplashScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed inset-0 bg-[#050505] z-[100] flex items-center justify-center overflow-hidden"
    >
      <div className="w-full h-full flex items-center justify-center">
        <Suspense fallback={<SplashLogo />}>
          <Lanyard position={[0, 0, 32]} gravity={[0, -40, 0]} />
        </Suspense>
      </div>
    </motion.div>
  );
};
