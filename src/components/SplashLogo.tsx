import React from 'react';
import { motion, Variants } from 'framer-motion';

const drawVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 4, ease: "linear" },
      opacity: { duration: 0.2 }
    }
  }
};

const dotVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      delay: 3,
      duration: 1,
      ease: "easeOut"
    }
  }
};

export const SplashLogo = () => {
  return (
    <div className="w-full flex justify-center items-center h-full px-4">
      <motion.svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 937 297" 
        fill="transparent" 
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        className="max-w-4xl text-brand-blue"
      >
        <motion.path 
          d="M 8.807 130.513 C 8.807 130.513 -16.109 159.538 17.875 166.98 C 51.859 174.422 115.775 121.877 115.775 121.877 L 214.356 39.346 C 214.356 39.346 222.094 33.108 230.404 27.83 C 238.715 22.552 240.148 21.832 251.037 17.274 C 256.482 14.995 259.061 14.215 261.354 13.435 C 263.647 12.655 265.653 11.876 273.963 9.597 C 290.584 5.038 316.376 0 316.376 0"
          transform="translate(79 27)"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={drawVariants}
          initial="hidden"
          animate="visible"
        />

        <motion.path 
          d="M 4.523 45.913 C 4.523 45.913 0.776 42.413 0.096 37.565 C -0.585 32.718 2.435 27.566 6.774 22.956 C 8.943 20.652 14.431 16.356 21.108 13.565 C 27.785 10.775 40.1 7.08 49.755 5.217 C 65.902 0.847 112.112 2.636 167.358 0 C 120.412 54.338 95.154 82.585 76.894 116.869 C 67.765 134.012 56.142 165.894 78.402 166.956 C 89.532 167.487 107.193 159.263 122.126 149.217 C 137.06 139.171 149.266 127.304 149.266 127.304"
          transform="translate(228.018 27)"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={drawVariants}
          initial="hidden"
          animate="visible"
        />

        <motion.path 
          d="M 0.086 30.709 C 0.086 30.709 -1.84 17.255 12.531 11.516 C 16.123 10.081 34.192 5.219 48.144 4.798 C 62.097 4.378 77.665 6.479 95.142 5.758 C 99.511 5.578 119.605 5.433 135.262 5.758 C 150.92 6.083 155.385 6.08 159.334 3.839 C 163.283 1.597 166.212 0 166.212 0"
          transform="translate(154.655 96.095)"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={drawVariants}
          initial="hidden"
          animate="visible"
        />

        <motion.path 
          d="M 0.295 140.975 C 0.295 140.975 -2.516 162.332 9.215 174.563 C 20.947 186.795 58.857 181.232 75.212 171.685 C 91.568 162.137 125.465 143.272 144.727 102.589 C 163.989 61.906 174.032 37.812 188.286 14.301 C 202.541 -9.211 204.04 3.354 204.04 3.354"
          transform="translate(255.529 67.306)"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={drawVariants}
          initial="hidden"
          animate="visible"
        />

        {/* The dot above the "j" / "i" */}
        <motion.path 
          d="M 11.506 0 C 17.861 0 23.012 3.563 23.012 7.958 C 23.012 12.352 17.861 15.915 11.506 15.915 C 5.151 15.915 0 12.352 0 7.958 C 0 3.563 5.151 0 11.506 0 Z"
          transform="translate(452.5 29.5) rotate(-33 11.506 7.958)"
          fill="currentColor"
          variants={dotVariants}
          initial="hidden"
          animate="visible"
        />

        <motion.path 
          d="M 103.166 1.23 C 103.166 1.23 80.85 -2.785 61.363 3.693 C 41.876 10.17 12.642 49.733 4.5 61.169 C -3.642 72.606 -2.637 84.93 23.615 69.806 C 49.867 54.682 103.166 1.23 103.166 1.23 Z"
          transform="translate(450.398 71.144)"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={drawVariants}
          initial="hidden"
          animate="visible"
        />

        <motion.path 
          d="M 73.422 0 C 73.422 0 9.802 90.667 45.271 70.055 C 63.005 59.749 83.806 41.265 83.806 41.265 L 97.562 27.83 L 107.878 18.234 L 117.048 10.556 C 117.048 10.556 127.365 1.919 127.365 8.637 C 127.365 15.355 119.628 26.87 114.756 37.427 C 109.884 47.983 110.744 44.624 107.878 52.781 C 106.445 56.86 100.794 69.249 107.878 70.055 C 114.962 70.861 135.927 57.206 145.706 49.902 C 155.484 42.599 160.418 34.447 169.778 24.951 C 179.138 15.455 199.581 -10.556 192.704 4.798 C 185.826 20.153 138.203 123.36 114.756 142.989 C 91.309 162.619 85.239 167.7 59.734 172.738 C 53.358 173.998 42.466 174.838 33.242 172.738 C 24.018 170.639 16.462 165.601 12.736 163.142 C -2.166 153.305 0.127 133.392 0.127 133.392"
          transform="translate(477.909 74.983)"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={drawVariants}
          initial="hidden"
          animate="visible"
        />
        
      </motion.svg>
    </div>
  );
};
