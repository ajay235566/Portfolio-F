import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Sphere, Torus, Html } from '@react-three/drei';
import * as THREE from 'three';

export type PlatformFilter = 'all' | 'google' | 'meta';

export interface NodeData {
  id: string;
  name: string;
  platform: 'google' | 'meta' | 'core';
  position: [number, number, number];
  color: string;
  category: string;
  details: string;
}

export const NODES: NodeData[] = [
  // Core Gateway
  {
    id: 'sgtm',
    name: 'Server-Side GTM Hub',
    platform: 'core',
    position: [0, 0, 0],
    color: '#34A853',
    category: 'Cloud Pipeline',
    details: 'Cloud Ingestion Engine • First-Party Context • ITP & AdBlock Resilient'
  },
  {
    id: 'consent',
    name: 'Consent Mode v2',
    platform: 'core',
    position: [0, 2.3, 0],
    color: '#FBBC05',
    category: 'Privacy Engine',
    details: 'ad_storage & ad_user_data signal validator'
  },
  {
    id: 'identity',
    name: 'SHA-256 Hash Engine',
    platform: 'core',
    position: [0, -2.2, 0],
    color: '#4285F4',
    category: 'Encryption',
    details: 'Normalization & client-side encryption of user identities'
  },

  // Google Ads Cluster
  {
    id: 'g-pmax',
    name: 'Google Ads PMax & Search',
    platform: 'google',
    position: [-4.2, 1.8, 0],
    color: '#4285F4',
    category: 'Paid Search',
    details: 'Auto-tagging gclid capture & Value-Based Bidding'
  },
  {
    id: 'g-enhanced',
    name: 'Enhanced Conversions API',
    platform: 'google',
    position: [-3.8, -1.5, 1],
    color: '#EA4335',
    category: 'Conversion Tracking',
    details: 'First-party customer data hashed matching directly to Google Ads'
  },
  {
    id: 'g-floodlight',
    name: 'SA360 & CM360 Floodlight',
    platform: 'google',
    position: [-4.8, 0.2, -1.2],
    color: '#34A853',
    category: 'Enterprise Ads',
    details: 'Counter & Sales tags with custom u1-u20 metric dimensions'
  },
  {
    id: 'g-oci',
    name: 'Offline Conversions (OCI)',
    platform: 'google',
    position: [-2.5, -2.8, -0.8],
    color: '#FBBC05',
    category: 'CRM Integration',
    details: 'CRM closed-won attribution synced via BigQuery & GTM'
  },

  // Meta Ads Cluster
  {
    id: 'm-pixel',
    name: 'Meta Web Pixel',
    platform: 'meta',
    position: [4.2, 1.8, 0],
    color: '#0081FB',
    category: 'Client Layer',
    details: 'Browser-side event capture with fbclid & fbp cookie storage'
  },
  {
    id: 'm-capi',
    name: 'Conversions API (CAPI)',
    platform: 'meta',
    position: [3.8, -1.5, 1],
    color: '#00C6FF',
    category: 'Server Layer',
    details: 'Server-to-Server direct Graph API streaming via Cloud Run'
  },
  {
    id: 'm-dedup',
    name: 'Event Deduplication',
    platform: 'meta',
    position: [4.8, 0.2, -1.2],
    color: '#8A2BE2',
    category: 'Attribution Guard',
    details: 'Unique event_id matching ensures zero duplicate conversion reporting'
  },
  {
    id: 'm-emq',
    name: 'Advanced Matching (9.0+ EMQ)',
    platform: 'meta',
    position: [2.5, -2.8, -0.8],
    color: '#E0245E',
    category: 'Signal Match Quality',
    details: 'Hashed email, phone, external_id parameters for maximal match rate'
  }
];

