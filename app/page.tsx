"use client";

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Stars, useScroll, ScrollControls, Scroll } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useRef, useState, createContext, useContext, Suspense, useMemo } from 'react';
import * as THREE from 'three';

const ThemeContext = createContext({ theme: 'dark', toggleTheme: () => {} });

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState('dark');
  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

const useTheme = () => useContext(ThemeContext);

function Obelisk() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { theme } = useTheme();
  
  useFrame(() => {
    if (meshRef.current && meshRef.current.material) {
      meshRef.current.rotation.y += 0.005;
      const targetColor = theme === 'dark' ? 0x00ff88 : 0x333333;
      (meshRef.current.material as THREE.MeshStandardMaterial).emissive.setHex(targetColor);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <boxGeometry args={[1, 4, 1]} />
      <meshStandardMaterial 
        color={theme === 'dark' ? '#000000' : '#ffffff'} 
        emissive={theme === 'dark' ? '#00ff88' : '#cccccc'} 
        emissiveIntensity={1.5}
      />
    </mesh>
  );
}

function Particles() {
  const pointsRef = useRef<THREE.Points>(null);
  const { mouse } = useThree();
  
  const posArray = useMemo(() => {
    const arr = new Float32Array(3000);
    for (let i = 0; i < 3000; i++) arr[i] = (Math.random() - 0.5) * 20;
    return arr;
  }, []);

  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.x = mouse.y * 0.05;
      pointsRef.current.rotation.y = mouse.x * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={1000} array={posArray} itemSize={3} args={[posArray, 3]} />
        
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#00ff88" transparent opacity={0.6} />
    </points>
  );
}

// THIS IS THE CAMERA CONTROLLER YOU WERE LOOKING FOR
function CameraController() {
  const scroll = useScroll();
  const { camera } = useThree();
  useFrame(() => {
    const t = scroll.offset;
    camera.position.set(0, -t * 30, 5);
    camera.lookAt(0, -t * 30, 0);
  });
  return null;
}

function Scene() {
  return (
    <>
      <ambientLight intensity={1} />
      <pointLight position={[10, 10, 10]} intensity={2} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
      <Particles />
      <Obelisk />
      <Text position={[0, 3, 1]} fontSize={1} color="#00ff88" anchorX="center" anchorY="middle">
        It's me, Krishna.
      </Text>
      <group position={[0, -10, 0]}>
         <Text fontSize={0.8} color="#00ff88">The Strategist</Text>
         <Text position={[0, -1, 0]} fontSize={0.3} color="white">Trading & Pine Script</Text>
      </group>
      <group position={[0, -20, 0]}>
         <Text fontSize={0.8} color="#00ff88">The Alchemist</Text>
         <Text position={[0, -1, 0]} fontSize={0.3} color="white">AI Videos & Recrenzo</Text>
      </group>
      <CameraController />
    </>
  );
}

export default function Home() {
  return (
    <ThemeProvider>
      <main className="w-full h-screen bg-black">
        <Suspense fallback={null}>
          <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
            <ScrollControls pages={4} damping={0.2}>
              <Scroll>
                <Scene />
              </Scroll>
            </ScrollControls>
          </Canvas>
        </Suspense>
        
        {/* 2D Overlay UI */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <p className="mb-4 text-xs text-green-400 tracking-widest">SCROLL TO EXPLORE</p>
            <button className="pointer-events-auto bg-black border border-green-500 text-green-400 px-8 py-3 rounded-md font-bold">
              CONTACT KRISHNA
            </button>
          </div>
        </div>
      </main>
    </ThemeProvider>
  );
}