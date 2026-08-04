'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface LivingWorldProps {
  timeOfDay: 'morning' | 'day' | 'evening' | 'night';
  weather: 'sunny' | 'cloudy' | 'rain';
}

export function LivingWorld({ timeOfDay, weather }: LivingWorldProps) {
  const cloudsRef = useRef<THREE.Group>(null!);
  const treesRef = useRef<THREE.Group>(null!);

  // Gentle tree movement
  useFrame((state) => {
    if (treesRef.current) {
      treesRef.current.children.forEach((tree, i) => {
        tree.rotation.z = Math.sin(state.clock.elapsedTime * 0.8 + i) * 0.03;
      });
    }

    // Cloud movement
    if (cloudsRef.current) {
      cloudsRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.05) * 8;
    }
  });

  const skyColor = {
    morning: '#1e3a8a',
    day: '#0a0c12',
    evening: '#431407',
    night: '#020617',
  }[timeOfDay];

  return (
    <group>
      {/* Dynamic Sky Color (simulated via ambient light) */}
      <ambientLight intensity={timeOfDay === 'night' ? 0.3 : timeOfDay === 'evening' ? 0.45 : 0.6} />

      {/* Moving Clouds */}
      <group ref={cloudsRef}>
        <mesh position={[-60, 80, -40]}>
          <sphereGeometry args={[12]} />
          <meshLambertMaterial color="#475569" transparent opacity={0.6} />
        </mesh>
        <mesh position={[40, 75, -55]}>
          <sphereGeometry args={[9]} />
          <meshLambertMaterial color="#475569" transparent opacity={0.5} />
        </mesh>
      </group>

      {/* Gentle Moving Trees */}
      <group ref={treesRef}>
        {[1, 2, 3, 4].map((i) => (
          <group key={i} position={[-80 + i * 50, 0, -30 + (i % 2) * 60]}>
            <mesh position={[0, 3, 0]}>
              <cylinderGeometry args={[0.6, 0.8, 6]} />
              <meshLambertMaterial color="#334155" />
            </mesh>
            <mesh position={[0, 8, 0]}>
              <sphereGeometry args={[3.5]} />
              <meshLambertMaterial color="#166534" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Digital Billboard (Animated) */}
      <group position={[0, 45, -80]}>
        <mesh>
          <boxGeometry args={[18, 8, 1]} />
          <meshLambertMaterial color="#1e40af" emissive="#1e3a8a" emissiveIntensity={0.3} />
        </mesh>
        {/* Simple text representation */}
        <mesh position={[0, 0, 0.6]}>
          <planeGeometry args={[14, 5]} />
          <meshLambertMaterial color="#bae6fd" transparent opacity={0.9} />
        </mesh>
      </group>

      {/* Subtle Fog Effect */}
      {weather === 'cloudy' && (
        <fog attach="fog" args={['#0f172a', 80, 220]} />
      )}
    </group>
  );
}
