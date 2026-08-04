'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';

// RahatVerse City Layout - Phase 07
// Clean, modular, futuristic city structure with districts

interface DistrictProps {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
}

function District({ position, size, color }: DistrictProps) {
  return (
    <group position={position}>
      {/* Building / District Base */}
      <mesh position={[0, size[1] / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshLambertMaterial color={color} />
      </mesh>
      
      {/* Simple Roof Accent */}
      <mesh position={[0, size[1] + 1, 0]} castShadow>
        <boxGeometry args={[size[0] * 0.9, 2, size[2] * 0.9]} />
        <meshLambertMaterial color="#0f172a" />
      </mesh>
    </group>
  );
}

function Road({ start, end, width = 4 }: { start: [number, number, number]; end: [number, number, number]; width?: number }) {
  const length = Math.hypot(end[0] - start[0], end[2] - start[2]);
  const angle = Math.atan2(end[2] - start[2], end[0] - start[0]);

  return (
    <mesh 
      position={[
        (start[0] + end[0]) / 2, 
        0.1, 
        (start[2] + end[2]) / 2
      ]} 
      rotation={[0, -angle, 0]}
    >
      <boxGeometry args={[length, 0.3, width]} />
      <meshLambertMaterial color="#334155" />
    </mesh>
  );
}

export function CityScene() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 60, 90], fov: 45 }}
        style={{ background: '#0a0c12' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[80, 120, 60]}
          intensity={1.4}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />

        {/* Ground */}
        <mesh rotation={[-Math.PI * 0.5, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
          <planeGeometry args={[300, 300]} />
          <meshLambertMaterial color="#0f172a" />
        </mesh>

        {/* Main Roads (Cross Layout) */}
        <Road start={[-120, 0, 0]} end={[120, 0, 0]} width={5} />
        <Road start={[0, 0, -120]} end={[0, 0, 120]} width={5} />

        {/* Secondary Roads */}
        <Road start={[-60, 0, -80]} end={[60, 0, -80]} width={3.5} />
        <Road start={[-60, 0, 80]} end={[60, 0, 80]} width={3.5} />

        {/* DISTRICTS - Organized City Layout */}

        {/* Central Hub - Website Store */}
        <District 
          position={[0, 0, 0]} 
          size={[22, 28, 22]} 
          color="#1e40af" 
        />

        {/* North - About Me */}
        <District 
          position={[0, 0, -55]} 
          size={[18, 24, 16]} 
          color="#334155" 
        />

        {/* Northeast - Achievements */}
        <District 
          position={[48, 0, -48]} 
          size={[16, 20, 16]} 
          color="#854d0e" 
        />

        {/* East - Portfolio */}
        <District 
          position={[55, 0, 0]} 
          size={[18, 26, 18]} 
          color="#166534" 
        />

        {/* Southeast - Blood Donation */}
        <District 
          position={[48, 0, 48]} 
          size={[16, 22, 16]} 
          color="#9f1239" 
        />

        {/* South - Gallery */}
        <District 
          position={[0, 0, 55]} 
          size={[18, 24, 18]} 
          color="#581c87" 
        />

        {/* Southwest - Education */}
        <District 
          position={[-48, 0, 48]} 
          size={[16, 20, 16]} 
          color="#1e3a8a" 
        />

        {/* West - Skills */}
        <District 
          position={[-55, 0, 0]} 
          size={[18, 26, 18]} 
          color="#854d0e" 
        />

        {/* Northwest - Contact */}
        <District 
          position={[-48, 0, -48]} 
          size={[16, 22, 16]} 
          color="#166534" 
        />

        {/* AI Assistant (Floating / Special) */}
        <group position={[0, 35, -35]}>
          <mesh position={[0, 8, 0]} castShadow>
            <octahedronGeometry args={[6]} />
            <meshLambertMaterial color="#22d3ee" emissive="#164e63" emissiveIntensity={0.3} />
          </mesh>
        </group>

        {/* Stars */}
        <Stars
          radius={400}
          depth={80}
          count={1200}
          factor={3}
          saturation={0}
          fade
          speed={0.3}
        />

        {/* Camera Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={25}
          maxDistance={180}
          target={[0, 8, 0]}
        />
      </Canvas>
    </div>
  );
}
