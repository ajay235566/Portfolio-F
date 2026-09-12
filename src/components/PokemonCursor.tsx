import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';

export interface PokemonCharacter {
  id: string;
  name: string;
  color: string;
  glowColor: string;
  type: string;
  sprite: string;
  trailIcon: string;
}

export const POKEMON_LIST: PokemonCharacter[] = [
  {
    id: 'pikachu',
    name: 'Pikachu',
    color: '#FACC15',
    glowColor: 'rgba(250, 204, 21, 0.45)',
    type: 'Electric',
    sprite: '/pokemon/pikachu.gif',
    trailIcon: '⚡'
  },
  {
    id: 'gengar',
    name: 'Gengar',
    color: '#A855F7',
    glowColor: 'rgba(168, 85, 247, 0.45)',
    type: 'Ghost',
    sprite: '/pokemon/gengar.gif',
    trailIcon: '👻'
  },
  {
    id: 'charizard',
    name: 'Charizard',
    color: '#F97316',
    glowColor: 'rgba(249, 115, 22, 0.45)',
    type: 'Fire',
    sprite: '/pokemon/charizard.gif',
    trailIcon: '🔥'
  },
  {
    id: 'eevee',
    name: 'Eevee',
    color: '#D97706',
    glowColor: 'rgba(217, 119, 6, 0.45)',
    type: 'Normal',
    sprite: '/pokemon/eevee.gif',
    trailIcon: '✨'
  },
  {
    id: 'mew',
    name: 'Mew',
    color: '#EC4899',
    glowColor: 'rgba(236, 72, 153, 0.45)',
    type: 'Psychic',
    sprite: '/pokemon/mew.gif',
    trailIcon: '🌸'
  }
];

interface Particle {
  id: number;
  x: number;
  y: number;
  icon: string;
  color: string;
  size: number;
  angle: number;
}

