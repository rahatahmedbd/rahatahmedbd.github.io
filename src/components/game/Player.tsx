"use client";

import React, { useRef } from "react";
import Ecctrl from "ecctrl";
import { useFrame } from "@react-three/fiber";
import { useGameStore } from "./store";

export default function Player() {
  const setPlayerPosition = useGameStore(state => state.setPlayerPosition);
  const bodyRef = useRef<any>(null);

  // Send position to store for the minimap
  useFrame(() => {
    if (bodyRef.current) {
      const pos = bodyRef.current.translation();
      // Only update roughly every few frames to save performance, or just update directly
      setPlayerPosition([pos.x, pos.y, pos.z]);
    }
  });

  return (
    <Ecctrl 
      ref={bodyRef}
      camInitDis={-6} 
      camMaxDis={-10} 
      camMinDis={-2} 
      maxVelLimit={6}
      sprintMult={1.5}
      jumpVel={5}
      position={[0, 5, 0]}
      animated={false}
    >
      <group position={[0, -0.9, 0]}>
         {/* Sleek futuristic capsule robot body */}
         <mesh castShadow receiveShadow position={[0, 0.9, 0]}>
           <capsuleGeometry args={[0.3, 1.2, 4, 16]} />
           <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.8} />
         </mesh>
         {/* Head / Visor */}
         <mesh castShadow position={[0, 1.6, 0]}>
           <boxGeometry args={[0.4, 0.4, 0.4]} />
           <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.5} />
         </mesh>
         <mesh position={[0, 1.6, 0.21]}>
           <boxGeometry args={[0.3, 0.1, 0.05]} />
           <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={2} toneMapped={false} />
         </mesh>
         {/* Thruster / Hover Base */}
         <mesh position={[0, 0.2, 0]}>
           <cylinderGeometry args={[0.2, 0.1, 0.2, 16]} />
           <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={1.5} toneMapped={false} />
         </mesh>
      </group>
    </Ecctrl>
  );
}
