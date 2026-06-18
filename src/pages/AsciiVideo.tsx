import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Pause, RotateCcw, ArrowLeft, 
  Eye, EyeOff, Activity, Monitor, Repeat, Sliders, ChevronRight
} from 'lucide-react';

// Global cache to avoid re-downloading the 107MB file when switching tabs/pages
let cachedVideoData: any = null;

interface LoadingProgress {
  percentage: number;
  loadedMB: string;
  totalMB: string;
  speed: string;
  eta: number;
}

type ColorMode = 'color' | 'matrix' | 'amber' | 'grayscale' | 'neon';
type LoadingStep = 'idle' | 'downloading' | 'parsing' | 'complete' | 'error';

export default function AsciiVideo() {
  const [videoData, setVideoData] = useState<any>(cachedVideoData);
  const [loadingStep, setLoadingStep] = useState<LoadingStep>(cachedVideoData ? 'complete' : 'idle');
  const [loadingProgress, setLoadingProgress] = useState<LoadingProgress>({
    percentage: 0,
    loadedMB: '0.0',
    totalMB: '0.0',
    speed: '0.0',
    eta: 0,
  });
  const [error, setError] = useState<string | null>(null);

  // Player controls state
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [loop, setLoop] = useState(true);
  const [colorMode, setColorMode] = useState<ColorMode>('color');
  const [fontSize, setFontSize] = useState(6);
  const [scanlines, setScanlines] = useState(true);
  const [actualFps, setActualFps] = useState(0);

  // Monospace character metrics calculation
  // Aspect ratio is roughly 0.6w to 1.0h for clean monospace layouts
  const charWidth = fontSize * 0.6;
  const charHeight = fontSize * 1.0;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  // Progressive downloading engine
  useEffect(() => {
    if (cachedVideoData) return;

    const startDownload = async () => {
      setLoadingStep('downloading');
      try {
        const response = await fetch('/ascii-stream.json');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        if (!response.body) {
          throw new Error('ReadableStream not supported by browser.');
        }

        const reader = response.body.getReader();
        const contentLength = response.headers.get('content-length');
        const totalBytes = contentLength ? parseInt(contentLength, 10) : 0;
        
        const chunks: Uint8Array[] = [];
        let receivedBytes = 0;
        const startTime = Date.now();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          chunks.push(value);
          receivedBytes += value.length;

          // Telemetry and statistics calculations
          const percentage = totalBytes ? Math.round((receivedBytes / totalBytes) * 100) : 0;
          const elapsedSeconds = (Date.now() - startTime) / 1000;
          const speedMBs = elapsedSeconds > 0 ? (receivedBytes / (1024 * 1024)) / elapsedSeconds : 0;
          const remainingBytes = totalBytes ? (totalBytes - receivedBytes) : 0;
          const etaSeconds = speedMBs > 0 ? Math.round((remainingBytes / (1024 * 1024)) / speedMBs) : 0;

          setLoadingProgress({
            percentage,
            loadedMB: (receivedBytes / (1024 * 1024)).toFixed(1),
            totalMB: totalBytes ? (totalBytes / (1024 * 1024)).toFixed(1) : 'Unknown',
            speed: speedMBs.toFixed(1),
            eta: etaSeconds,
          });
        }

        // Unpack and decode binary array
        setLoadingStep('parsing');
        
        // Wait brief tick to let React render parsing status before heavy thread work
        await new Promise(resolve => setTimeout(resolve, 50));

        const concatenatedChunks = new Uint8Array(receivedBytes);
        let offset = 0;
        for (const chunk of chunks) {
          concatenatedChunks.set(chunk, offset);
          offset += chunk.length;
        }

        const decoder = new TextDecoder('utf-8');
        const jsonString = decoder.decode(concatenatedChunks);
        const data = JSON.parse(jsonString);

        cachedVideoData = data;
        setVideoData(data);
        setLoadingStep('complete');
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to download or process ASCII JSON.');
        setLoadingStep('error');
      }
    };

    startDownload();
  }, []);

  // Auto-scroll terminal logs during booting phase
  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [loadingProgress.loadedMB, loadingStep]);

  // RequestAnimationFrame high precision playback loop
  const animate = (time: number) => {
    if (previousTimeRef.current !== null && isPlaying && videoData) {
      const elapsedMs = time - previousTimeRef.current;
      const targetInterval = 1000 / (videoData.fps * speedMultiplier);

      if (elapsedMs >= targetInterval) {
        setCurrentFrame(prev => {
          let next = prev + 1;
          if (next >= videoData.totalFrames) {
            if (loop) {
              next = 0;
            } else {
              setIsPlaying(false);
              return prev;
            }
          }
          return next;
        });
        setActualFps(Math.round(1000 / elapsedMs));
        previousTimeRef.current = time;
      }
    } else {
      previousTimeRef.current = time;
    }
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isPlaying, videoData, speedMultiplier, loop]);

  // Canvas drawing updates when state changes
  useEffect(() => {
    if (!videoData || !canvasRef.current) return;
    renderFrame(currentFrame);
  }, [currentFrame, videoData, fontSize, colorMode]);

  // Core Canvas rendering routine
  const renderFrame = (frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !videoData) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const frame = videoData.frames[frameIdx];
    if (!frame) return;

    const cols = videoData.width;
    const rows = videoData.height;

    // Canvas size configuration
    canvas.width = cols * charWidth;
    canvas.height = rows * charHeight;

    // Clear with terminal black
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${fontSize}px "JetBrains Mono", "Fira Code", monospace`;
    ctx.textBaseline = 'top';

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        const char = frame.chars[idx];
        
        // Extract 6-character hex color
        const colorHex = frame.colors.substring(idx * 6, idx * 6 + 6);
        const color = `#${colorHex}`;

        if (!char || char === ' ') continue;

        // Visual mode color transformation
        if (colorMode === 'color') {
          ctx.fillStyle = color;
        } else {
          const red = parseInt(colorHex.substring(0, 2), 16);
          const green = parseInt(colorHex.substring(2, 4), 16);
          const blue = parseInt(colorHex.substring(4, 6), 16);
          const intensity = (red * 0.299 + green * 0.587 + blue * 0.114) / 255;

          if (colorMode === 'matrix') {
            ctx.fillStyle = `rgb(0, ${Math.floor(80 + intensity * 175)}, 0)`;
          } else if (colorMode === 'amber') {
            ctx.fillStyle = `rgb(${Math.floor(180 + intensity * 75)}, ${Math.floor(110 + intensity * 110)}, 0)`;
          } else if (colorMode === 'grayscale') {
            const grayVal = Math.floor(red * 0.299 + green * 0.587 + blue * 0.114);
            ctx.fillStyle = `rgb(${grayVal}, ${grayVal}, ${grayVal})`;
          } else if (colorMode === 'neon') {
            if (red > blue) {
              ctx.fillStyle = '#ff007f'; // cyber pink
            } else {
              ctx.fillStyle = '#00ffff'; // cyber cyan
            }
          }
        }

        ctx.fillText(char, c * charWidth, r * charHeight);
      }
    }
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle play on spacebar
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying(p => !p);
      }
      // Step frame left/right
      if (!isPlaying && videoData) {
        if (e.code === 'ArrowRight') {
          e.preventDefault();
          setCurrentFrame(p => Math.min(videoData.totalFrames - 1, p + 1));
        } else if (e.code === 'ArrowLeft') {
          e.preventDefault();
          setCurrentFrame(p => Math.max(0, p - 1));
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, videoData]);

  // Terminal logging statements for loading dashboard
  const getLoaderLogs = () => {
    const logs = [
      "SYSTEM: RENDER BOOT SEQUENCE INITIATED",
      "NETWORK: CONFIGURING SECURE CHANNEL...",
      `ASSET: PULLING "/ascii-stream.json" FROM PORTAL...`,
    ];

    if (loadingStep === 'downloading' || loadingStep === 'parsing' || loadingStep === 'complete') {
      logs.push(`TELEMETRY: FILE SIZE FOUND: ${loadingProgress.totalMB} MB`);
      logs.push(`TELEMETRY: PACKETS EXTRACTED: ${loadingProgress.loadedMB} MB (${loadingProgress.percentage}%)`);
      if (loadingStep === 'downloading' && loadingProgress.percentage < 100) {
        logs.push(`TELEMETRY: NET SPEED: ${loadingProgress.speed} MB/s | ETA: ${loadingProgress.eta}s`);
      }
    }

    if (loadingStep === 'parsing') {
      logs.push("STATUS: EXTRACTION COMPLETED.");
      logs.push("DECODER: UNPACKING BINARY MATRIX STREAMS...");
      logs.push("DECODER: RUNNING COMPONENT IDENTIFIER MAPPING...");
      logs.push("SYSTEM: ASSEMBLING FRAME DICTIONARIES...");
    }

    if (loadingStep === 'complete') {
      logs.push("STATUS: DOWNLOAD SUCCESSFUL.");
      logs.push("DECODER: UTF-8 PARSE CLEARED.");
      logs.push(`SYSTEM: BUFFERED ${videoData?.totalFrames || 104} FRAMES (${videoData?.width}x${videoData?.height})`);
      logs.push("SYSTEM: CORE ENGINE ONLINE. HIT SPACE TO PLAY.");
    }

    if (loadingStep === 'error') {
      logs.push(`[CRITICAL ERROR]: ${error}`);
      logs.push("SYSTEM: BOOT CRITICAL FAULT. RETRYING RECOMMENDED.");
    }

    return logs;
  };

  return (
    <div className="min-h-screen pt-28 pb-16 px-6 bg-bg-primary text-text-primary flex flex-col items-center relative overflow-hidden transition-colors duration-300">
      {/* Background Ambience */}
      <div className="absolute inset-0 grid-pattern opacity-10" />
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-blue/10 blur-[120px] rounded-full opacity-50 dark:opacity-100" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-red/10 blur-[120px] rounded-full opacity-50 dark:opacity-100" />

      <div className="max-w-6xl mx-auto w-full relative z-10">
        
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <a
              href="#"
              className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-4 group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </a>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">
              ASCII <span className="text-gradient">Cinema</span>
            </h1>
            <p className="text-text-secondary text-sm md:text-base font-mono">
              High-fidelity ASCII stream constructed in real-time on Canvas
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-brand-green animate-ping" />
            <span className="text-xs font-mono bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
              STATUS: RENDER ENGINE ACTIVE
            </span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          
          {/* Boot / Downloading View */}
          {loadingStep !== 'complete' && (
            <motion.div
              key="loader"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="glass border-white/10 rounded-[2.5rem] p-8 md:p-12 max-w-2xl mx-auto flex flex-col gap-6"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono uppercase tracking-widest text-brand-blue font-bold">
                  {loadingStep === 'downloading' ? 'Extracting Archive Assets...' : 'System Decompressing...'}
                </span>
                <span className="text-xs font-mono text-text-secondary">
                  {loadingProgress.percentage}%
                </span>
              </div>

              {/* Progress Indicator */}
              <div className="w-full bg-white/5 border border-white/15 h-3 rounded-full overflow-hidden p-[2px]">
                <motion.div
                  className="bg-gradient-to-r from-brand-blue via-purple-500 to-brand-green h-full rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${loadingProgress.percentage}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>

              {/* Retro Console Logging Logs */}
              <div className="bg-black/80 rounded-2xl p-6 border border-white/5 font-mono text-[11px] leading-relaxed text-brand-green/90 h-64 overflow-y-auto shadow-inner flex flex-col justify-start">
                <div className="flex-1 space-y-1">
                  {getLoaderLogs().map((log, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <ChevronRight size={12} className="shrink-0 mt-0.5 opacity-50 text-brand-green" />
                      <span>{log}</span>
                    </div>
                  ))}
                  {loadingStep !== 'error' && (
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="h-1.5 w-1.5 bg-brand-green rounded-full animate-pulse" />
                      <span className="text-text-secondary/50">awaiting thread cycles...</span>
                    </div>
                  )}
                  <div ref={terminalBottomRef} />
                </div>
              </div>
            </motion.div>
          )}

          {/* Player Active View */}
          {loadingStep === 'complete' && videoData && (
            <motion.div
              key="player"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-8"
            >
              {/* Monospace CRT Console Screen */}
              <div className="relative group">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-brand-blue to-purple-600 rounded-3xl opacity-20 blur-lg group-hover:opacity-35 transition duration-500" />
                
                {/* Visual Glass Frame Bezel */}
                <div className="relative bg-neutral-950 border-8 border-neutral-900 rounded-[2.5rem] p-6 shadow-[0_30px_60px_rgba(0,0,0,0.8),inset_0_4px_30px_rgba(255,255,255,0.05)] overflow-hidden">
                  
                  {/* CRT Lens Glass Reflection Screen */}
                  <div 
                    className="absolute inset-0 pointer-events-none z-20 opacity-[0.03]"
                    style={{
                      background: 'radial-gradient(circle at 50% 15%, rgba(255,255,255,0.8) 0%, rgba(0,0,0,0) 80%)'
                    }}
                  />

                  {/* Scanline Mesh effect overlay */}
                  {scanlines && (
                    <div 
                      className="absolute inset-0 pointer-events-none z-10 opacity-[0.18]"
                      style={{
                        background: `
                          linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.45) 50%),
                          linear-gradient(90deg, rgba(255, 0, 0, 0.05), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.05))
                        `,
                        backgroundSize: '100% 3px, 6px 100%'
                      }}
                    />
                  )}

                  {/* Screen Frame Container */}
                  <div className="relative w-full bg-[#050505] rounded-2xl overflow-hidden flex items-center justify-center p-4 border border-white/5">
                    
                    {/* The Canvas Object */}
                    <canvas 
                      ref={canvasRef}
                      className="max-w-full h-auto object-contain select-none"
                      style={{
                        imageRendering: 'pixelated',
                        display: 'block'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Scrubber Navigation Area */}
              <div className="glass p-5 rounded-3xl border-white/10 flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs font-mono text-text-secondary px-1">
                  <span>FRAME {currentFrame + 1} / {videoData.totalFrames}</span>
                  <span>TIME {((currentFrame) / videoData.fps).toFixed(2)}s / {((videoData.totalFrames) / videoData.fps).toFixed(2)}s</span>
                </div>
                
                <input 
                  type="range"
                  min="0"
                  max={videoData.totalFrames - 1}
                  value={currentFrame}
                  onChange={(e) => {
                    setCurrentFrame(parseInt(e.target.value, 10));
                    setIsPlaying(false); // pause play when scrubbing
                  }}
                  className="w-full h-1.5 rounded-lg bg-white/10 appearance-none cursor-pointer accent-brand-blue"
                  style={{ outline: 'none' }}
                />
              </div>

              {/* Console Dashboard Controls */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Control Panel Grid (8 Cols) */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                  <div className="glass p-6 rounded-[2rem] border-white/10 flex flex-wrap items-center justify-between gap-6">
                    
                    {/* Playback Trigger Group */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                          isPlaying 
                            ? 'bg-brand-red text-white shadow-lg shadow-brand-red/20 hover:scale-105' 
                            : 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20 hover:scale-105'
                        }`}
                        title="Spacebar to Toggle"
                      >
                        {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                      </button>

                      <button
                        onClick={() => {
                          setIsPlaying(false);
                          setCurrentFrame(0);
                        }}
                        className="w-12 h-12 rounded-xl glass border-white/10 text-text-primary flex items-center justify-center hover:bg-white/5 active:scale-95 transition-all"
                        title="Reset"
                      >
                        <RotateCcw size={18} />
                      </button>

                      <button
                        onClick={() => setLoop(!loop)}
                        className={`w-12 h-12 rounded-xl border flex items-center justify-center active:scale-95 transition-all ${
                          loop 
                            ? 'bg-brand-green/10 border-brand-green/30 text-brand-green' 
                            : 'glass border-white/10 text-text-secondary hover:text-text-primary'
                        }`}
                        title="Toggle Loop"
                      >
                        <Repeat size={18} />
                      </button>

                      <button
                        onClick={() => setScanlines(!scanlines)}
                        className={`w-12 h-12 rounded-xl border flex items-center justify-center active:scale-95 transition-all ${
                          scanlines 
                            ? 'bg-brand-blue/10 border-brand-blue/30 text-brand-blue' 
                            : 'glass border-white/10 text-text-secondary hover:text-text-primary'
                        }`}
                        title="CRT Scanlines"
                      >
                        {scanlines ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                    </div>

                    {/* Speed Regulator Group */}
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-mono text-text-secondary uppercase tracking-wider">
                        SPEED MULTIPLIER
                      </span>
                      <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
                        {[0.5, 1.0, 1.5, 2.0].map((rate) => (
                          <button
                            key={rate}
                            onClick={() => setSpeedMultiplier(rate)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                              speedMultiplier === rate 
                                ? 'bg-white/10 text-white shadow-sm' 
                                : 'text-text-secondary hover:text-text-primary'
                            }`}
                          >
                            {rate.toFixed(1)}x
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Zoom / Scaling Control */}
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-mono text-text-secondary uppercase tracking-wider">
                        SCREEN ZOOM (FONT SIZE)
                      </span>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="4"
                          max="12"
                          step="1"
                          value={fontSize}
                          onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                          className="h-1.5 rounded-lg bg-white/10 appearance-none cursor-pointer accent-brand-blue w-28"
                        />
                        <span className="text-xs font-mono bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
                          {fontSize}px
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Filter Customizer Layout */}
                  <div className="glass p-6 rounded-[2rem] border-white/10">
                    <h3 className="text-xs font-mono text-text-secondary uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Sliders size={12} className="text-brand-blue" />
                      Visual Mode Filters
                    </h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {[
                        { mode: 'color', label: 'True RGB', color: 'border-brand-blue text-brand-blue' },
                        { mode: 'matrix', label: 'Matrix Green', color: 'border-brand-green text-brand-green' },
                        { mode: 'amber', label: 'Amber CRT', color: 'border-brand-yellow text-brand-yellow' },
                        { mode: 'grayscale', label: 'Cyber Gray', color: 'border-white/30 text-white/80' },
                        { mode: 'neon', label: 'Retro Neon', color: 'border-pink-500 text-pink-500' }
                      ].map((cfg) => (
                        <button
                          key={cfg.mode}
                          onClick={() => setColorMode(cfg.mode as ColorMode)}
                          className={`px-4 py-3 rounded-2xl border text-xs font-mono font-bold transition-all active:scale-95 text-center ${
                            colorMode === cfg.mode 
                              ? `bg-white/5 ${cfg.color} border-2` 
                              : 'glass border-white/5 text-text-secondary hover:text-text-primary hover:border-white/10'
                          }`}
                        >
                          {cfg.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Telemetry Spex Grid (4 Cols) */}
                <div className="lg:col-span-4 glass p-6 rounded-[2rem] border-white/10 flex flex-col gap-4">
                  <h3 className="text-xs font-mono text-text-secondary uppercase tracking-widest flex items-center gap-2">
                    <Monitor size={14} className="text-brand-blue" />
                    Telemetry Diagnostics
                  </h3>

                  <div className="border border-white/5 bg-black/60 rounded-2xl p-4 font-mono text-xs text-text-secondary space-y-3 shadow-inner">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span>GENERATOR:</span>
                      <span className="text-text-primary font-bold">{videoData.generator}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span>GRID DIMS:</span>
                      <span className="text-text-primary font-bold">{videoData.width} x {videoData.height} cols</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span>MEM LOAD:</span>
                      <span className="text-text-primary font-bold">21.86 MB</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span>NATIVE FPS:</span>
                      <span className="text-text-primary font-bold">{videoData.fps} FPS</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span>RENDER RATE:</span>
                      <span className={`${isPlaying ? 'text-brand-green' : 'text-text-secondary'} font-bold`}>
                        {isPlaying ? `${actualFps} FPS` : 'PAUSED'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>ENGINE ID:</span>
                      <span className="text-text-primary font-bold">HTML5 CANVAS 2D</span>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-end">
                    <div className="p-4 bg-brand-blue/5 rounded-2xl border border-brand-blue/15 text-xs text-text-secondary flex items-start gap-3">
                      <Activity size={16} className="text-brand-blue shrink-0 mt-0.5" />
                      <p className="leading-normal">
                        Use the <strong className="text-text-primary font-mono">[SPACEBAR]</strong> to toggle pause/play. Press the <strong className="text-text-primary font-mono">[LEFT / RIGHT]</strong> keys to step through individual frame frames manually.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </div>
  );
}
