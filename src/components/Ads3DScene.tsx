import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Vertex shader with interactive wave displacement and mouse perturbation
const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMouseStrength;
  varying vec2 vUv;
  varying float vElevation;

  // Simplex noise helper
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(i, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Organic harmonic wave motion
    float wave1 = snoise(vec3(pos.x * 0.45, pos.y * 0.45, uTime * 0.25)) * 0.75;
    float wave2 = sin(pos.x * 1.2 + uTime * 0.6) * cos(pos.y * 1.2 + uTime * 0.5) * 0.4;
    
    // Interactive mouse displacement ripple
    float distToMouse = distance(uv, uMouse);
    float mouseWave = sin(distToMouse * 18.0 - uTime * 3.0) * exp(-distToMouse * 4.0) * uMouseStrength * 0.8;

    float elevation = wave1 + wave2 + mouseWave;
    pos.z += elevation;
    vElevation = elevation;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

// Fragment shader with rich chromatic iridescence, deep darks and neon glows
const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColorA; // Google Blue / Cyan
  uniform vec3 uColorB; // Meta Violet / Indigo
  uniform vec3 uColorC; // Deep Obsidian
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    // Normalization of elevation for color mapping
    float mixStrength = (vElevation + 0.8) * 0.6;
    mixStrength = clamp(mixStrength, 0.0, 1.0);

    // Dynamic dual-gradient blend
    vec3 color = mix(uColorC, uColorA, smoothstep(0.1, 0.7, mixStrength));
    color = mix(color, uColorB, smoothstep(0.5, 0.95, sin(vUv.x * 3.1415 + uTime * 0.2)));

    // Grid wireframe shimmer for high-tech aesthetic
    vec2 grid = abs(fract(vUv * 40.0 - 0.5) - 0.5) / fwidth(vUv * 40.0);
    float line = min(grid.x, grid.y);
    float gridLine = 1.0 - min(line, 1.0);
    
    color += vec3(gridLine * 0.12);

    // Rim glow & edge vignette
    float edgeDist = distance(vUv, vec2(0.5));
    float vignette = 1.0 - smoothstep(0.35, 0.75, edgeDist);

    gl_FragColor = vec4(color * vignette, 0.92);
  }
`;

// Fluid Interactive Mesh
const FluidOrganicMesh = ({ mousePos }: { mousePos: { x: number; y: number; active: boolean } }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetMouse = useRef(new THREE.Vector2(0.5, 0.5));
  const currentMouse = useRef(new THREE.Vector2(0.5, 0.5));
  const mouseStrength = useRef(0.0);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uMouseStrength: { value: 0 },
      uColorA: { value: new THREE.Color('#4285F4') }, // Google Electric Blue
      uColorB: { value: new THREE.Color('#7F00FF') }, // Meta Cyber Violet
      uColorC: { value: new THREE.Color('#050811') }, // Deep Obsidian
    }),
    []
  );

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    uniforms.uTime.value = state.clock.getElapsedTime();

    // Smoothly interpolate mouse position for realistic fluid inertia
    targetMouse.current.set(mousePos.x, mousePos.y);
    currentMouse.current.lerp(targetMouse.current, delta * 4.0);
    uniforms.uMouse.value.copy(currentMouse.current);

    // Damped mouse influence strength
    const targetStrength = mousePos.active ? 1.0 : 0.2;
    mouseStrength.current = THREE.MathUtils.lerp(mouseStrength.current, targetStrength, delta * 3.0);
    uniforms.uMouseStrength.value = mouseStrength.current;

    // Subtle breathing rotation
    meshRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.15) * 0.05;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} rotation={[-Math.PI / 4, 0, 0]}>
      <planeGeometry args={[14, 10, 96, 96]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// Orbiting Neon Data Ring Floating in the Background
const DataRing = () => {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI / 3 + Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1;
      ringRef.current.rotation.y += delta * 0.25;
    }
  });

  return (
    <mesh ref={ringRef} position={[0, 0, -1]}>
      <torusGeometry args={[3.8, 0.02, 16, 100]} />
      <meshBasicMaterial color="#00E5FF" transparent opacity={0.35} />
    </mesh>
  );
};

// Ambient Floating Light Particles
const FloatingSparks = () => {
  const count = 75;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 14,
      y: (Math.random() - 0.5) * 8,
      z: (Math.random() - 0.5) * 6,
      speed: 0.2 + Math.random() * 0.4,
      phase: Math.random() * Math.PI * 2,
    }));
  }, [count]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();

    particles.forEach((p, i) => {
      const currentY = p.y + Math.sin(time * p.speed + p.phase) * 0.4;
      const currentX = p.x + Math.cos(time * p.speed * 0.7 + p.phase) * 0.3;
      dummy.position.set(currentX, currentY, p.z);
      dummy.scale.set(0.04, 0.04, 0.04);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
    </instancedMesh>
  );
};

interface Ads3DSceneProps {
  onInteraction?: () => void;
}

export const Ads3DScene: React.FC<Ads3DSceneProps> = ({ onInteraction }) => {
  const [mousePos, setMousePos] = React.useState({ x: 0.5, y: 0.5, active: false });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = 1.0 - (e.clientY - rect.top) / rect.height;
    setMousePos({ x, y, active: true });
    if (onInteraction) onInteraction();
  };

  const handlePointerLeave = () => {
    setMousePos(prev => ({ ...prev, active: false }));
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="w-full h-full relative cursor-crosshair overflow-hidden"
    >
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <FluidOrganicMesh mousePos={mousePos} />
        <DataRing />
        <FloatingSparks />
      </Canvas>

      {/* Subtle bottom gradient mask for smooth blend into page */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bg-primary to-transparent pointer-events-none" />
    </div>
  );
};

export default Ads3DScene;
