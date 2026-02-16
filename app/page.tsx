"use client";

import React, { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, PerspectiveCamera, Environment, Grid } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// --- 3D COMPONENTS ---

function RotatingObelisk({ isDark }: { isDark: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        <boxGeometry args={[1.5, 5, 1.5]} />
        <meshStandardMaterial 
          color={isDark ? "#111" : "#fff"} 
          emissive={isDark ? "#00ff88" : "#ccc"}
          emissiveIntensity={0.5}
        />
      </mesh>
    </Float>
  );
}

function BackgroundScene({ isDark }: { isDark: boolean }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#00ff88" />
      <Stars radius={100} count={5000} factor={4} fade />
      <Environment preset="city" />
      <RotatingObelisk isDark={isDark} />
      <Grid position={[0, -4, 0]} args={[20, 20]} cellColor="#00ff88" sectionColor="#00ff88" fadeDistance={20} />
    </>
  );
}

// --- MAIN COMPONENT ---

export default function Home() {
  const [isDark, setIsDark] = useState(true);

  // HARD-CODED STYLES (These work even if Tailwind fails)
  const containerStyle = {
    position: 'fixed' as 'fixed', // Forces it to stay put
    top: 0,
    left: 0,
    width: '100vw', // 100% of viewport width
    height: '100vh', // 100% of viewport height
    backgroundColor: isDark ? '#000000' : '#e0e0e0',
    color: isDark ? '#ffffff' : '#000000',
    overflow: 'hidden',
    zIndex: 0
  };

  const overlayStyle = {
    position: 'absolute' as 'absolute',
    zIndex: 10,
    width: '100%',
    height: '100%',
    overflowY: 'scroll' as 'scroll', // Allows scrolling over the 3D background
    paddingTop: '20px'
  };

  const sectionStyle = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    textAlign: 'center' as 'center'
  };

  return (
    <div style={containerStyle}>
      
      {/* LAYER 1: 3D BACKGROUND */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 10]} />
          <Suspense fallback={null}>
            <BackgroundScene isDark={isDark} />
          </Suspense>
        </Canvas>
      </div>

      {/* LAYER 2: CONTENT OVERLAY */}
      <div style={overlayStyle}>
        
        {/* NAV */}
        <nav style={{ position: 'fixed', top: 0, width: '100%', padding: '20px', display: 'flex', justifyContent: 'space-between', zIndex: 50 }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>KRISHNA.IO</h1>
          <button 
            onClick={() => setIsDark(!isDark)}
            style={{ padding: '10px 20px', borderRadius: '20px', border: '1px solid currentColor', background: 'transparent', color: 'inherit', cursor: 'pointer' }}
          >
            {isDark ? 'LIGHT MODE' : 'DARK MODE'}
          </button>
        </nav>

        {/* SECTION 1: HERO */}
        <section style={sectionStyle}>
          <div style={{ backdropFilter: 'blur(5px)', padding: '40px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px' }}>
            <h1 style={{ fontSize: '4rem', fontWeight: '900', letterSpacing: '-2px', marginBottom: '10px', color: '#00ff88' }}>
              IT'S ME, KRISHNA
            </h1>
            <p style={{ letterSpacing: '5px', opacity: 0.8 }}>CLASS 11 PCM | MAHARASHTRA</p>
          </div>
        </section>

        {/* SECTION 2: STRATEGIST */}
        <section style={sectionStyle}>
          <div style={{ maxWidth: '600px', textAlign: 'left', background: 'rgba(0,0,0,0.5)', padding: '40px', borderRadius: '20px' }}>
            <h2 style={{ fontSize: '2.5rem', color: '#00ff88', marginBottom: '20px' }}>THE STRATEGIST</h2>
            <p style={{ fontSize: '1.2rem', lineHeight: '1.6' }}>
              Decoding market logic with <strong>Pine Script</strong>. I build the indicators that others trade with.
            </p>
          </div>
        </section>

        {/* SECTION 3: ALCHEMIST */}
        <section style={sectionStyle}>
          <div style={{ maxWidth: '600px', textAlign: 'right', background: 'rgba(0,0,0,0.5)', padding: '40px', borderRadius: '20px', marginLeft: 'auto' }}>
            <h2 style={{ fontSize: '2.5rem', color: '#00d2ff', marginBottom: '20px' }}>THE ALCHEMIST</h2>
            <p style={{ fontSize: '1.2rem', lineHeight: '1.6' }}>
              Founder of <strong>RECRENZO</strong>. Fusing AI video generation with Shopify e-commerce.
            </p>
          </div>
        </section>

        {/* SECTION 4: CONTACT */}
        <section style={sectionStyle}>
          <button style={{ padding: '20px 60px', fontSize: '1rem', letterSpacing: '3px', background: '#00ff88', color: 'black', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
            INITIATE CONTACT
          </button>
        </section>

      </div>
    </div>
  );
}