// Data Flow Pulses traveling along curves
const DataPulses = ({ filter }: { filter: PlatformFilter }) => {
  const count = 36;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Predefine curves from nodes to center
  const paths = useMemo(() => {
    return NODES.filter(n => n.platform !== 'core').map(n => {
      const start = new THREE.Vector3(...n.position);
      const end = new THREE.Vector3(0, 0, 0);
      const mid = new THREE.Vector3(
        (start.x + end.x) / 2,
        (start.y + end.y) / 2 + (start.x < 0 ? 0.8 : -0.8),
        (start.z + end.z) / 2 + 0.5
      );
      return {
        curve: new THREE.QuadraticBezierCurve3(start, mid, end),
        platform: n.platform,
        color: new THREE.Color(n.color)
      };
    });
  }, []);

  const pulseData = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      pathIndex: i % paths.length,
      progress: (i / count) + Math.random() * 0.1,
      speed: 0.25 + (i % 5) * 0.05,
    }));
  }, [paths, count]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    pulseData.forEach((pulse, i) => {
      const pathObj = paths[pulse.pathIndex];
      const isVisible = filter === 'all' || filter === pathObj.platform;

      if (!isVisible) {
        dummy.scale.set(0, 0, 0);
        dummy.updateMatrix();
        meshRef.current!.setMatrixAt(i, dummy.matrix);
        return;
      }

      pulse.progress = (pulse.progress + delta * pulse.speed) % 1;
      const point = pathObj.curve.getPoint(pulse.progress);

      dummy.position.copy(point);
      const pulseScale = Math.sin(pulse.progress * Math.PI) * 0.14 + 0.05;
      dummy.scale.set(pulseScale, pulseScale, pulseScale);
      dummy.updateMatrix();

      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial
        color="#ffffff"
        emissive="#00e5ff"
        emissiveIntensity={2.5}
        roughness={0.1}
        toneMapped={false}
      />
    </instancedMesh>
  );
};

// Holographic Node
const HolographicNode = ({
  node,
  active,
  selected,
  onClick,
  onHover
}: {
  node: NodeData;
  active: boolean;
  selected: boolean;
  onClick: (node: NodeData) => void;
  onHover: (node: NodeData | null) => void;
}) => {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.8;
      ringRef.current.rotation.x += delta * 0.4;
    }
  });

  const nodeOpacity = active ? 1 : 0.15;

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.4}>
      <group
        position={node.position}
        onClick={(e) => {
          e.stopPropagation();
          onClick(node);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
          onHover(node);
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
          onHover(null);
        }}
      >
        {/* Core Sphere */}
        <Sphere args={[node.platform === 'core' ? 0.45 : 0.32, 32, 32]}>
          <meshStandardMaterial
            color={node.color}
            emissive={node.color}
            emissiveIntensity={selected ? 2.5 : active ? 1.2 : 0.2}
            roughness={0.2}
            metalness={0.8}
            transparent
            opacity={nodeOpacity}
          />
        </Sphere>

        {/* Orbiting wireframe ring */}
        <Torus ref={ringRef} args={[node.platform === 'core' ? 0.75 : 0.52, 0.015, 16, 48]}>
          <meshBasicMaterial
            color={node.color}
            wireframe
            transparent
            opacity={active ? 0.6 : 0.08}
          />
        </Torus>

        {/* Floating Label */}
        {active && (
          <Html
            position={[0, node.platform === 'core' ? 0.7 : 0.55, 0]}
            center
            distanceFactor={10}
            className="pointer-events-none select-none"
          >
            <div className={`px-2.5 py-1 rounded-full text-[11px] font-mono tracking-wider whitespace-nowrap shadow-lg backdrop-blur-md border transition-all ${
              selected
                ? 'bg-white text-black border-white font-bold scale-110'
                : 'bg-black/80 text-white/90 border-white/20'
            }`}>
              {node.name}
            </div>
          </Html>
        )}
      </group>
    </Float>
  );
};

