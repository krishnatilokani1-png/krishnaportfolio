"use client";

import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, Stars, ScrollControls, Scroll, useScroll, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';

function Hero3D() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={meshRef}>
        {/* A complex, high-tech 3D shape */}
        <torusKnotGeometry args={[2, 0.6, 150, 20]} />
        <MeshWobbleMaterial 
          color="#00ff88" 
          factor={0.4} 
          speed={1} 
          wireframe 
          emissive="#00ff88"
          emissiveIntensity={0.5}
        />
      </mesh>
    </Float>
  );
}

function Section({ title, subtitle, y }: { title: string; subtitle: string; y: number }) {
  return (
    <group position={[0, y, 0]}>
      <Text fontSize={0.8} color="#00ff88" font="sans-serif" anchorX="center">
        {title}
      </Text>
      <Text position={[0, -1, 0]} fontSize={0.25} color="white" maxWidth={6} textAlign="center">
        {subtitle}
      </Text>
    </group>
  );
}

function SceneContent() {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      // Moves the scene as you scroll
      groupRef.current.position.y = scroll.offset * 35;
    }
  });

  return (
    <group ref={groupRef}>
      <Hero3D />
      <Section 
        title="THE STRATEGIST" 
        subtitle="Expert in Pine Script & Trading Logic. Building financial precision tools." 
        y={-12} 
      />
      <Section 
        title="THE ALCHEMIST" 
        subtitle="Founder of Recrenzo. Crafting AI-powered content and brand identities." 
        y={-25} 
      />
    </group>
  );
}

export default function Home() {
  return (
    <main className="w-full h-screen bg-[#020202]">
      {/* 3D LAYER */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
          <color attach="background" args={['#020202']} />
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={2} color="#00ff88" />
          <Stars radius={100} depth={50} count={6000} factor={4} saturation={0} fade speed={1} />
          
          <Suspense fallback={null}>
            <ScrollControls pages={4} damping={0.2}>
              <Scroll>
                <SceneContent />
              </Scroll>
            </ScrollControls>
          </Suspense>
        </Canvas>
      </div>

      {/* UI OVERLAY LAYER */}
      <nav className="fixed top-0 w-full p-10 flex justify-between items-start z-10 pointer-events-none">
        <div className="border-l-2 border-[#00ff88] pl-6">
          <h1 className="text-white text-4xl font-black tracking-tight">KRISHNA TILOKANI</h1>
          <p className="text-[#00ff88] text-xs tracking-[0.5em] mt-2 font-mono">CLASS 11 PCM // SYSTEM_ACTIVE</p>
        </div>
        <div className="text-right text-white/40 text-[10px] uppercase tracking-[0.3em]">
          Nagpur, Maharashtra
        </div>
      </nav>

      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-10 text-center">
        <p className="text-white/30 text-[9px] tracking-[0.8em] uppercase mb-6 animate-pulse">Initiate Scroll</p>
        <button className="pointer-events-auto bg-transparent border border-[#00ff88] text-[#00ff88] px-10 py-4 text-xs font-bold tracking-[0.3em] hover:bg-[#00ff88] hover:text-black transition-all duration-500 rounded-sm uppercase">
          Open Terminal
        </button>
      </div>
    </main>
  );
}