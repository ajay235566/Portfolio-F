import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Torus, Html } from '@react-three/drei';
import * as THREE from 'three';

export type PlatformFilter = 'all' | 'google' | 'meta';

export interface FunnelStage {
  id: number;
  slug: string;
  name: string;
  subtitle: string;
  yPos: number;
  radiusTop: number;
  radiusBottom: number;
  height: number;
  color: string;
  glowColor: string;
  tags: string[];
  parameters: { key: string; val: string; desc: string }[];
  description: string;
  codeSnippet: string;
}

export const FUNNEL_STAGES: FunnelStage[] = [
  {
    id: 1,
    slug: 'ad-click',
    name: 'Stage 1: Paid Acquisition & Click Ingestion',
    subtitle: 'Google Ads (Search/PMax) & Meta Ads (Feed/Reels)',
    yPos: 2.6,
    radiusTop: 4.4,
    radiusBottom: 3.3,
    height: 1.4,
    color: '#4285F4',
    glowColor: '#0081FB',
    tags: ['Google Ads', 'Meta Ads', 'gclid', 'fbclid', 'wbraid'],
    parameters: [
      { key: 'gclid', val: 'Cj0KCQjwm5e5Bh...', desc: 'Google Click Identifier for server-side attribution' },
      { key: 'fbclid', val: 'IwAR2X948J_k8f...', desc: 'Meta Click Identifier stored in _fbc first-party cookie' },
      { key: 'wbraid / gbraid', val: 'CjkKCQjwm5...', desc: 'App-to-web privacy modeled click IDs for iOS 14.5+' },
      { key: 'utm_campaign', val: 'pmax_summer_26', desc: 'Campaign taxonomy mapping across SA360 & Meta' }
    ],
    description: 'High-volume paid traffic arrives from Google Search, Display, YouTube, Performance Max, Instagram Reels, and Facebook Feeds. Ingests raw click IDs into browser session memory.',
    codeSnippet: `// Step 1: Capture Raw Click IDs from URL Query Params
const urlParams = new URLSearchParams(window.location.search);
const gclid = urlParams.get('gclid');
const fbclid = urlParams.get('fbclid');

// Persist in true first-party domain cookies (180-day retention)
if (gclid) document.cookie = \`_gcl_aw=\${gclid}; path=/; SameSite=Lax; max-age=15552000\`;
if (fbclid) document.cookie = \`_fbc=fb.1.\${Date.now()}.\${fbclid}; path=/; SameSite=Lax; max-age=15552000\`;`
  },
  {
    id: 2,
    slug: 'client-consent',
    name: 'Stage 2: Client Web Layer & Consent Engine',
    subtitle: 'GTM Web Container, First-Party Cookies & Consent Mode v2',
    yPos: 0.9,
    radiusTop: 3.1,
    radiusBottom: 2.1,
    height: 1.4,
    color: '#34A853',
    glowColor: '#FBBC05',
    tags: ['GTM Web', 'Consent Mode v2', '_fbp', '_fbc', 'Datalayer'],
    parameters: [
      { key: 'ad_storage', val: 'granted', desc: 'Controls cookie storage for advertising' },
      { key: 'ad_user_data', val: 'granted', desc: 'Allows user data to be transmitted to Google for ads' },
      { key: 'ad_personalization', val: 'granted', desc: 'Controls remarketing audience eligibility' },
      { key: '_fbp', val: 'fb.1.1729482910.8491', desc: 'Meta Browser ID preserved for cross-session attribution' }
    ],
    description: 'The web GTM container audits consent state signals before executing any measurement tag. Standardizes structured ecommerce datalayers and generates persistent first-party identifiers.',
    codeSnippet: `// Step 2: Consent Mode v2 Initialization & Datalayer Push
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}

gtag('consent', 'default', {
  'ad_storage': 'granted',
  'ad_user_data': 'granted',
  'ad_personalization': 'granted',
  'analytics_storage': 'granted',
  'wait_for_update': 500
});

// Push normalized purchase event with unique event_id
dataLayer.push({
  event: 'purchase',
  event_id: 'order_ORD-2026-99214',
  ecommerce: { transaction_id: 'ORD-2026-99214', value: 349.00, currency: 'USD' }
});`
  },
  {
    id: 3,
    slug: 'server-encryption',
    name: 'Stage 3: Server-Side Processing & Encryption',
    subtitle: 'Server GTM (sGTM), Cloud Run & SHA-256 Hashing',
    yPos: -0.8,
    radiusTop: 1.9,
    radiusBottom: 1.1,
    height: 1.4,
    color: '#8A2BE2',
    glowColor: '#00C6FF',
    tags: ['sGTM', 'Cloud Run', 'SHA-256', 'ITP Bypass', 'Adblock Proof'],
    parameters: [
      { key: 'sha256(email)', val: '7a38b31a89c22e4c029...', desc: 'Normalized (trimmed, lowercase) SHA-256 email hash' },
      { key: 'sha256(phone)', val: '8c48e02d8471e892c90...', desc: 'E.164 formatted hashed customer phone number' },
      { key: 'client_ip_address', val: '198.51.100.42', desc: 'Server-extracted clean IP address' },
      { key: 'client_user_agent', val: 'Mozilla/5.0 (iPhone...', desc: 'Server-verified hardware user agent string' }
    ],
    description: 'Server GTM on Google Cloud Run intercepts browser hits. Validates, strips sensitive PII, securely hashes customer emails and phones using SHA-256, and enriches payloads with server IP and user agent.',
    codeSnippet: `// Step 3: Server GTM Cryptographic Hashing Transformation
// Input: "  John.Doe@Gmail.com " -> Output: sha256("john.doe@gmail.com")
const normalizeEmail = (raw) => raw.trim().toLowerCase();
const hashedEmail = sha256(normalizeEmail(eventModel.customer_email));

const serverPayload = {
  event_id: eventModel.event_id,
  user_data: {
    sha256_email_address: hashedEmail,
    client_ip_address: request.ip,
    client_user_agent: request.headers['user-agent']
  }
};`
  },
  {
    id: 4,
    slug: 'api-dispatch',
    name: 'Stage 4: Direct API Dispatch & Deduplication',
    subtitle: 'Google Enhanced Conversions API & Meta Graph CAPI',
    yPos: -2.5,
    radiusTop: 0.95,
    radiusBottom: 0.35,
    height: 1.4,
    color: '#00E5FF',
    glowColor: '#34A853',
    tags: ['Google Ads API', 'Meta CAPI', 'Event Deduplication', 'SA360 Floodlight'],
    parameters: [
      { key: 'match_status', val: 'MATCHED_VERIFIED', desc: 'Direct server-to-server match confirmation' },
      { key: 'dedup_window', val: '48 Hours', desc: 'Browser pixel + Server CAPI deduplicated via event_id' },
      { key: 'emq_score', val: '9.2 / 10', desc: 'Meta Event Match Quality in top 5% of all advertisers' },
      { key: 'sa360_floodlight', val: 'Counter & Sales Tag Sync', desc: 'Real-time conversion postback to SA360 engine' }
    ],
    description: 'Direct server-to-server dispatch to Google Ads Conversion API and Meta Graph API. The shared event_id guarantees 100% deduplication between client pixel and server stream, unlocking optimal smart bidding.',
    codeSnippet: `// Step 4: Dispatch to Meta Graph API & Google Ads API
// Meta Graph API POST
fetch('https://graph.facebook.com/v20.0/' + pixelId + '/events?access_token=' + capiToken, {
  method: 'POST',
  body: JSON.stringify({ data: [metaCapiPayload] })
});

// Google Ads API Enhanced Conversion Upload
googleAdsClient.conversionUploads.uploadCallConversions({
  customerId: '847-291-0394',
  conversions: [googleEnhancedConversionPayload]
});`
  }
];