// Center Hub Special Effects
const CenterHub = ({ filter }: { filter: PlatformFilter }) => {
  const outerRing1 = useRef<THREE.Mesh>(null);
  const outerRing2 = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (outerRing1.current) outerRing1.current.rotation.y += delta * 0.5;
    if (outerRing2.current) outerRing2.current.rotation.x += delta * 0.35;
  });

  return (
    <group position={[0, 0, 0]}>
      <Torus ref={outerRing1} args={[1.3, 0.018, 16, 64]}>
        <meshBasicMaterial
          color={filter === 'meta' ? '#00C6FF' : filter === 'google' ? '#FBBC05' : '#34A853'}
          transparent
          opacity={0.4}
        />
      </Torus>
      <Torus ref={outerRing2} args={[1.5, 0.012, 16, 64]}>
        <meshBasicMaterial
          color={filter === 'meta' ? '#0081FB' : filter === 'google' ? '#4285F4' : '#4285F4'}
          transparent
          opacity={0.3}
        />
      </Torus>
    </group>
  );
};

// Connection Lines between nodes and central hub
const ConnectingPipes = ({ filter }: { filter: PlatformFilter }) => {
  const lines = useMemo(() => {
    return NODES.filter(n => n.platform !== 'core').map(n => {
      const points = [
        new THREE.Vector3(...n.position),
        new THREE.Vector3(0, 0, 0)
      ];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      return {
        id: n.id,
        geometry,
        platform: n.platform,
        color: n.color
      };
    });
  }, []);

  return (
    <group>
      {lines.map(line => {
        const isVisible = filter === 'all' || filter === line.platform;
        return (
          <line key={line.id} geometry={line.geometry}>
            <lineBasicMaterial
              color={line.color}
              transparent
              opacity={isVisible ? 0.25 : 0.03}
              linewidth={1}
            />
          </line>
        );
      })}
    </group>
  );
};

// Background Ambience Particles
const AmbientGrid = () => {
  const particlesCount = 200;
  const [positions] = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 24;
      pos[i + 1] = (Math.random() - 0.5) * 16;
      pos[i + 2] = (Math.random() - 0.5) * 16;
    }
    return [pos];
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#88aaff"
        transparent
        opacity={0.35}
        sizeAttenuation
      />
    </points>
  );
};

interface Ads3DSceneProps {
  filter: PlatformFilter;
  selectedNode: NodeData | null;
  onSelectNode: (node: NodeData | null) => void;
}

export const Ads3DScene: React.FC<Ads3DSceneProps> = ({
  filter,
  selectedNode,
  onSelectNode
}) => {
  const [hoveredNode, setHoveredNode] = useState<NodeData | null>(null);

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0, 11], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.9} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#4285F4" />
        <pointLight position={[-10, -10, -10]} intensity={1.5} color="#0081FB" />
        <directionalLight position={[0, 5, 5]} intensity={1.2} />

        <AmbientGrid />
        <CenterHub filter={filter} />
        <ConnectingPipes filter={filter} />
        <DataPulses filter={filter} />

        {/* Nodes */}
        {NODES.map(node => {
          const isPlatformActive = filter === 'all' || node.platform === 'core' || node.platform === filter;
          const isSelected = selectedNode?.id === node.id;

          return (
            <HolographicNode
              key={node.id}
              node={node}
              active={isPlatformActive}
              selected={isSelected}
              onClick={(clicked) => {
                onSelectNode(selectedNode?.id === clicked.id ? null : clicked);
              }}
              onHover={setHoveredNode}
            />
          );
        })}

        <OrbitControls
          enableZoom={true}
          minDistance={6}
          maxDistance={18}
          enablePan={false}
          autoRotate={!selectedNode && !hoveredNode}
          autoRotateSpeed={0.8}
          dampingFactor={0.05}
        />
      </Canvas>

      {/* Floating Instructions Banner */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none flex flex-col gap-1">
        <span className="text-[11px] font-mono uppercase tracking-widest text-text-secondary/70 bg-bg-primary/80 backdrop-blur px-3 py-1.5 rounded-lg border border-white/10 inline-flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-green animate-ping" />
          Interactive 3D Pipeline Matrix
        </span>
        <span className="text-[10px] font-mono text-text-secondary/50 ml-1">
          Drag to rotate • Click nodes to inspect parameters
        </span>
      </div>
    </div>
  );
};
