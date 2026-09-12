import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

interface NodePoint {
  id: string;
  name: string;
  category: 'Google' | 'Meta' | 'System';
  position: [number, number, number];
  color: string;
}

const NODES: NodePoint[] = [
  { id: 'xtreme', name: 'Xtreme Autowerx', category: 'Google', position: [-2.8, 1.2, 1.0], color: '#4285F4' },
  { id: 'kelley', name: 'Kelley Law', category: 'Google', position: [2.6, 1.4, -0.8], color: '#4285F4' },
  { id: 'kc-shine', name: 'KC Mobile Shine', category: 'Google', position: [-2.2, -1.5, 1.2], color: '#4285F4' },
  { id: 'cleaning', name: 'The Cleaning Authority', category: 'Google', position: [2.4, -1.2, 1.4], color: '#4285F4' },
  { id: 'skyview', name: 'Skyview MS', category: 'Meta', position: [-1.4, 2.3, -1.2], color: '#0081FB' },
  { id: 'unique', name: 'Unique Painting KC', category: 'Meta', position: [1.5, -2.1, -1.0], color: '#0081FB' },
  { id: 'touring', name: 'Touring Tee', category: 'Meta', position: [2.9, 0.4, 1.5], color: '#7F00FF' },
  { id: 'tracking', name: 'GTM & CAPI Tracking', category: 'System', position: [-1.2, -2.2, 0.8], color: '#00E676' },
  { id: 'reporting', name: 'Cross-Client BI', category: 'System', position: [0.2, 2.5, 0.9], color: '#00E5FF' },
];

// Central Glowing Core
const CentralCore = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
    if (wireframeRef.current) {
      wireframeRef.current.rotation.x -= delta * 0.15;
      wireframeRef.current.rotation.y -= delta * 0.25;
    }
  });

  return (
    <group>
      {/* Inner Glowing Crystal */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial
          color="#1e3a8a"
          emissive="#2563eb"
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Outer Wireframe Shield */}
      <mesh ref={wireframeRef}>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshStandardMaterial
          color="#00E5FF"
          wireframe
          transparent
          opacity={0.35}
        />
      </mesh>
    </group>
  );
};

// Concentric Orbiting Neon Rings
const OrbitalRings = () => {
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const ring3 = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (ring1.current) {
      ring1.current.rotation.x += delta * 0.15;
      ring1.current.rotation.y += delta * 0.2;
    }
    if (ring2.current) {
      ring2.current.rotation.y -= delta * 0.18;
      ring2.current.rotation.z += delta * 0.12;
    }
    if (ring3.current) {
      ring3.current.rotation.x -= delta * 0.12;
      ring3.current.rotation.z -= delta * 0.22;
    }
  });

  return (
    <group>
      {/* Google Blue Ring */}
      <mesh ref={ring1} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[2.4, 0.015, 16, 100]} />
        <meshBasicMaterial color="#4285F4" transparent opacity={0.6} />
      </mesh>

      {/* Meta Violet Ring */}
      <mesh ref={ring2} rotation={[-Math.PI / 3, Math.PI / 4, 0]}>
        <torusGeometry args={[3.0, 0.015, 16, 100]} />
        <meshBasicMaterial color="#7F00FF" transparent opacity={0.5} />
      </mesh>

      {/* Teal/Cyan Signal Ring */}
      <mesh ref={ring3} rotation={[Math.PI / 6, -Math.PI / 3, 0]}>
        <torusGeometry args={[3.6, 0.012, 16, 100]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.4} />
      </mesh>
    </group>
  );
};

// Client Data Node with Floating Badge
const ClientNode = ({ node, onSelect }: { node: NodePoint; onSelect?: (id: string) => void }) => {
  const [hovered, setHovered] = React.useState(false);

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1.2}>
      <group position={node.position}>
        {/* Node Sphere */}
        <mesh
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={() => onSelect && onSelect(node.id)}
          className="cursor-pointer"
        >
          <sphereGeometry args={[hovered ? 0.22 : 0.15, 16, 16]} />
          <meshStandardMaterial
            color={node.color}
            emissive={node.color}
            emissiveIntensity={hovered ? 1.5 : 0.8}
            roughness={0.1}
          />
        </mesh>

        {/* Pulse Halo Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.25, 0.28, 32]} />
          <meshBasicMaterial color={node.color} transparent opacity={hovered ? 0.9 : 0.4} side={THREE.DoubleSide} />
        </mesh>

        {/* Interactive 3D Label */}
        <Html
          position={[0, 0.35, 0]}
          center
          distanceFactor={9}
          zIndexRange={[100, 0]}
          className="pointer-events-none select-none transition-transform duration-300"
        >
          <div
            className={`px-2.5 py-1 rounded-full border text-[11px] font-mono whitespace-nowrap shadow-lg transition-all duration-300 ${
              hovered
                ? 'scale-110 bg-black/90 text-white border-white/40 ring-2 ring-white/20'
                : 'bg-black/60 text-text-secondary border-white/10 backdrop-blur-md'
            }`}
          >
            <span
              className="inline-block w-1.5 h-1.5 rounded-full mr-1.5"
              style={{ backgroundColor: node.color }}
            />
            {node.name}
          </div>
        </Html>
      </group>
    </Float>
  );
};

// Particle Nebula
const SparkleField = () => {
  const count = 120;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 14,
      y: (Math.random() - 0.5) * 10,
      z: (Math.random() - 0.5) * 8,
      speed: 0.15 + Math.random() * 0.3,
      scale: 0.02 + Math.random() * 0.03,
    }));
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();

    particles.forEach((p, i) => {
      dummy.position.set(
        p.x + Math.sin(time * p.speed + i) * 0.2,
        p.y + Math.cos(time * p.speed + i) * 0.2,
        p.z
      );
      dummy.scale.set(p.scale, p.scale, p.scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
    </instancedMesh>
  );
};

interface Ads3DSceneProps {
  onSelectNode?: (id: string) => void;
}

export const Ads3DScene: React.FC<Ads3DSceneProps> = ({ onSelectNode }) => {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#4285F4" />
        <pointLight position={[-10, -10, -10]} intensity={1.2} color="#7F00FF" />
        <pointLight position={[0, 0, 5]} intensity={0.8} color="#00E5FF" />

        <CentralCore />
        <OrbitalRings />
        <SparkleField />

        {NODES.map((node) => (
          <ClientNode key={node.id} node={node} onSelect={onSelectNode} />
        ))}

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.8}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 2.5}
        />
      </Canvas>

      {/* Subtle Bottom Vignette */}
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#030712] to-transparent pointer-events-none" />
    </div>
  );
};

export default Ads3DScene;