// Cascading particle waterfall passing through the funnel
const FunnelParticles = ({
  activeStageId,
  isBursting,
  filter
}: {
  activeStageId: number;
  isBursting: boolean;
  filter: PlatformFilter;
}) => {
  const count = 160;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Generate particle parameters: start angle, radius ratio, speed, vertical progress
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      angle: (i / count) * Math.PI * 2 + Math.random() * 0.2,
      angularSpeed: 0.8 + Math.random() * 1.5,
      y: (i / count) * 6.5 - 3.2, // spans from +3.3 down to -3.2
      baseSpeed: 0.8 + Math.random() * 0.8,
      wobble: Math.random() * Math.PI * 2,
      platform: i % 2 === 0 ? 'google' : 'meta'
    }));
  }, [count]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    const speedMultiplier = isBursting ? 3.0 : 1.0;

    particles.forEach((p, i) => {
      // Progress downwards
      p.y -= delta * p.baseSpeed * speedMultiplier;
      p.angle += delta * p.angularSpeed;

      // Reset to top when passing bottom
      if (p.y < -3.5) {
        p.y = 3.4;
      }

      // Compute radius of funnel at this y-coordinate
      // Y goes from +3.3 (radius ~4.2) down to -3.2 (radius ~0.4)
      const normalizedY = (p.y + 3.2) / 6.5; // 0 at bottom, 1 at top
      const clampedNormY = Math.max(0, Math.min(1, normalizedY));
      // Non-linear funnel taper curve
      const funnelRadius = 0.35 + Math.pow(clampedNormY, 1.2) * 3.7;

      const currentRadius = funnelRadius * (0.65 + Math.sin(p.wobble + p.y * 3) * 0.25);
      const x = Math.cos(p.angle) * currentRadius;
      const z = Math.sin(p.angle) * currentRadius;

      dummy.position.set(x, p.y, z);

      // Check visibility by filter
      const isVisible = filter === 'all' || filter === p.platform;
      if (!isVisible) {
        dummy.scale.set(0, 0, 0);
      } else {
        // Particle glows larger when passing through the active stage
        const activeStage = FUNNEL_STAGES.find(s => s.id === activeStageId);
        const isNearActiveStage = activeStage && Math.abs(p.y - activeStage.yPos) < 0.8;
        const scale = isNearActiveStage ? (isBursting ? 0.22 : 0.16) : 0.08;
        dummy.scale.set(scale, scale, scale);
      }

      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 12, 12]} />
      <meshStandardMaterial
        color="#ffffff"
        emissive={filter === 'google' ? '#4285F4' : filter === 'meta' ? '#00C6FF' : '#00E5FF'}
        emissiveIntensity={isBursting ? 4.0 : 2.5}
        roughness={0.1}
        toneMapped={false}
      />
    </instancedMesh>
  );
};

