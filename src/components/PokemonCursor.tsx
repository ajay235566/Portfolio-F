import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'motion/react';

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
    glowColor: 'rgba(250, 204, 21, 0.5)',
    type: 'Electric',
    sprite: '/pokemon/pikachu.gif',
    trailIcon: '⚡'
  },
  {
    id: 'charizard',
    name: 'Charizard',
    color: '#F97316',
    glowColor: 'rgba(249, 115, 22, 0.5)',
    type: 'Fire',
    sprite: '/pokemon/charizard.gif',
    trailIcon: '🔥'
  },
  {
    id: 'gengar',
    name: 'Gengar',
    color: '#A855F7',
    glowColor: 'rgba(168, 85, 247, 0.5)',
    type: 'Ghost',
    sprite: '/pokemon/gengar.gif',
    trailIcon: '👻'
  },
  {
    id: 'squirtle',
    name: 'Squirtle',
    color: '#38BDF8',
    glowColor: 'rgba(56, 189, 248, 0.5)',
    type: 'Water',
    sprite: '/pokemon/squirtle.gif',
    trailIcon: '💧'
  },
  {
    id: 'bulbasaur',
    name: 'Bulbasaur',
    color: '#22C55E',
    glowColor: 'rgba(34, 197, 94, 0.5)',
    type: 'Grass',
    sprite: '/pokemon/bulbasaur.gif',
    trailIcon: '🍃'
  },
  {
    id: 'eevee',
    name: 'Eevee',
    color: '#D97706',
    glowColor: 'rgba(217, 119, 6, 0.5)',
    type: 'Normal',
    sprite: '/pokemon/eevee.gif',
    trailIcon: '✨'
  },
  {
    id: 'lucario',
    name: 'Lucario',
    color: '#3B82F6',
    glowColor: 'rgba(59, 130, 246, 0.5)',
    type: 'Fighting',
    sprite: '/pokemon/lucario.gif',
    trailIcon: '🥋'
  },
  {
    id: 'mewtwo',
    name: 'Mewtwo',
    color: '#8B5CF6',
    glowColor: 'rgba(139, 92, 246, 0.5)',
    type: 'Psychic',
    sprite: '/pokemon/mewtwo.gif',
    trailIcon: '🔮'
  },
  {
    id: 'mew',
    name: 'Mew',
    color: '#EC4899',
    glowColor: 'rgba(236, 72, 153, 0.5)',
    type: 'Psychic',
    sprite: '/pokemon/mew.gif',
    trailIcon: '🌸'
  },
  {
    id: 'dragonite',
    name: 'Dragonite',
    color: '#FB923C',
    glowColor: 'rgba(251, 146, 60, 0.5)',
    type: 'Dragon',
    sprite: '/pokemon/dragonite.gif',
    trailIcon: '🐲'
  },
  {
    id: 'snorlax',
    name: 'Snorlax',
    color: '#14B8A6',
    glowColor: 'rgba(20, 184, 166, 0.5)',
    type: 'Normal',
    sprite: '/pokemon/snorlax.gif',
    trailIcon: '💤'
  },
  {
    id: 'jigglypuff',
    name: 'Jigglypuff',
    color: '#F472B6',
    glowColor: 'rgba(244, 114, 182, 0.5)',
    type: 'Fairy',
    sprite: '/pokemon/jigglypuff.gif',
    trailIcon: '🎵'
  },
  {
    id: 'psyduck',
    name: 'Psyduck',
    color: '#FDE047',
    glowColor: 'rgba(253, 224, 71, 0.5)',
    type: 'Water',
    sprite: '/pokemon/psyduck.gif',
    trailIcon: '❓'
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

  const [searchQuery, setSearchQuery] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [facingRight, setFacingRight] = useState(true);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  const activePokemon = POKEMON_LIST.find(p => p.id === currentId) || POKEMON_LIST[0];

  const filteredPokemon = useMemo(() => {
    if (!searchQuery.trim()) return POKEMON_LIST;
    const q = searchQuery.toLowerCase();
    return POKEMON_LIST.filter(p => p.name.toLowerCase().includes(q) || p.type.toLowerCase().includes(q));
  }, [searchQuery]);

  // Viewport coordinates
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

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
    }, 550);
  }, [activePokemon]);

  useEffect(() => {
    if (isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      mouseX.set(clientX);
      mouseY.set(clientY);

      if (!isVisible) setIsVisible(true);

      const now = performance.now();
      if (lastPosRef.current.time === 0) {
        lastPosRef.current = { x: clientX, y: clientY, time: now };
        return;
      }

      const dx = clientX - lastPosRef.current.x;
      const dy = clientY - lastPosRef.current.y;
      const dist = Math.hypot(dx, dy);

      // Flip direction based on horizontal movement
      if (dx > 2) setFacingRight(true);
      else if (dx < -2) setFacingRight(false);

      // Spawn subtle trail particle if moving actively
      if (dist > 30 && now - lastPosRef.current.time > 110) {
        spawnParticle(clientX + (facingRight ? 4 : 20), clientY + 36);
        lastPosRef.current = { x: clientX, y: clientY, time: now };
      }

      // Check hover state on interactive elements
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest('a, button, [role="button"], .cursor-pointer, [data-cursor-hover]');
        setIsHovering(Boolean(interactive));
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      // Spawn mini spark burst on click
      for (let i = 0; i < 4; i++) {
        spawnParticle(
          e.clientX + (Math.random() - 0.5) * 24,
          e.clientY + (Math.random() - 0.5) * 24,
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
      {/* Pokemon Character Cursor */}
      {enabled && isVisible && (
        <div className="fixed inset-0 pointer-events-none z-[999999] overflow-hidden">
          {/* Particles Trail */}
          {particles.map(p => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0.95, scale: 1, y: 0, x: 0 }}
              animate={{
                opacity: 0,
                scale: 0.3,
                y: 16 + Math.sin(p.angle) * 12,
                x: Math.cos(p.angle) * 12
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{
                position: 'fixed',
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

          {/* 
            Outer wrapper strictly tracks mouseX and mouseY with zero animation override.
            Inner wrapper applies hover hop, click squash, and direction flip.
          */}
          <motion.div
            style={{
              x: mouseX,
              y: mouseY,
              position: 'fixed',
              top: 0,
              left: 0,
              pointerEvents: 'none',
              zIndex: 999999
            }}
          >
            <motion.div
              animate={{
                y: isHovering ? -8 : 0,
                scale: isClicking ? 0.85 : isHovering ? 1.2 : 1,
                rotate: isClicking ? (facingRight ? -10 : 10) : isHovering ? (facingRight ? -6 : 6) : 0
              }}
              transition={{ type: 'spring', stiffness: 450, damping: 25 }}
              style={{
                filter: `drop-shadow(0 4px 12px ${activePokemon.glowColor})`
              }}
            >
              <div
                style={{
                  transform: `translate(${facingRight ? '-10px' : '-38px'}, -8px) scaleX(${facingRight ? 1 : -1})`,
                  transition: 'transform 0.15s ease-out'
                }}
              >
                <img
                  src={activePokemon.sprite}
                  alt={activePokemon.name}
                  className="w-12 h-12 object-contain select-none pointer-events-none"
                  style={{ imageRendering: 'pixelated' }}
                  draggable={false}
                />

                {/* Aura / Sparkle badge when hovering over clickable elements */}
                {isHovering && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1.2, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute -top-2 right-0 text-sm"
                  >
                    {activePokemon.trailIcon}
                  </motion.div>
                )}
              </div>
            </motion.div>
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
              className="mb-3 p-3.5 rounded-3xl glass border border-white/15 shadow-2xl backdrop-blur-xl bg-black/90 flex flex-col gap-2.5 w-[310px]"
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10 px-1">
                <span className="text-xs font-mono font-bold tracking-wider text-text-primary uppercase flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                  Choose Pokémon ({POKEMON_LIST.length})
                </span>
                <button
                  type="button"
                  onClick={() => setEnabled(prev => !prev)}
                  className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border transition-all ${
                    enabled
                      ? 'border-brand-green/40 text-brand-green bg-brand-green/10'
                      : 'border-white/20 text-text-secondary bg-white/5'
                  }`}
                >
                  {enabled ? 'Active' : 'Off'}
                </button>
              </div>

              {/* Quick Search */}
              <div className="px-1">
                <input
                  type="text"
                  placeholder="Search Pokémon or type..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-text-secondary/50 focus:outline-none focus:border-brand-blue/50 font-mono transition-colors"
                />
              </div>

              {/* 2-Column Scrollable Grid */}
              <div
                className="grid grid-cols-2 gap-1.5 max-h-[290px] overflow-y-auto no-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {filteredPokemon.map(poke => {
                  const isSelected = poke.id === currentId;
                  return (
                    <button
                      key={poke.id}
                      type="button"
                      onClick={() => {
                        setCurrentId(poke.id);
                        setEnabled(true);
                      }}
                      className={`flex items-center gap-2 p-2 rounded-xl text-left transition-all ${
                        isSelected
                          ? 'bg-white/20 border border-white/30 text-white font-medium shadow-md'
                          : 'hover:bg-white/5 text-text-secondary hover:text-white border border-transparent'
                      }`}
                    >
                      <img
                        src={poke.sprite}
                        alt={poke.name}
                        className="w-8 h-8 object-contain shrink-0"
                        style={{ imageRendering: 'pixelated' }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold leading-tight truncate flex items-center justify-between gap-1">
                          <span className="truncate">{poke.name}</span>
                          <span className="text-[10px] shrink-0">{poke.trailIcon}</span>
                        </div>
                        <span
                          className="text-[9px] font-mono uppercase tracking-wider block truncate"
                          style={{ color: poke.color }}
                        >
                          {poke.type}
                        </span>
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
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-full glass border border-white/15 bg-black/75 hover:bg-black/90 shadow-lg backdrop-blur-md text-xs font-medium text-text-primary transition-all group"
          title="Customize Pokemon Cursor"
        >
          <img
            src={activePokemon.sprite}
            alt={activePokemon.name}
            className="w-6 h-6 object-contain"
            style={{ imageRendering: 'pixelated' }}
          />
          <span className="text-xs font-mono font-semibold tracking-tight text-white/90">
            {activePokemon.name}
          </span>
          <span className="text-xs text-text-secondary group-hover:text-white transition-colors">
            {activePokemon.trailIcon}
          </span>
        </motion.button>
      </div>
    </>
  );
};

export default PokemonCursor;
