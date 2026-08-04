'use client';

import React from 'react';

// Premium Futuristic Vehicle for RahatVerse
// Lightweight and optimized for mobile

interface VehicleProps {
  position: [number, number, number];
  rotation?: [number, number, number];
}

export function Vehicle({ position, rotation = [0, 0, 0] }: VehicleProps) {
  return (
    <group position={position} rotation={rotation}>
      {/* Main Body - Sleek Futuristic Design */}
      <mesh position={[0, 3, 0]} castShadow>
        <boxGeometry args={[6, 2.8, 10]} />
        <meshLambertMaterial color="#0f172a" />
      </mesh>

      {/* Glass Cockpit */}
      <mesh position={[0, 4.5, 1]} castShadow>
        <boxGeometry args={[5, 2.2, 5]} />
        <meshLambertMaterial color="#bae6fd" transparent opacity={0.7} />
      </mesh>

      {/* Accent Line */}
      <mesh position={[0, 4.8, 0]} castShadow>
        <boxGeometry args={[5.5, 0.3, 9]} />
        <meshLambertMaterial color="#22d3ee" />
      </mesh>

      {/* Wheels */}
      <mesh position={[-2.8, 1.2, -3]} castShadow>
        <cylinderGeometry args={[1.1, 1.1, 0.8, 24]} />
        <meshLambertMaterial color="#1e2937" />
      </mesh>
      <mesh position={[2.8, 1.2, -3]} castShadow>
        <cylinderGeometry args={[1.1, 1.1, 0.8, 24]} />
        <meshLambertMaterial color="#1e2937" />
      </mesh>
      <mesh position={[-2.8, 1.2, 3]} castShadow>
        <cylinderGeometry args={[1.1, 1.1, 0.8, 24]} />
        <meshLambertMaterial color="#1e2937" />
      </mesh>
      <mesh position={[2.8, 1.2, 3]} castShadow>
        <cylinderGeometry args={[1.1, 1.1, 0.8, 24]} />
        <meshLambertMaterial color="#1e2937" />
      </mesh>

      {/* Rear Fin */}
      <mesh position={[0, 5.5, -4]} castShadow>
        <boxGeometry args={[0.6, 3, 2]} />
        <meshLambertMaterial color="#22d3ee" />
      </mesh>
    </group>
  );
}