// Funnel Tier Component
const FunnelTierMesh = ({
  stage,
  isSelected,
  onClick
}: {
  stage: FunnelStage;
  isSelected: boolean;
  onClick: (stage: FunnelStage) => void;
}) => {
  const ringRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.6;
    }
  });

  return (
    <group position={[0, stage.yPos, 0]}>
      {/* Outer Clickable Truncated Cone */}
      <mesh
        ref={coreRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick(stage);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        <cylinderGeometry
          args={[stage.radiusTop, stage.radiusBottom, stage.height, 48, 1, true]}
        />
        <meshStandardMaterial
          color={stage.color}
          emissive={stage.glowColor}
          emissiveIntensity={isSelected ? 1.8 : 0.35}
          wireframe={!isSelected}
          transparent
          opacity={isSelected ? 0.65 : 0.25}
          side={THREE.DoubleSide}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Inner Translucent Frosted Glass Lining */}
      <mesh>
        <cylinderGeometry
          args={[stage.radiusTop * 0.98, stage.radiusBottom * 0.98, stage.height * 0.96, 36, 1, true]}
        />
        <meshPhysicalMaterial
          color={stage.color}
          transparent
          opacity={isSelected ? 0.3 : 0.08}
          roughness={0.1}
          metalness={0.1}
          clearcoat={1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Orbiting Laser Boundary Ring */}
      <Torus
        ref={ringRef}
        args={[stage.radiusTop + 0.15, isSelected ? 0.04 : 0.02, 16, 64]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <meshBasicMaterial
          color={isSelected ? '#ffffff' : stage.glowColor}
          transparent
          opacity={isSelected ? 0.9 : 0.4}
        />
      </Torus>

      {/* Bottom Ring of the Tier */}
      <Torus
        args={[stage.radiusBottom + 0.08, 0.015, 16, 48]}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, -stage.height / 2, 0]}
      >
        <meshBasicMaterial
          color={stage.glowColor}
          transparent
          opacity={isSelected ? 0.7 : 0.2}
        />
      </Torus>

      {/* 3D Floating Stage Label Pin */}
      <Html
        position={[stage.radiusTop + 0.6, 0, 0]}
        center
        distanceFactor={10}
        className="pointer-events-none select-none"
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
            onClick(stage);
          }}
          className={`pointer-events-auto cursor-pointer transition-all duration-300 flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-xl backdrop-blur-md whitespace-nowrap text-xs font-mono ${
            isSelected
              ? 'bg-white text-black border-white font-bold scale-110 shadow-white/30'
              : 'bg-black/80 text-white/90 border-white/20 hover:border-white/50'
          }`}
        >
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: stage.color }}
          />
          <span>Stage {stage.id}</span>
        </div>
      </Html>
    </group>
  );
};

