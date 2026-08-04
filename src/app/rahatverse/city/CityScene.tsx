'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';

// RahatVerse City Scene Foundation
// This is the core 3D scene container

export function CityScene() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 15, 40], fov: 50 }}
        style={{ background: '#0a0c12' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[50, 80, 30]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />

        {/* Basic Environment Foundation */}
        <mesh rotation={[-Math.PI * 0.5, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
          <planeGeometry args={[200, 200]} />
          <meshLambertMaterial color="#111827" />
        </mesh>

        {/* Placeholder Buildings */}
        <group>
          {/* Central Tower */}
          <mesh position={[0, 12, 0]} castShadow>
            <boxGeometry args={[8, 24, 8]} />
            <meshLambertMaterial color="#1e2937" />
          </mesh>

          {/* Side Buildings */}
          <mesh position={[-25, 6, -15]} castShadow>
            <boxGeometry args={[6, 12, 6]} />
            <meshLambertMaterial color="#334155" />
          </mesh>
          <mesh position={[25, 8, -20]} castShadow>
            <boxGeometry args={[7, 16, 7]} />
            <meshLambertMaterial color="#475569" />
          </mesh>
          <mesh position={[-20, 5, 25]} castShadow>
            <boxGeometry args={[5, 10, 5]} />
            <meshLambertMaterial color="#1e2937" />
          </mesh>
        </group>

        {/* Stars */}
        <Stars
          radius={300}
          depth={60}
          count={800}
          factor={4}
          saturation={0}
          fade
          speed={0.5}
        />

        {/* Camera Controls (for foundation) */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={15}
          maxDistance={120}
        />
      </Canvas>
    </div>
  );
}
