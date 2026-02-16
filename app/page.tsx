"use client";

import React, { useState, useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Text, 
  Float, 
  Stars, 
  ScrollControls, 
  Scroll, 
  useScroll, 
  MeshDistortMaterial, 
  MeshWobbleMaterial, 
  Environment, 
  Grid 
} from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// --- THEME CONFIGURATION ---
const THEMES = {
  dark: {
    bg: "#050505",
    text: "#ffffff",
    accent: "#00ff88", // Neon Cyber Green
    secondary: "#00d2ff", // Cyber Blue
    grid: "#1a1a1a",
    obelisk: "#111111"
  },
  light: {
    bg: "#e0e0e0",
    text: "#1a1a1a",
    accent: "#2a2a2a", // Modern Zen Dark Grey
    secondary: "#888888",
    grid: "#cccccc",
    obelisk: "#ffffff"
  }
};

// --- 3D COMPONENTS ---

function Obelisk({ theme }: { theme: any }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Slow, mysterious rotation
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
      // Subtle breathing pulse
      const scale = 1 + Math.sin(state.clock.getElapsedTime()) * 0.02;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <boxGeometry args={[1.5, 6, 1.5]} />
        <meshStandardMaterial 
          color={theme.obelisk} 
          roughness={0.1} 
          metalness={0.8}
          emissive={theme.accent}
          emissiveIntensity={0.2} 
        />
      </mesh>
      {/* Halo Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -2.5, 0]}>
        <ringGeometry args={[2, 2.1, 64]} />
        <meshBasicMaterial color={theme.accent} transparent opacity={0.5} />
      </mesh>
    </Float>
  );
}

function StrategistSection({ theme }: { theme: any }) {
  return (
    <group position={[0, -15, 0]}>
      {/* 3D Grid Floor */}
      <Grid 
        position={[0, -2, 0]} 
        args={[20, 20]} 
        cellColor={theme.grid} 
        sectionColor={theme.accent} 
        fadeDistance={15} 
      />
      
      {/* Floating Geometric Icons (Bull & Bear) */}
      <Float speed={4} rotationIntensity={1.5} position={[-3, 1, 0]}>
        <mesh>
          <octahedronGeometry args={[1]} />
          <meshStandardMaterial color={theme.accent} wireframe />
        </mesh>
      </Float>
      <Float speed={3} rotationIntensity={2} position={[3, 2, -1]}>
        <mesh>
          <icosahedronGeometry args={[0.8]} />
          <meshStandardMaterial color={theme.secondary} wireframe />
        </mesh>
      </Float>
    </group>
  );
}