// Bottom Laser Beam firing downward from Stage 4
const BottomLaserBeam = ({ isSelected }: { isSelected: boolean }) => {
  const beamRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (beamRef.current) {
      beamRef.current.rotation.y += delta * 2;
    }
  });

  return (
    <group position={[0, -3.8, 0]}>
      {/* Laser Column */}
      <mesh ref={beamRef}>
        <cylinderGeometry args={[0.22, 0.05, 1.8, 16]} />
        <meshBasicMaterial
          color="#00E5FF"
          transparent
          opacity={isSelected ? 0.9 : 0.5}
        />
      </mesh>

      {/* Impact Light Disk */}
      <mesh position={[0, -0.9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.05, 1.2, 32]} />
        <meshBasicMaterial
          color="#00E5FF"
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

interface Ads3DSceneProps {
  activeStage: FunnelStage;
  onSelectStage: (stage: FunnelStage) => void;
  isBursting: boolean;
  filter: PlatformFilter;
}

export const Ads3DScene: React.FC<Ads3DSceneProps> = ({
  activeStage,
  onSelectStage,
  isBursting,
  filter
}) => {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0.5, 9.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, 8, 5]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-6, 4, -4]} intensity={1.2} color="#4285F4" />
        <pointLight position={[6, -4, 4]} intensity={1.2} color="#00C6FF" />

        {/* Funnel Tiers */}
        {FUNNEL_STAGES.map((stage) => (
          <FunnelTierMesh
            key={stage.id}
            stage={stage}
            isSelected={activeStage.id === stage.id}
            onClick={onSelectStage}
          />
        ))}

        {/* Bottom Attribution Laser */}
        <BottomLaserBeam isSelected={activeStage.id === 4} />

        {/* Cascading Particles */}
        <FunnelParticles
          activeStageId={activeStage.id}
          isBursting={isBursting}
          filter={filter}
        />

        <OrbitControls
          enableZoom={true}
          minDistance={6}
          maxDistance={15}
          enablePan={false}
          autoRotate={false}
          dampingFactor={0.05}
        />
      </Canvas>

      {/* Floating HUD Helper */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none flex flex-col gap-1">
        <span className="text-[11px] font-mono uppercase tracking-widest text-text-secondary/80 bg-bg-primary/80 backdrop-blur px-3 py-1.5 rounded-lg border border-white/10 inline-flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-green animate-ping" />
          Interactive 3D Visual Conversion Funnel
        </span>
        <span className="text-[10px] font-mono text-text-secondary/50 ml-1">
          Click any funnel tier or use step controls below • Drag to rotate
        </span>
      </div>
    </div>
  );
};
