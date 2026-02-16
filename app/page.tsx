"use client";

import React, { useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Float, Stars, ScrollControls, Scroll, useScroll, PerspectiveCamera, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// --- The Interactive 3D Core ---
function TechCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.4;
      meshRef.current.rotation.z = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[1.5, 0.4, 128, 32]} />
        <meshStandardMaterial 
          color="#00ff88" 
          emissive="#00ff88" 
          emissiveIntensity={0.8} 
          wireframe 
        />
      </mesh>
    </Float>
  );
}

// --- Floating Project Modules ---
function ProjectCard({ title, subtitle, position }: { title: string, subtitle: string, position: [number, number, number] }) {
  return (
    <group position={position}>
      <Text fontSize={0.8} color="#00ff88" font="sans-serif" anchorX="center">
        {title}
      </Text>
      <Text position={[0, -1, 0]} fontSize={0.25} color="white" maxWidth={5} textAlign="center">
        {subtitle}
      </Text>
      <mesh position={[0, -0.5, -0.5]}>
        <planeGeometry args={[6, 2]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.05} />
      </mesh>
    </group>
  );
}

function SceneContent() {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      // Moves the entire 3D scene vertically based on scroll
      groupRef.current.position.y = scroll.offset * 40;
    }
  });

  return (
    <group ref={groupRef}>
      <TechCore />
      
      {/* Scrollable Sections */}
      <ProjectCard 
        title="THE STRATEGIST" 
        subtitle="Pine Script Expert & Financial Logic Developer." 
        position={[0, -12, 0]} 
      />
      <ProjectCard 
        title="THE ALCHEMIST" 
        subtitle="Founder of Recrenzo. AI Content Creator & E-commerce Architect." 
        position={[0, -25, 0]} 
      />
      <ProjectCard 
        title="CONTACT" 
        subtitle="Nagpur, Maharashtra. Ready for the next evolution." 
        position={[0, -38, 0]} 
      />
    </group>
  );
}

export default function Home() {
  return (
    <main className="w-full h-screen bg-[#020202]">
      <div className="absolute inset-0 z-0">
        <Canvas shadow={false} dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
          <color attach="background" args={['#020202']} />
          
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#00ff88" />
          
          <Stars radius={100} depth={50} count={7000} factor={4} saturation={0} fade speed={1} />
          
          <Suspense fallback={null}>
            <ScrollControls pages={5} damping={0.1}>
              <Scroll>
                <SceneContent />
              </Scroll>
            </ScrollControls>
          </Suspense>
        </Canvas>
      </div>

      {/* --- HUD / UI OVERLAY --- */}
      <nav className="fixed top-0 w-full p-8 flex justify-between items-start z-10 pointer-events-none">
        <div>
          <h1 className="text-white text-3xl font-black tracking-tighter">KRISHNA TILOKANI</h1>
          <p className="text-[#00ff88] text-xs tracking-[0.4em] mt-2">SYSTEM.INITIALIZED // CLASS 11 PCM</p>
        </div>
        <div className="text-right">
          <p className="text-white/40 text-[10px] uppercase tracking-widest">Nagpur, IN</p>
        </div>
      </nav>

      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
        <div className="w-[1px] h-20 bg-gradient-to-b from-[#00ff88] to-transparent mb-4" />
        <p className="text-white/30 text-[9px] tracking-[0.5em] uppercase mb-8">Initiate Scroll</p>
        <button className="pointer-events-auto bg-transparent border border-[#00ff88] text-[#00ff88] px-12 py-4 text-xs font-bold tracking-[0.2em] hover:bg-[#00ff88] hover:text-black transition-all duration-500 rounded-sm">
          OPEN TERMINAL
        </button>
      </div>
    </main>
  );
}