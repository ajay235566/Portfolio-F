const fs = require('fs');

const svgCode = fs.readFileSync('c:/Users/PC/Downloads/Ajay.svg', 'utf8');

// replace <svg> with <motion.svg>
let reactSvg = svgCode.replace(/<svg([^>]+)>/, '<motion.svg$1 initial="hidden" animate={isVisible ? \'visible\' : \'hidden\'} variants={containerVariants} className="w-full h-full text-brand-blue" preserveAspectRatio="xMidYMid meet">');
reactSvg = reactSvg.replace(/<\/svg>/, '</motion.svg>');

// React properties
reactSvg = reactSvg.replace(/xmlns:xlink/g, 'xmlnsXlink');
reactSvg = reactSvg.replace(/xml:space/g, 'xmlSpace');
reactSvg = reactSvg.replace(/maskUnits/g, 'maskUnits'); // fine
reactSvg = reactSvg.replace(/fill-rule/g, 'fillRule');
reactSvg = reactSvg.replace(/clip-rule/g, 'clipRule');
reactSvg = reactSvg.replace(/stroke-width/g, 'strokeWidth');
reactSvg = reactSvg.replace(/stroke-linecap/g, 'strokeLinecap');
reactSvg = reactSvg.replace(/stroke-linejoin/g, 'strokeLinejoin');

// Handle both <path ... /> and <path ...></path>
reactSvg = reactSvg.replace(/<path([^>]*?)\/?>/g, (match, p1) => {
    if(p1.includes('fill=\"white\"')) return `<path${p1}/>`; 
    return `<motion.path${p1} variants={drawVariants} stroke="currentColor" strokeWidth="1" />`;
});

const tsxContent = `import React, { useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 1.25,
    }
  }
};

const drawVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { type: "tween", duration: 2.25, ease: "easeInOut" },
      opacity: { duration: 0.1 }
    }
  }
};

export const AnimatedSignature = () => {
  const ref = useRef(null);
  const isVisible = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="w-full flex justify-center items-center py-2 h-full">
      ${reactSvg}
    </div>
  );
};
`;

fs.writeFileSync('d:/portfolio/Portfolio/src/components/AnimatedSignature.tsx', tsxContent, 'utf8');
console.log('Successfully generated AnimatedSignature.tsx length:', tsxContent.length);
