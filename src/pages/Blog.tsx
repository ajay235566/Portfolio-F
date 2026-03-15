import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, BookOpen, Sparkles } from 'lucide-react';

const Blog = () => {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col items-center justify-center px-6 relative overflow-hidden transition-colors duration-300">
      {/* Background Elements */}
      <div className="absolute inset-0 grid-pattern opacity-10" />
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-blue/10 blur-[120px] rounded-full opacity-50 dark:opacity-100" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-red/10 blur-[120px] rounded-full opacity-50 dark:opacity-100" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-2xl"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="w-20 h-20 bg-white/5 rounded-3xl glass flex items-center justify-center mx-auto mb-8"
        >
          <BookOpen size={40} className="text-brand-blue" />
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tight">
          Insights <span className="text-gradient">&</span> Stories
        </h1>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-10 border-brand-blue/20">
          <Sparkles size={16} className="text-brand-yellow animate-pulse" />
          <span className="text-sm font-mono text-brand-blue uppercase tracking-widest font-bold">
            Coming Soon
          </span>
        </div>

        <p className="text-xl text-text-secondary mb-12 leading-relaxed">
          I'm currently architecting a space to share deep dives into measurement strategy, 
          automation workflows, and the future of marketing technology.
        </p>

        <motion.a
          href="#"
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl glass border-text-primary/10 hover:bg-text-primary/5 transition-all font-bold text-lg text-text-primary"
        >
          <ArrowLeft size={20} /> Back to Home
        </motion.a>
      </motion.div>

      {/* Floating Elements */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -20, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
          className="absolute w-1 h-1 bg-text-primary rounded-full transition-colors duration-300"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
};

export default Blog;
