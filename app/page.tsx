"use client";

import React, { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, PerspectiveCamera, Environment, Grid } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// --- 3D BACKGROUND COMPONENTS ---

function RotatingObelisk({ isDark }: { isDark: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        <boxGeometry args={[1.8, 6.5, 1.8]} />
        <meshStandardMaterial 
          color={isDark ? "#080808" : "#ffffff"} 
          roughness={0.1} 
          metalness={0.9} 
          emissive={isDark ? "#00ff88" : "#999999"}
          emissiveIntensity={isDark ? 0.3 : 0.1}
        />
      </mesh>
      <mesh ref={meshRef} scale={[1.05, 1.05, 1.05]}>
        <boxGeometry args={[1.8, 6.5, 1.8]} />
        <meshBasicMaterial color={isDark ? "#00ff88" : "#000000"} wireframe transparent opacity={0.1} />
      </mesh>
    </Float>
  );
}

function MovingGrid({ isDark }: { isDark: boolean }) {
  return (
    <group position={[0, -4, 0]} rotation={[Math.PI / 2.5, 0, 0]}>
      <Grid 
        cellColor={isDark ? "#00ff88" : "#000000"} 
        sectionColor={isDark ? "#005533" : "#aaaaaa"} 
        infiniteGrid 
        fadeDistance={40} 
        sectionSize={2} 
      />
    </group>
  );
}

function BackgroundScene({ isDark }: { isDark: boolean }) {
  return (
    <>
      <ambientLight intensity={isDark ? 0.5 : 1.5} />
      <pointLight position={[10, 10, 10]} intensity={2} color={isDark ? "#00ff88" : "#ffffff"} />
      <Stars radius={100} depth={50} count={isDark ? 6000 : 0} factor={4} saturation={0} fade />
      <Environment preset={isDark ? "city" : "studio"} />
      <RotatingObelisk isDark={isDark} />
      <MovingGrid isDark={isDark} />
    </>
  );
}

// --- TEXT CONTENT COMPONENTS ---

function Section({ children, align = "center" }: { children: React.ReactNode, align?: "left" | "center" | "right" }) {
  return (
    <section className={`min-h-screen w-full flex flex-col justify-center px-8 md:px-24 py-20 ${
      align === "left" ? "items-start" : align === "right" ? "items-end text-right" : "items-center text-center"
    }`}>
      {children}
    </section>
  );
}

// --- MAIN PAGE ---

export default function Home() {
  const [isDark, setIsDark] = useState(true);

  return (
    <main className={`relative w-full min-h-screen transition-colors duration-700 ${isDark ? "bg-black text-white" : "bg-gray-100 text-black"}`}>
      
      {/* LAYER 1: FIXED 3D BACKGROUND (Wallpaper) */}
      <div className="fixed top-0 left-0 w-full h-full z-0">
        <Canvas gl={{ antialias: true }} dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={45} />
          <Suspense fallback={null}>
            <BackgroundScene isDark={isDark} />
          </Suspense>
        </Canvas>
      </div>

      {/* LAYER 2: SCROLLABLE CONTENT (Overlay) */}
      <div className="relative z-10 w-full">
        
        {/* Navigation */}
        <nav className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50 mix-blend-difference text-white">
          <h1 className="text-xl font-bold tracking-tighter">KRISHNA.IO</h1>
          <button 
            onClick={() => setIsDark(!isDark)}
            className="px-4 py-1 border border-white/30 rounded-full text-xs hover:bg-white hover:text-black transition-all bg-black/50 backdrop-blur-md"
          >
            {isDark ? "LIGHT MODE" : "DARK MODE"}
          </button>
        </nav>

        {/* HERO */}
        <Section>
          <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="backdrop-blur-sm p-10 rounded-2xl border border-white/5 bg-black/20"
          >
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
              IT'S ME, KRISHNA
            </h1>
            <p className="text-lg md:text-xl tracking-[0.3em] font-light opacity-90">
              CLASS 11 PCM | MAHARASHTRA
            </p>
          </motion.div>
        </Section>

        {/* STRATEGIST */}
        <Section align="left">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className={`max-w-2xl p-8 rounded-xl border backdrop-blur-md shadow-2xl ${isDark ? "bg-black/60 border-green-500/30" : "bg-white/60 border-black/10"}`}
          >
            <h2 className="text-4xl font-bold mb-4 text-green-400">THE STRATEGIST</h2>
            <p className="text-xl leading-relaxed opacity-90 mb-6 font-light">
              I don't just trade; I engineer profit. Using <strong className="text-green-400">Pine Script</strong> and advanced financial logic, 
              I build custom indicators that decode market movements before they happen.
            </p>
            <div className="flex gap-3 flex-wrap">
              {['TRADINGVIEW', 'PYTHON', 'MATHS'].map(tag => (
                <span key={tag} className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/50">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </Section>

        {/* ALCHEMIST */}
        <Section align="right">
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className={`max-w-2xl p-8 rounded-xl border backdrop-blur-md shadow-2xl ${isDark ? "bg-black/60 border-blue-500/30" : "bg-white/60 border-black/10"}`}
          >
            <h2 className="text-4xl font-bold mb-4 text-blue-400">THE ALCHEMIST</h2>
            <p className="text-xl leading-relaxed opacity-90 mb-6 font-light">
              Founder of <strong className="text-blue-400">RECRENZO</strong>. I fuse AI-generated video content with Shopify infrastructure 
              to create high-conversion e-commerce experiences.
            </p>
            <div className="flex gap-3 justify-end flex-wrap">
              {['SHOPIFY', 'META ADS', 'AI VIDEO'].map(tag => (
                <span key={tag} className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full border border-blue-500/50">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </Section>

        {/* CONTACT */}
        <Section>
          <div className="text-center">
            <h2 className="text-3xl font-light tracking-[0.5em] mb-10">SYSTEM READY</h2>
            <button className={`px-12 py-4 text-sm font-bold tracking-widest border rounded-sm transition-all hover:scale-105 ${isDark ? "border-green-400 text-green-400 hover:bg-green-400 hover:text-black" : "border-black text-black hover:bg-black hover:text-white"}`}>
              INITIATE CONTACT
            </button>
            <p className="mt-8 text-xs opacity-50 tracking-widest">NAGPUR, INDIA</p>
          </div>
        </Section>

      </div>
    </main>
  );
}