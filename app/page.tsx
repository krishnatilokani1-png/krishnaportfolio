"use client";

import React, { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Stars, PerspectiveCamera, Environment, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// --- 1. NEW INTERACTIVE "LIQUID CORE" OBJECT ---
function LiquidCore({ isDark }: { isDark: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Smooth rotation
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
      
      // Scale up slightly when hovered
      const targetScale = hovered ? 2.2 : 1.8;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh 
        ref={meshRef} 
        onPointerOver={() => setHover(true)} 
        onPointerOut={() => setHover(false)}
      >
        <sphereGeometry args={[1, 128, 128]} />
        {/* This material creates the liquid metal effect */}
        <MeshDistortMaterial 
          color={isDark ? "#00ff88" : "#333"} 
          envMapIntensity={1} 
          clearcoat={1} 
          clearcoatRoughness={0.1} 
          metalness={0.9} 
          roughness={0.1}
          distort={0.5} 
          speed={2} 
        />
      </mesh>
    </Float>
  );
}

// --- 2. INTERACTIVE PARTICLE FIELD ---
function InteractiveParticles() {
  const ref = useRef<THREE.Points>(null);
  const { mouse } = useThree();

  useFrame(() => {
    if (ref.current) {
      // Rotate entire starfield gently based on mouse position
      ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, mouse.y * 0.2, 0.05);
      ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, mouse.x * 0.2, 0.05);
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Stars radius={50} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    </group>
  );
}

function BackgroundScene({ isDark }: { isDark: boolean }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={2} color={isDark ? "#00ff88" : "#ffffff"} />
      <Environment preset={isDark ? "city" : "studio"} />
      <LiquidCore isDark={isDark} />
      <InteractiveParticles />
    </>
  );
}

// --- 3. MAIN COMPONENT ---