function AlchemistSection({ theme }: { theme: any }) {
  return (
    <group position={[0, -30, 0]}>
      {/* Floating Creative Spheres */}
      {Array.from({ length: 4 }).map((_, i) => (
        <Float key={i} speed={2} position={[(i - 1.5) * 3, Math.sin(i) * 2, -2]}>
          <mesh>
            <sphereGeometry args={[0.6, 32, 32]} />
            <MeshDistortMaterial 
              color={i % 2 === 0 ? theme.accent : theme.secondary} 
              speed={2} 
              distort={0.4} 
              radius={1} 
            />
          </mesh>
        </Float>
      ))}
      
      {/* Background Film Strip Effect */}
      <mesh position={[0, 0, -5]}>
        <planeGeometry args={[20, 8]} />
        <meshBasicMaterial color={theme.bg} transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

function StorytellerCamera() {
  const scroll = useScroll();
  const { camera } = useThree();
  
  useFrame(() => {
    // This connects the scroll bar to the camera position
    // As you scroll 0 to 1, camera moves from Y=0 to Y=-45
    const t = scroll.offset;
    camera.position.y = THREE.MathUtils.lerp(0, -45, t);
    camera.lookAt(0, -45 * t, 0);
  });
  
  return null;
}

function Scene({ isDark }: { isDark: boolean }) {
  const theme = isDark ? THEMES.dark : THEMES.light;

  return (
    <>
      <ambientLight intensity={isDark ? 0.5 : 1} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color={theme.accent} />
      <Environment preset={isDark ? "city" : "studio"} />
      
      {/* Background Stars (Only prominent in Dark Mode) */}
      <Stars 
        radius={100} 
        depth={50} 
        count={isDark ? 5000 : 500} 
        factor={4} 
        saturation={0} 
        fade 
      />

      {/* --- HERO SECTION --- */}
      <group position={[0, 0, 0]}>
        <Obelisk theme={theme} />
        <Text 
          position={[0, 0, 2.5]} 
          fontSize={1} 
          color={theme.text} 
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
          anchorX="center" 
          anchorY="middle"
        >
          IT'S ME, KRISHNA
        </Text>
      </group>

      {/* --- CONTENT SECTIONS --- */}
      <StrategistSection theme={theme} />
      <AlchemistSection theme={theme} />
      
      {/* --- CAMERA RIG --- */}
      <StorytellerCamera />
    </>
  );
}

// --- MAIN PAGE COMPONENT ---

export default function Home() {
  const [isDark, setIsDark] = useState(true); // Default to Dark/Cyber mode
  const theme = isDark ? THEMES.dark : THEMES.light;

  return (
    <main 
      className="w-full h-screen transition-colors duration-700 ease-in-out" 
      style={{ backgroundColor: theme.bg }}
    >
      {/* --- UI NAVIGATION (Fixed) --- */}
      <nav className="fixed top-0 w-full p-6 flex justify-between items-center z-50 pointer-events-none mix-blend-difference">
        <div>
          <h1 className="text-2xl font-black tracking-tighter" style={{ color: isDark ? '#fff' : '#000' }}>
            KRISHNA TILOKANI
          </h1>
          <p className="text-xs tracking-[0.3em] font-bold opacity-70" style={{ color: isDark ? '#fff' : '#000' }}>
            CLASS 11 PCM
          </p>
        </div>
        <button 
          onClick={() => setIsDark(!isDark)}
          className="pointer-events-auto px-6 py-2 rounded-full text-xs font-bold border transition-all hover:scale-105"
          style={{ 
            borderColor: isDark ? '#fff' : '#000', 
            color: isDark ? '#fff' : '#000' 
          }}
        >
          {isDark ? 'SWITCH TO ZEN' : 'SWITCH TO CYBER'}
        </button>
      </nav>

      {/* --- 3D CANVAS --- */}
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 8], fov: 50 }}>
        <Suspense fallback={null}>
          <ScrollControls pages={4} damping={0.2}>
            <Scene isDark={isDark} />
            
            {/* --- HTML OVERLAY CONTENT --- */}
            <Scroll html>
              <div className="w-screen">
                
                {/* HERO OVERLAY */}
                <section className="h-screen flex flex-col justify-end items-center pb-20 pointer-events-none">
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ delay: 1, duration: 1 }}
                    className="text-center"
                  >
                    <p className="text-[10px] tracking-[0.5em] uppercase mb-4" style={{ color: theme.text }}>
                      Scroll to Begin Journey
                    </p>
                    <div className="w-[1px] h-16 mx-auto bg-gradient-to-b from-transparent to-current" style={{ color: theme.accent }} />
                  </motion.div>
                </section>

                {/* STRATEGIST SECTION */}
                <section className="h-screen flex items-center justify-start px-8 md:px-32">
                  <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-lg p-8 rounded-2xl backdrop-blur-md border"
                    style={{ 
                      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.6)',
                      borderColor: theme.grid,
                      boxShadow: isDark ? '0 0 20px rgba(0,255,136,0.1)' : '0 10px 30px rgba(0,0,0,0.05)'
                    }}
                  >
                    <h2 className="text-4xl font-black mb-2 tracking-tight" style={{ color: theme.text }}>
                      THE STRATEGIST
                    </h2>
                    <div className="h-1 w-20 mb-6" style={{ backgroundColor: theme.accent }} />
                    <p className="text-sm leading-loose mb-4 opacity-80" style={{ color: theme.text }}>
                      Decoding the language of the markets. Specializing in 
                      <strong style={{ color: theme.accent }}> Pine Script</strong> and 
                      <strong style={{ color: theme.secondary }}> Financial Logic</strong> to build high-precision trading algorithms.
                    </p>
                    <div className="flex gap-2">
                      {['TradingView', 'Python', 'Maths'].map(tag => (
                        <span key={tag} className="text-[10px] px-3 py-1 border rounded-full" style={{ borderColor: theme.accent, color: theme.text }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </section>

                {/* ALCHEMIST SECTION */}
                <section className="h-screen flex items-center justify-end px-8 md:px-32">
                  <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-lg p-8 rounded-2xl backdrop-blur-md border text-right"
                    style={{ 
                      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.6)',
                      borderColor: theme.grid
                    }}
                  >
                    <h2 className="text-4xl font-black mb-2 tracking-tight" style={{ color: theme.text }}>
                      THE ALCHEMIST
                    </h2>
                    <div className="h-1 w-20 mb-6 ml-auto" style={{ backgroundColor: theme.accent }} />
                    <p className="text-sm leading-loose mb-4 opacity-80" style={{ color: theme.text }}>
                      Transmuting ideas into digital gold. Founder of 
                      <strong style={{ color: theme.accent }}> Recrenzo</strong>. 
                      Merging AI-generated video content with high-conversion Shopify stores.
                    </p>
                    <div className="flex gap-2 justify-end">
                      {['AI Video', 'Shopify', 'Meta Ads'].map(tag => (
                        <span key={tag} className="text-[10px] px-3 py-1 border rounded-full" style={{ borderColor: theme.accent, color: theme.text }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </section>

                {/* CONTACT SECTION */}
                <section className="h-screen flex flex-col items-center justify-center">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    className="text-center"
                  >
                    <h2 className="text-2xl font-bold mb-8 tracking-[0.5em]" style={{ color: theme.text }}>
                      SYSTEM READY
                    </h2>
                    <button 
                      className="group relative px-12 py-4 bg-transparent border overflow-hidden rounded-sm transition-all duration-300 hover:scale-105"
                      style={{ borderColor: theme.accent }}
                    >
                      <span className="relative z-10 font-bold tracking-[0.2em]" style={{ color: theme.accent }}>
                        CONTACT TERMINAL
                      </span>
                      <div 
                        className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300" 
                        style={{ backgroundColor: theme.accent }} 
                      />
                    </button>
                    <p className="mt-8 text-[10px] uppercase tracking-widest opacity-50" style={{ color: theme.text }}>
                      Nagpur, Maharashtra, India
                    </p>
                  </motion.div>
                </section>

              </div>
            </Scroll>
          </ScrollControls>
        </Suspense>
      </Canvas>
    </main>
  );
}