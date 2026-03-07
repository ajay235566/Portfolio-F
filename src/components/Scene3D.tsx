import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const CustomModel = () => {
  const { scene } = useGLTF('/69abdbebdea6e53d0c439ab4.glb');
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <primitive ref={groupRef} object={scene} scale={2} position={[0, -1.8, 0]} />
    </Float>
  );
};

useGLTF.preload('/69abdbebdea6e53d0c439ab4.glb');

export const Scene3D = () => {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing" style={{ touchAction: 'pan-y' }}>
      <Canvas camera={{ position: [0, 1, 5], fov: 45 }} style={{ touchAction: 'pan-y' }} resize={{ scroll: false }}>
        <ambientLight intensity={1.3} />
        <directionalLight position={[5, 5, 5]} intensity={1.6} />
        <pointLight position={[0, 5, 5]} intensity={1} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={0.8} />

        <Suspense fallback={null}>
          <CustomModel />
        </Suspense>

        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
      <div className="absolute bottom-4 left-4 pointer-events-none">
        {/* <p className="text-[15px] font-mono text-white/20 uppercase tracking-widest">Ajay Kumar Nallamothu</p> */}
      </div>
    </div>
  );
};