export default function Home() {
  const [isDark, setIsDark] = useState(true);

  // --- INLINE STYLES (No CSS File Dependency) ---
  const containerStyle: React.CSSProperties = {
    fontFamily: "'Inter', sans-serif",
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: isDark ? '#050505' : '#f0f0f0',
    color: isDark ? '#ffffff' : '#111111',
    overflow: 'hidden',
    transition: 'background-color 0.5s ease',
  };

  const scrollContainerStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflowY: 'scroll',
    scrollBehavior: 'smooth',
    zIndex: 10,
  };

  const navStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    width: '100%',
    padding: '30px 50px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 50,
    mixBlendMode: 'difference',
    color: 'white',
  };

  const sectionStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '20px',
    position: 'relative',
  };

  const cardStyle: React.CSSProperties = {
    background: isDark ? 'rgba(20, 20, 20, 0.6)' : 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(20px)',
    border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)',
    padding: '50px',
    borderRadius: '12px',
    maxWidth: '700px',
    boxShadow: isDark ? '0 20px 50px rgba(0,0,0,0.5)' : '0 20px 50px rgba(0,0,0,0.1)',
  };

  return (
    <div style={containerStyle}>
      {/* ERROR FIX: Standard HTML Link instead of style jsx */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700;900&display=swap" rel="stylesheet" />

      {/* 3D BACKGROUND LAYER */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <Canvas gl={{ antialias: true }} dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />
          <Suspense fallback={null}>
            <BackgroundScene isDark={isDark} />
          </Suspense>
        </Canvas>
      </div>

      {/* SCROLLABLE CONTENT LAYER */}
      <div style={scrollContainerStyle}>
        
        {/* NAV */}
        <nav style={navStyle}>
          <div style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '-1px' }}>KRISHNA.IO</div>
          <button 
            onClick={() => setIsDark(!isDark)}
            style={{ 
              background: 'transparent', 
              border: '1px solid white', 
              padding: '8px 20px', 
              borderRadius: '50px', 
              cursor: 'pointer',
              fontSize: '0.7rem',
              fontWeight: 700,
              color: 'white'
            }}
          >
            {isDark ? 'ZEN MODE' : 'CYBER MODE'}
          </button>
        </nav>

        {/* HERO SECTION */}
        <section style={{ ...sectionStyle, alignItems: 'center', textAlign: 'center' }}>
          <div style={{ zIndex: 2 }}>
            <h1 style={{ 
              fontSize: 'clamp(3rem, 8vw, 7rem)', 
              fontWeight: 900, 
              letterSpacing: '-0.05em', 
              lineHeight: 0.9,
              marginBottom: '20px',
              textTransform: 'uppercase'
            }}>
              It's Me,<br />
              <span style={{ 
                color: isDark ? '#00ff88' : 'transparent', 
                WebkitTextStroke: isDark ? '0px' : '2px #333' 
              }}>
                Krishna.
              </span>
            </h1>
            <p style={{ 
              fontSize: '1rem', 
              letterSpacing: '0.3em', 
              textTransform: 'uppercase', 
              opacity: 0.7,
              marginTop: '20px' 
            }}>
              Strategist & Alchemist
            </p>
          </div>
        </section>

        {/* STRATEGIST SECTION */}
        <section style={{ ...sectionStyle, alignItems: 'flex-start', paddingLeft: '10vw' }}>
          <div style={cardStyle}>
            <span style={{ color: '#00ff88', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>01 / Logic</span>
            <h2 style={{ fontSize: '3rem', fontWeight: 800, margin: '15px 0', letterSpacing: '-2px' }}>THE STRATEGIST</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.6, opacity: 0.8, marginBottom: '30px' }}>
              I don't just follow the market; I decode it. Specializing in <strong>Pine Script</strong> and advanced financial logic, 
              I engineer custom indicators and trading algorithms that provide a statistical edge.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['Pine Script', 'TradingView', 'Algorithm Design'].map(tag => (
                <span key={tag} style={{ 
                  fontSize: '0.7rem', 
                  border: '1px solid rgba(125,125,125,0.3)', 
                  padding: '5px 15px', 
                  borderRadius: '100px',
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ALCHEMIST SECTION */}
        <section style={{ ...sectionStyle, alignItems: 'flex-end', paddingRight: '10vw' }}>
          <div style={{ ...cardStyle, textAlign: 'right' }}>
            <span style={{ color: '#00d2ff', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>02 / Creation</span>
            <h2 style={{ fontSize: '3rem', fontWeight: 800, margin: '15px 0', letterSpacing: '-2px' }}>THE ALCHEMIST</h2>
            
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '5px' }}>RECRENZO</h3>
              <p style={{ opacity: 0.7 }}>My Shopify e-commerce brand, built on high-conversion design.</p>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '5px' }}>AI AUTOMATION</h3>
              <p style={{ opacity: 0.7 }}>Scaling faceless Instagram brands using AI-generated media pipelines.</p>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              {['Shopify', 'Faceless AI', 'Growth'].map(tag => (
                <span key={tag} style={{ 
                  fontSize: '0.7rem', 
                  border: '1px solid rgba(125,125,125,0.3)', 
                  padding: '5px 15px', 
                  borderRadius: '100px',
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section style={{ ...sectionStyle, alignItems: 'center', textAlign: 'center' }}>
          <h2 style={{ fontSize: '0.9rem', letterSpacing: '0.5em', textTransform: 'uppercase', marginBottom: '40px', opacity: 0.6 }}>System Ready</h2>
          <button 
            style={{ 
              fontSize: '1.5rem', 
              fontWeight: 900, 
              background: 'transparent', 
              color: isDark ? '#00ff88' : '#111', 
              border: isDark ? '2px solid #00ff88' : '2px solid #111',
              padding: '20px 60px', 
              textTransform: 'uppercase',
              letterSpacing: '2px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = isDark ? '#00ff88' : '#111';
              e.currentTarget.style.color = isDark ? '#000' : '#fff';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = isDark ? '#00ff88' : '#111';
            }}
          >
            Contact Terminal
          </button>
          <p style={{ marginTop: '50px', fontSize: '0.8rem', opacity: 0.4 }}>Nagpur, India</p>
        </section>

      </div>
    </div>
  );
}