export const PokemonCursor: React.FC = () => {
  const [enabled, setEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pokemon_cursor_enabled');
      return saved !== null ? saved === 'true' : true;
    }
    return true;
  });

  const [currentId, setCurrentId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('pokemon_cursor_id') || 'pikachu';
    }
    return 'pikachu';
  });

  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [facingRight, setFacingRight] = useState(true);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  const activePokemon = POKEMON_LIST.find(p => p.id === currentId) || POKEMON_LIST[0];

  // Raw mouse coordinates
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth trailing spring for the Pokemon companion
  const springConfig = { damping: 26, stiffness: 220, mass: 0.55 };
  const followerX = useSpring(mouseX, springConfig);
  const followerY = useSpring(mouseY, springConfig);

  const lastPosRef = useRef({ x: 0, y: 0, time: 0 });
  const particleIdRef = useRef(0);

  // Check touch / fine pointer on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const finePointer = window.matchMedia('(pointer: fine)').matches;
      setIsTouch(!finePointer);
    }
  }, []);

  // Update body cursor class
  useEffect(() => {
    if (!isTouch && enabled && isVisible) {
      document.body.classList.add('custom-cursor-active');
    } else {
      document.body.classList.remove('custom-cursor-active');
    }
    return () => {
      document.body.classList.remove('custom-cursor-active');
    };
  }, [isTouch, enabled, isVisible]);

  // Persist settings
  useEffect(() => {
    localStorage.setItem('pokemon_cursor_enabled', String(enabled));
    localStorage.setItem('pokemon_cursor_id', currentId);
  }, [enabled, currentId]);

  // Spawn trail particle
  const spawnParticle = useCallback((x: number, y: number, isBurst = false) => {
    const id = ++particleIdRef.current;
    const newParticle: Particle = {
      id,
      x,
      y,
      icon: activePokemon.trailIcon,
      color: activePokemon.color,
      size: isBurst ? Math.random() * 8 + 14 : Math.random() * 6 + 10,
      angle: isBurst ? Math.random() * 360 : (Math.random() - 0.5) * 45
    };

    setParticles(prev => [...prev.slice(-12), newParticle]);

    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== id));
    }, 600);
  }, [activePokemon]);

  useEffect(() => {
    if (isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      mouseX.set(clientX);
      mouseY.set(clientY);

      if (!isVisible) setIsVisible(true);

      const now = performance.now();
      const dx = clientX - lastPosRef.current.x;
      const dy = clientY - lastPosRef.current.y;
      const dist = Math.hypot(dx, dy);

      // Flip direction
      if (dx > 3) setFacingRight(true);
      else if (dx < -3) setFacingRight(false);

      // Spawn trail particle if moving with speed
      if (dist > 35 && now - lastPosRef.current.time > 120) {
        spawnParticle(clientX + (facingRight ? -12 : 24), clientY + 28);
        lastPosRef.current = { x: clientX, y: clientY, time: now };
      }

      // Check hover state on interactive elements
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest('a, button, input, textarea, select, [role="button"], .cursor-pointer, [data-cursor-hover]');
        setIsHovering(Boolean(interactive));
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      // Spawn mini burst on click
      for (let i = 0; i < 4; i++) {
        spawnParticle(
          e.clientX + (Math.random() - 0.5) * 20,
          e.clientY + (Math.random() - 0.5) * 20,
          true
        );
      }
    };

    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isTouch, isVisible, facingRight, mouseX, mouseY, spawnParticle]);

  if (isTouch) return null;

  return (
    <>
      {/* Precision Pokeball Cursor & Pokemon Companion */}
      {enabled && isVisible && (
        <div className="fixed inset-0 pointer-events-none z-[999999] overflow-hidden">
          {/* Particles Trail */}
          {particles.map(p => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0.9, scale: 1, y: 0, x: 0 }}
              animate={{
                opacity: 0,
                scale: 0.3,
                y: 18 + Math.sin(p.angle) * 12,
                x: Math.cos(p.angle) * 12
              }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                left: p.x,
                top: p.y,
                fontSize: `${p.size}px`,
                textShadow: `0 0 8px ${p.color}`,
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none'
              }}
            >
              {p.icon}
            </motion.div>
          ))}

          {/* Animated Pokemon Companion */}
          <motion.div
            style={{
              x: followerX,
              y: followerY,
              position: 'absolute',
              top: 0,
              left: 0,
              pointerEvents: 'none'
            }}
            animate={{
              scale: isClicking ? 0.9 : isHovering ? 1.25 : 1,
              rotate: isClicking ? (facingRight ? 12 : -12) : isHovering ? (facingRight ? -8 : 8) : 0
            }}
            transition={{ type: 'spring', stiffness: 350, damping: 20 }}
          >
            <div
              className="relative transition-transform duration-200"
              style={{
                transform: `translate(${facingRight ? '18px' : '-52px'}, 12px) scaleX(${facingRight ? 1 : -1})`,
                filter: `drop-shadow(0 4px 10px ${activePokemon.glowColor})`
              }}
            >
              <img
                src={activePokemon.sprite}
                alt={activePokemon.name}
                className="w-12 h-12 object-contain select-none pointer-events-none"
                style={{ imageRendering: 'pixelated' }}
                draggable={false}
              />
              
              {/* Electric/energy glow badge when hovering */}
              {isHovering && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute -top-2 right-0 text-xs"
                >
                  {activePokemon.trailIcon}
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Precision Pokeball Pointer */}
          <motion.div
            style={{
              x: mouseX,
              y: mouseY,
              position: 'absolute',
              top: 0,
              left: 0,
              pointerEvents: 'none'
            }}
            animate={{
              scale: isClicking ? 0.8 : isHovering ? 1.35 : 1
            }}
            transition={{ type: 'spring', stiffness: 450, damping: 25 }}
          >
            <div className="relative -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
              {/* Outer pulsing glow on hover */}
              {isHovering && (
                <div
                  className="absolute w-8 h-8 rounded-full animate-ping opacity-60 pointer-events-none"
                  style={{ backgroundColor: activePokemon.color }}
                />
              )}

              {/* Pokeball SVG */}
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
              >
                {/* Outer Ring */}
                <circle cx="12" cy="12" r="10.5" fill="#18181B" stroke="#FFFFFF" strokeWidth="1.5" />
                {/* Red Top Half */}
                <path d="M 2 12 A 10 10 0 0 1 22 12 Z" fill="#EF4444" />
                {/* White Bottom Half */}
                <path d="M 2 12 A 10 10 0 0 0 22 12 Z" fill="#F4F4F5" />
                {/* Center dividing black line */}
                <rect x="2" y="10.75" width="20" height="2.5" fill="#18181B" />
                {/* Outer center button */}
                <circle cx="12" cy="12" r="3.6" fill="#18181B" stroke="#FFFFFF" strokeWidth="0.75" />
                {/* Inner button center dot */}
                <circle
                  cx="12"
                  cy="12"
                  r="2"
                  fill={isHovering ? activePokemon.color : '#FFFFFF'}
                  className="transition-colors duration-200"
                />
              </svg>
            </div>
          </motion.div>
        </div>
      )}

      {/* Floating Pokemon Selector Pill (Bottom-Left) */}
      <div className="fixed bottom-5 left-5 z-40 select-none">
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="mb-3 p-3 rounded-2xl glass border border-white/15 shadow-2xl backdrop-blur-xl bg-black/80 flex flex-col gap-2 min-w-[210px]"
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10 px-1">
                <span className="text-xs font-mono font-bold tracking-wider text-text-primary uppercase flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                  Choose Companion
                </span>
                <button
                  type="button"
                  onClick={() => setEnabled(prev => !prev)}
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full border transition-all ${
                    enabled
                      ? 'border-brand-green/40 text-brand-green bg-brand-green/10'
                      : 'border-white/20 text-text-secondary bg-white/5'
                  }`}
                >
                  {enabled ? 'Active' : 'Off'}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-1">
                {POKEMON_LIST.map(poke => {
                  const isSelected = poke.id === currentId;
                  return (
                    <button
                      key={poke.id}
                      type="button"
                      onClick={() => {
                        setCurrentId(poke.id);
                        setEnabled(true);
                      }}
                      className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-left transition-all ${
                        isSelected
                          ? 'bg-white/15 border border-white/20 text-white font-medium shadow-sm'
                          : 'hover:bg-white/5 text-text-secondary hover:text-white border border-transparent'
                      }`}
                    >
                      <img
                        src={poke.sprite}
                        alt={poke.name}
                        className="w-7 h-7 object-contain"
                        style={{ imageRendering: 'pixelated' }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium leading-tight flex items-center justify-between">
                          <span>{poke.name}</span>
                          <span className="text-[10px] text-text-secondary">{poke.trailIcon}</span>
                        </div>
                        <span className="text-[10px] text-text-secondary/70 font-mono">{poke.type}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Minimized Launcher Button */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setMenuOpen(prev => !prev)}
          className="flex items-center gap-2.5 px-3 py-2 rounded-full glass border border-white/15 bg-black/70 hover:bg-black/85 shadow-lg backdrop-blur-md text-xs font-medium text-text-primary transition-all group"
          title="Customize Pokemon Cursor"
        >
          <div className="w-5 h-5 relative flex items-center justify-center">
            {/* Mini Pokeball icon */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              className={`transition-transform duration-500 ${menuOpen ? 'rotate-180' : 'group-hover:rotate-45'}`}
            >
              <circle cx="12" cy="12" r="10" fill="#18181B" stroke="#FFFFFF" strokeWidth="1.5" />
              <path d="M 2 12 A 10 10 0 0 1 22 12 Z" fill="#EF4444" />
              <path d="M 2 12 A 10 10 0 0 0 22 12 Z" fill="#F4F4F5" />
              <rect x="2" y="11" width="20" height="2" fill="#18181B" />
              <circle cx="12" cy="12" r="3" fill="#18181B" stroke="#FFFFFF" strokeWidth="0.8" />
              <circle cx="12" cy="12" r="1.5" fill={activePokemon.color} />
            </svg>
          </div>
          <span className="text-xs font-mono font-semibold tracking-tight text-white/90">
            {activePokemon.name}
          </span>
          <img
            src={activePokemon.sprite}
            alt={activePokemon.name}
            className="w-5 h-5 object-contain -ml-1"
            style={{ imageRendering: 'pixelated' }}
          />
        </motion.button>
      </div>
    </>
  );
};

export default PokemonCursor;
