"use client";

import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, Stars, ScrollControls, Scroll, useScroll, MeshDistortMaterial } from '@react-three/drei';
import { useRef, Suspense } from 'react';
import * as THREE from 'three';

function AnimatedShape() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
    }
  });

  return (
    <Float speed={3} rotationIntensity={2} floatIntensity={2}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial color="#d4af37" wireframe />
      </mesh>
    </Float>
  );
}

function Section({ title, subtitle, positionY }: { title: string, subtitle: string, positionY: number }) {
  return (
    <group position={[0, positionY, 0]}>
      <Text position={[0, 2, 0]} fontSize={0.7} color="#d4af37" anchorX="center">
        {title}
      </Text>
      <Text position={[0, 1, 0]} fontSize={0.2} color="#ffffff" maxWidth={4} textAlign="center">
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
      // Moves the entire world up as you scroll down
      groupRef.current.position.y = scroll.offset * 25;
    }
  });

  return (
    <group ref={groupRef}>
      <AnimatedShape />
      <Section 
        title="THE STRATEGIST" 
        subtitle="Expert in Pine Script & Trading Logic." 
        positionY={-10} 
      />
      <Section 
        title="THE ALCHEMIST" 
        subtitle="Founder of Recrenzo & AI Video Creator." 
        positionY={-20} 
      />
    </group>
  );
}

export default function Home() {
  return (
    <main className="w-full h-screen bg-black">
      <Suspense fallback={<div className="text-white p-10">Loading 3D...</div>}>
        <Canvas camera={{ position: [0, 0, 7] }}>
          <ambientLight intensity={1} />
          <pointLight position={[10, 10, 10]} intensity={2} color="#d4af37" />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
          <ScrollControls pages={3} damping={0.1}>
            <SceneContent />
          </ScrollControls>
        </Canvas>
      </Suspense>

      {/* 2D Overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-12">
        <div className="flex justify-between items-start">
          <h1 className="text-white font-bold tracking-widest text-2xl">KRISHNA TILOKANI</h1>
          <div className="text-[#d4af37] text-xs border border-[#d4af37] px-4 py-2 rounded-full">
            CLASS 11 PCM | MAHARASHTRA
          </div>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-white/50 text-[10px] tracking-[0.3em] mb-4">SCROLL TO EXPLORE</p>
          <button className="pointer-events-auto bg-transparent border border-[#d4af37] text-[#d4af37] px-8 py-3 hover:bg-[#d4af37] hover:text-black transition-all">
            ACCESS TERMINAL
          </button>
        </div>
      </div>
    </main>
  );
}