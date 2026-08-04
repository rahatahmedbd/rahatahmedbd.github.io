'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface LivingWorldProps {
  timeOfDay: 'morning' | 'day' | 'evening' | 'night';
  weather: 'sunny' | 'cloudy' | 'rain';
}

export function LivingWorld({ timeOfDay, weather }: LivingWorldProps) {
  const treesRef = useRef<THREE.Group>(null!);
  const cloudsRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    // Gentle tree swaying
    if (treesRef.current) {
      treesRef.current.children.forEach((tree, i) => {
        tree.rotation.z = Math.sin(state.clock.elapsedTime * 0.7 + i) * 0.025;
      });
    }

    // Cloud movement
    if (cloudsRef.current) {
      cloudsRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.04) * 12;
    }
  });

  const lightIntensity = {
    morning: 0.9,
    day: 1.3,
    evening: 0.7,
    night: 0.4,
  }[timeOfDay];

  return (
    <group>
      <ambientLight intensity={lightIntensity} />

      {/* Moving Clouds */}
      <group ref={cloudsRef}>
        <mesh position={[-50, 90, -60]}>
          <sphereGeometry args={[14]} />
          <meshLambertMaterial color="#475569" transparent opacity={0.55} />
        </mesh>
        <mesh position={[55, 85, -70]}>
          <sphereGeometry args={[10]} />
          <meshLambertMaterial color="#475569" transparent opacity={0.5} />
        </mesh>
      </group>

      {/* Animated Trees */}
      <group ref={treesRef}>
        {[-70, -20, 30, 75].map((x, index) => (
          <group key={index} position={[x, 0, -25]}>
            <mesh position={[0, 3, 0]}>
              <cylinderGeometry args={[0.6, 0.8, 6]} />
              <meshLambertMaterial color="#334155" />
            </mesh>
            <mesh position={[0, 8.5, 0]}>
              <sphereGeometry args={[3.8]} />
              <meshLambertMaterial color="#166534" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Animated Billboard */}
      <group position={[0, 48, -85]}>
        <mesh>
          <boxGeometry args={[20, 7, 1.2]} />
          <meshLambertMaterial color="#1e40af" emissive="#1e3a8a" emissiveIntensity={0.35} />
        </mesh>
        <mesh position={[0, 0, 0.7]}>
          <planeGeometry args={[16, 4.5]} />
          <meshLambertMaterial color="#bae6fd" transparent opacity={0.85} />
        </mesh>
      </group>

      {/* Subtle Fog */}
      {weather === 'cloudy' && (
        <fog attach="fog" args={['#0f172a', 70, 240]} />
      )}
    </group>
  );
}
