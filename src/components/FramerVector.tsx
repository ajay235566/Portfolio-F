import React, { useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    }
  }
};

const getDrawVariants = (isSplash: boolean): Variants => ({
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: {
        type: "tween",
        delay: 0,
        duration: isSplash ? 4.5 : 3,
        ease: [0.44, 0, 0.56, 1],
        repeat: isSplash ? 0 : Infinity,
        repeatType: "loop"
      },
      opacity: { duration: 0.1 }
    }
  }
});

const getDotVariants = (isSplash: boolean): Variants => ({
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "tween",
      delay: isSplash ? 3.5 : 2,
      duration: 0.5,
      repeat: isSplash ? 0 : Infinity,
      repeatType: "loop",
      repeatDelay: 1 + 1.5
    }
  }
});

interface Props {
  isSplash?: boolean;
}

export const FramerVector = ({ isSplash = false }: Props) => {
  const ref = useRef(null);
  const isVisible = useInView(ref, { once: true, margin: "-50px" });

  const customDrawVariants = getDrawVariants(isSplash);
  const customDotVariants = getDotVariants(isSplash);

  return (
    <div ref={ref} className="w-full flex justify-center items-center py-2 h-full">
      <motion.svg
        width="130"
        height="88"
        viewBox="0 0 130 88"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial="hidden"
        animate={isVisible ? 'visible' : 'hidden'}
        variants={containerVariants}
        className="w-full h-full text-brand-blue"
        preserveAspectRatio="xMidYMid meet"
      >
        <g transform="translate(2 1)">
          <g transform="translate(0 0)"> {/* Updated transform in the inner group based on the new SVG payload */}
            {/* <motion.path 
              d="M 0.953 42.484 L 0.715 43.215 L 0.477 43.947 L 0.238 44.678 L 0 45.409 L 0 46.141 L 0 46.872 L 0.238 47.604 L 0.477 48.335 L 1.192 49.067 L 1.907 49.798 L 2.622 50.042 L 3.337 50.286 L 4.291 50.286 L 5.244 50.286 L 6.198 50.286 L 7.151 50.286 L 8.105 50.042 L 9.058 49.798 L 10.012 49.554 L 10.965 49.31 L 11.918 48.823 L 12.872 48.335 L 14.302 47.604 L 15.732 46.872 L 16.924 46.141 L 18.116 45.409 L 19.07 44.678 L 20.023 43.947 L 20.977 43.215 L 21.93 42.484 C 21.93 42.484 22.407 42.118 22.883 41.752 C 23.36 41.387 23.837 41.021 23.837 41.021 C 23.837 41.021 24.075 40.868 24.433 40.609 C 24.612 40.48 24.82 40.324 25.044 40.147 C 25.267 39.969 25.506 39.771 25.744 39.558 C 25.982 39.345 26.221 39.116 26.444 38.893 C 26.668 38.67 26.876 38.453 27.055 38.263 C 27.412 37.882 27.651 37.607 27.651 37.607 L 28.485 36.876 L 29.319 36.145 L 30.154 35.413 L 30.988 34.682 L 32.18 33.463 L 33.372 32.244 L 35.04 30.781 L 36.709 29.318 L 38.139 27.855 L 39.569 26.392 L 41 24.929 L 42.43 23.466 L 46.244 19.565 L 49.104 16.152 L 51.965 13.714 L 55.302 11.276 L 59.116 9.325 L 61.023 8.35 L 63.406 7.863 L 65.743 7.349 L 68.65 6.4 L 71.034 5.424 L 70.062 5.902 M 40.401 19.073 L 39.957 17.122 L 40.401 15.659 L 40.845 14.196 L 41.289 12.734 L 42.176 11.758 L 43.064 10.783 L 44.84 9.808 L 46.616 8.833 L 48.836 8.345 L 51.056 7.857 L 52.832 7.857 L 55.495 7.857 L 58.159 7.857 L 59.935 7.857 L 62.155 7.857 L 63.931 7.857 M 15.983 35.652 L 15.983 34.189 L 16.427 33.214 L 16.871 32.726 L 17.759 31.751 L 18.646 31.263 L 19.534 30.776 L 20.422 30.288 L 21.754 29.8 L 23.53 29.313 L 25.306 29.313 L 27.082 29.313 L 28.858 29.313 L 30.633 29.313 L 31.965 29.313 L 33.741 29.313 L 35.073 29.313 L 36.849 29.313 L 39.069 29.313 L 39.957 29.313 L 41.733 29.313 L 43.508 29.313 L 44.396 29.313 L 46.172 29.313 L 47.948 29.313 L 49.724 28.825 L 51.056 28.337 L 51.944 27.362 M 66.15 7.857 L 64.375 10.783 L 62.599 13.709 L 60.823 16.634 L 59.047 19.56 L 57.271 23.461 L 55.051 27.362 L 53.276 31.263 L 51.056 36.139 L 49.28 41.016 L 47.504 46.379 L 47.06 49.793 L 47.06 51.256 L 47.504 52.231 L 48.392 52.719 L 49.724 52.719 L 51.056 51.743 L 52.388 50.768 L 53.72 49.793 L 55.051 48.33 L 55.939 47.355 L 56.827 46.379 L 57.715 44.917 L 58.603 43.941 L 59.491 42.478 M 39.463 55.833 L 39.463 56.897 L 39.463 57.96 L 39.463 59.556 L 39.929 61.151 L 40.395 62.746 L 41.328 63.81 L 42.26 64.873 L 43.192 65.937 L 44.124 66.468 L 45.988 67 L 47.852 67 L 50.648 67 L 52.047 66.468 L 53.445 65.937 L 54.377 65.405 L 55.309 64.873 L 57.173 63.81 L 59.037 62.746 L 60.435 61.151 L 61.834 59.556 L 63.232 57.96 L 64.164 56.897 L 65.096 55.302 L 66.494 53.175 L 67.892 50.516 L 69.29 47.857 L 70.688 45.198 L 71.621 43.071 L 72.553 40.944 L 73.485 38.817 L 73.951 37.222 L 74.417 35.627 L 74.883 34.032 L 75.815 30.841 L 77.213 27.119 L 78.145 24.46 L 79.077 21.802 L 80.009 19.675 L 80.941 17.548 L 81.874 16.484 L 83.272 15.421 L 84.204 14.889 L 85.602 14.357 M 87.83 0 C 89.117 0 90.16 0.952 90.16 2.127 C 90.16 3.302 89.117 4.254 87.83 4.254 C 86.543 4.254 85.5 3.302 85.5 2.127 C 85.5 0.952 86.543 0 87.83 0 Z"
              fill="transparent" 
              variants={customDrawVariants} 
              stroke="currentColor" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1} 
            /> */}
            <motion.path
              d="M 0.953 37.059 L 0.715 37.791 L 0.477 38.522 L 0.238 39.254 L 0 39.985 L 0 40.716 L 0 41.448 L 0.238 42.179 L 0.477 42.911 L 1.192 43.642 L 1.907 44.374 L 2.622 44.617 L 3.337 44.861 L 4.291 44.861 L 5.244 44.861 L 6.198 44.861 L 7.151 44.861 L 8.105 44.617 L 9.058 44.374 L 10.012 44.13 L 10.965 43.886 L 11.918 43.398 L 12.872 42.911 L 14.302 42.179 L 15.732 41.448 L 16.924 40.716 L 18.116 39.985 L 19.07 39.254 L 20.023 38.522 L 20.977 37.791 L 21.93 37.059 C 21.93 37.059 22.407 36.694 22.883 36.328 C 23.36 35.962 23.837 35.596 23.837 35.596 C 23.837 35.596 24.075 35.444 24.433 35.185 C 24.612 35.055 24.82 34.899 25.044 34.722 C 25.267 34.545 25.506 34.347 25.744 34.134 C 25.982 33.92 26.221 33.692 26.444 33.469 C 26.668 33.246 26.876 33.029 27.055 32.838 C 27.412 32.457 27.651 32.183 27.651 32.183 L 28.485 31.452 L 29.319 30.72 L 30.154 29.989 L 30.988 29.257 L 32.18 28.038 L 33.372 26.819 L 35.04 25.356 L 36.709 23.893 L 38.139 22.431 L 39.569 20.968 L 41 19.505 L 42.43 18.042 L 46.244 14.141 L 49.104 10.728 L 51.965 8.29 L 55.302 5.851 L 59.116 3.901 L 61.023 2.926 L 63.406 2.438 L 65.743 1.925 L 68.65 0.975 L 71.034 0 L 70.062 0.477"
              fill="transparent"
              variants={customDrawVariants}
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
            />
            <motion.path
              d="M 0.444 11.215 L 0 9.265 L 0.444 7.802 L 0.888 6.339 L 1.332 4.876 L 2.22 3.901 L 3.108 2.926 L 4.884 1.95 L 6.659 0.975 L 8.879 0.488 L 11.099 0 L 12.875 0 L 15.539 0 L 18.202 0 L 19.978 0 L 22.198 0 L 23.974 0"
              fill="transparent"
              transform="translate(39.957 2.433)"
              variants={customDrawVariants}
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
            />
            <motion.path
              d="M 0 8.29 L 0 6.827 L 0.444 5.851 L 0.888 5.364 L 1.776 4.389 L 2.664 3.901 L 3.552 3.413 L 4.44 2.926 L 5.772 2.438 L 7.547 1.95 L 9.323 1.95 L 11.099 1.95 L 12.875 1.95 L 14.651 1.95 L 15.983 1.95 L 17.759 1.95 L 19.09 1.95 L 20.866 1.95 L 23.086 1.95 L 23.974 1.95 L 25.75 1.95 L 27.526 1.95 L 28.414 1.95 L 30.189 1.95 L 31.965 1.95 L 33.741 1.463 L 35.073 0.975 L 35.961 0"
              fill="transparent"
              transform="translate(15.983 21.938)"
              variants={customDrawVariants}
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
            />
            <motion.path
              d="M 19.09 0 L 17.315 2.926 L 15.539 5.851 L 13.763 8.777 L 11.987 11.703 L 10.211 15.604 L 7.991 19.505 L 6.215 23.406 L 3.996 28.282 L 2.22 33.158 L 0.444 38.522 L 0 41.936 L 0 43.398 L 0.444 44.374 L 1.332 44.861 L 2.664 44.861 L 3.996 43.886 L 5.328 42.911 L 6.659 41.936 L 7.991 40.473 L 8.879 39.497 L 9.767 38.522 L 10.655 37.059 L 11.543 36.084 L 12.431 34.621"
              fill="transparent"
              transform="translate(47.06 2.433)"
              variants={customDrawVariants}
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
            />
          </g>

          <motion.path
            d="M 0 41.476 L 0 42.54 L 0 43.603 L 0 45.198 L 0.466 46.794 L 0.932 48.389 L 1.864 49.452 L 2.796 50.516 L 3.728 51.579 L 4.66 52.111 L 6.525 52.643 L 8.389 52.643 L 11.185 52.643 L 12.583 52.111 L 13.981 51.579 L 14.913 51.048 L 15.846 50.516 L 17.71 49.452 L 19.574 48.389 L 20.972 46.794 L 22.37 45.198 L 23.768 43.603 L 24.7 42.54 L 25.633 40.944 L 27.031 38.817 L 28.429 36.159 L 29.827 33.5 L 31.225 30.841 L 32.157 28.714 L 33.089 26.587 L 34.021 24.46 L 34.487 22.865 L 34.953 21.27 L 35.419 19.675 L 36.352 16.484 L 37.75 12.762 L 38.682 10.103 L 39.614 7.444 L 40.546 5.317 L 41.478 3.19 L 42.41 2.127 L 43.808 1.063 L 44.74 0.532 L 46.139 0"
            fill="transparent"
            transform="translate(39.463 14.357)"
            variants={customDrawVariants}
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
          />

        </g>
      </motion.svg>
    </div>
  );
};
