const fs = require('fs');

const svgContent = fs.readFileSync('c:\\Users\\PC\\Downloads\\Frame 1 (1).svg', 'utf-8');
const pathMatch = svgContent.match(/<path d="([^"]+)"/);

if (pathMatch) {
  const pathD = pathMatch[1];
  
  const componentContent = `import React from 'react';
import { motion, Variants } from 'framer-motion';

const drawVariants: Variants = {
  hidden: { pathLength: 0, fill: "rgba(255, 255, 255, 0)", opacity: 0 },
  visible: {
    pathLength: 1,
    fill: "rgba(255, 255, 255, 1)",
    opacity: 1,
    transition: {
      pathLength: { duration: 3, ease: "easeInOut" },
      fill: { duration: 1, delay: 3, ease: "easeIn" },
      opacity: { duration: 0.2 }
    }
  }
};

export const SplashLogo = () => {
  return (
    <div className="w-full flex justify-center items-center h-full px-4">
      <motion.svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 694 136" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        className="max-w-2xl"
      >
        <motion.path 
          d="${pathD}"
          stroke="white"
          strokeWidth="1.5"
          variants={drawVariants}
          initial="hidden"
          animate="visible"
        />
      </motion.svg>
    </div>
  );
};
`;

  fs.writeFileSync('d:\\portfolio\\Portfolio\\src\\components\\SplashLogo.tsx', componentContent);
  console.log('SplashLogo.tsx generated successfully.');
} else {
  console.error('Could not find path in SVG');
}
