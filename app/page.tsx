"use client";

import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, MeshDistortMaterial, ScrollControls, Scroll, useScroll } from '@react-three/drei';
import { useRef, Suspense } from 'react';
import * as THREE from 'three';

function CentralCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.5, 0]} />
        <MeshDistortMaterial 
          color="#d4af37" // Gold for Recrenzo theme
          emissive="#d4af37"
          emissiveIntensity={0.5}
          distort={0.3} 
          speed={2} 
        />
      </mesh>
    </Float>
  );
}

function Section({ title, subtitle, positionY }: { title: string, subtitle: string, positionY: number }) {
  return (
    <group position={[0, positionY, 0]}>
      <Text position={[0, 2, 0]} fontSize={0.7} color="#d4af37" font="sans-serif" anchorX="center">
        {title}
      </Text>
      <Text position={[0, 1, 0]} fontSize={0.2} color="#ffffff" maxWidth={4} textAlign="center">
        {subtitle}
      </Text>
    </group>
  );
}

function Scene() {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.y = scroll.offset * 30;
    }
  });

  return (
    <group ref={groupRef}>
      <CentralCore />
      <Section 
        title="THE STRATEGIST" 
        subtitle="Mastering Pine Script & Trading Logic. Developing custom indicators for financial precision." 
        positionY={-10} 
      />
      <Section 
        title="THE ALCHEMIST" 
        subtitle="Founder of Recrenzo. Crafting AI-powered content and high-conversion Shopify experiences." 
        positionY={-20} 
      />
    </group>
  );
}

export default function Home() {
  return (
    <main className="w-full h-screen bg-[#050505]">
      <Suspense fallback={null}>
        <Canvas camera={{ position: [0, 0, 8] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#d4af37" />
          <ScrollControls pages={3} damping={0.2}>
            <Scene />
          </ScrollControls>
        </Canvas>
      </Suspense>

      {/* Modern Overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-12">
        <div className="flex justify-between items-start pointer-events-auto">
          <h1 className="text-white font-light tracking-[0.5em] text-xl">KRISHNA TILOKANI</h1>
          <div className="text-[#d4af37] text-xs tracking-widest border border-[#d4af37]/30 px-4 py-2 rounded-full">
            CLASS 11 PCM | MAHARASHTRA
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <p className="text-white/40 text-[10px] tracking-[0.3em] mb-4 uppercase">Scroll to Interface</p>
          <button className="pointer-events-auto bg-transparent border border-[#d4af37] text-[#d4af37] px-8 py-3 text-xs tracking-[0.2em] hover:bg-[#d4af37] hover:text-black transition-all">
            ACCESS TERMINAL
          </button>
        </div>
      </div>
    </main>
  );
}