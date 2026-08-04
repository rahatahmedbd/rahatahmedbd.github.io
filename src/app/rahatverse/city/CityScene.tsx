'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';

// RahatVerse Buildings & Environment - Phase 08
// Premium futuristic city with unique district buildings

interface BuildingProps {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  roofColor?: string;
  accentColor?: string;
  variant?: 'tower' | 'wide' | 'pyramid' | 'modern' | 'glass';
}

function Building({ position, size, color, roofColor = '#0f172a', accentColor, variant = 'modern' }: BuildingProps) {
  const [width, height, depth] = size;
  
  return (
    <group position={position}>
      {/* Main Building */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshLambertMaterial color={color} />
      </mesh>

      {/* Variant-specific details */}
      {variant === 'tower' && (
        <>
          {/* Tower Top */}
          <mesh position={[0, height + 4, 0]} castShadow>
            <boxGeometry args={[width * 0.6, 8, depth * 0.6]} />
            <meshLambertMaterial color={roofColor} />
          </mesh>
          {/* Antenna */}
          <mesh position={[0, height + 14, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.3, 12]} />
            <meshLambertMaterial color="#475569" />
          </mesh>
        </>
      )}

      {variant === 'wide' && (
        <mesh position={[0, height + 2, 0]} castShadow>
          <boxGeometry args={[width * 1.1, 4, depth * 1.1]} />
          <meshLambertMaterial color={roofColor} />
        </mesh>
      )}

      {variant === 'pyramid' && (
        <mesh position={[0, height + 6, 0]} castShadow>
          <coneGeometry args={[Math.max(width, depth) / 1.5, 12, 4]} />
          <meshLambertMaterial color={roofColor} />
        </mesh>
      )}

      {variant === 'glass' && (
        <>
          <mesh position={[0, height + 3, 0]} castShadow>
            <boxGeometry args={[width * 0.85, 6, depth * 0.85]} />
            <meshLambertMaterial color="#bae6fd" transparent opacity={0.6} />
          </mesh>
        </>
      )}

      {/* Accent Strip */}
      {accentColor && (
        <mesh position={[0, height * 0.6, depth / 2 + 0.1]} castShadow>
          <boxGeometry args={[width * 0.8, height * 0.15, 0.3]} />
          <meshLambertMaterial color={accentColor} />
        </mesh>
      )}
    </group>
  );
}

function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, 3, 0]} castShadow>
        <cylinderGeometry args={[0.6, 0.8, 6]} />
        <meshLambertMaterial color="#334155" />
      </mesh>
      {/* Foliage */}
      <mesh position={[0, 8, 0]} castShadow>
        <sphereGeometry args={[3.5]} />
        <meshLambertMaterial color="#166534" />
      </mesh>
      <mesh position={[0, 11, 0]} castShadow>
        <sphereGeometry args={[2.8]} />
        <meshLambertMaterial color="#15803d" />
      </mesh>
    </group>
  );
}

function StreetLight({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Pole */}
      <mesh position={[0, 8, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.25, 16]} />
        <meshLambertMaterial color="#475569" />
      </mesh>
      {/* Light */}
      <mesh position={[0, 16, 0]} castShadow>
        <sphereGeometry args={[0.8]} />
        <meshLambertMaterial color="#fef08c" emissive="#fef08c" emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
}

function Road({ start, end, width = 4 }: { start: [number, number, number]; end: [number, number, number]; width?: number }) {
  const length = Math.hypot(end[0] - start[0], end[2] - start[2]);
  const angle = Math.atan2(end[2] - start[2], end[0] - start[0]);

  return (
    <mesh 
      position={[(start[0] + end[0]) / 2, 0.15, (start[2] + end[2]) / 2]} 
      rotation={[0, -angle, 0]}
    >
      <boxGeometry args={[length, 0.4, width]} />
      <meshLambertMaterial color="#475569" />
    </mesh>
  );
}

export function CityScene() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 75, 110], fov: 42 }}
        style={{ background: '#0a0c12' }}
      >
        {/* Enhanced Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[90, 140, 70]}
          intensity={1.6}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-near={10}
          shadow-camera-far={300}
          shadow-camera-left={-150}
          shadow-camera-right={150}
          shadow-camera-top={150}
          shadow-camera-bottom={-150}
        />

        {/* Ground */}
        <mesh rotation={[-Math.PI * 0.5, 0, 0]} position={[0, -0.6, 0]} receiveShadow>
          <planeGeometry args={[320, 320]} />
          <meshLambertMaterial color="#0f172a" />
        </mesh>

        {/* Main Roads */}
        <Road start={[-130, 0, 0]} end={[130, 0, 0]} width={6} />
        <Road start={[0, 0, -130]} end={[0, 0, 130]} width={6} />

        {/* Secondary Roads */}
        <Road start={[-70, 0, -90]} end={[70, 0, -90]} width={4} />
        <Road start={[-70, 0, 90]} end={[70, 0, 90]} width={4} />

        {/* === DISTRICT BUILDINGS (Unique Designs) === */}

        {/* Central - Website Store (Modern Glass Tower) */}
        <Building 
          position={[0, 0, 0]} 
          size={[24, 32, 24]} 
          color="#1e40af" 
          roofColor="#1e3a8a"
          variant="glass"
          accentColor="#bae6fd"
        />

        {/* North - About Me (Elegant Tower) */}
        <Building 
          position={[0, 0, -60]} 
          size={[20, 28, 18]} 
          color="#334155" 
          roofColor="#1e2937"
          variant="tower"
        />

        {/* Northeast - Achievements (Pyramid Style) */}
        <Building 
          position={[52, 0, -52]} 
          size={[18, 24, 18]} 
          color="#854d0e" 
          roofColor="#713f12"
          variant="pyramid"
        />

        {/* East - Portfolio (Wide Modern) */}
        <Building 
          position={[60, 0, 0]} 
          size={[20, 30, 20]} 
          color="#166534" 
          roofColor="#14532d"
          variant="wide"
        />

        {/* Southeast - Blood Donation (Red Accent) */}
        <Building 
          position={[52, 0, 52]} 
          size={[18, 26, 18]} 
          color="#9f1239" 
          roofColor="#7f1d1d"
          variant="modern"
          accentColor="#fda4af"
        />

        {/* South - Gallery (Glass) */}
        <Building 
          position={[0, 0, 60]} 
          size={[20, 28, 20]} 
          color="#581c87" 
          roofColor="#3b0764"
          variant="glass"
        />

        {/* Southwest - Education (Classic Tower) */}
        <Building 
          position={[-52, 0, 52]} 
          size={[18, 24, 18]} 
          color="#1e3a8a" 
          roofColor="#1e40af"
          variant="tower"
        />

        {/* West - Skills (Wide) */}
        <Building 
          position={[-60, 0, 0]} 
          size={[20, 30, 20]} 
          color="#854d0e" 
          roofColor="#713f12"
          variant="wide"
        />

        {/* Northwest - Contact (Modern) */}
        <Building 
          position={[-52, 0, -52]} 
          size={[18, 26, 18]} 
          color="#166534" 
          roofColor="#14532d"
          variant="modern"
        />

        {/* === ENVIRONMENT === */}

        {/* Trees around the city */}
        <Tree position={[-35, 0, -35]} />
        <Tree position={[35, 0, -35]} />
        <Tree position={[-35, 0, 35]} />
        <Tree position={[35, 0, 35]} />
        <Tree position={[-80, 0, -20]} />
        <Tree position={[80, 0, -20]} />
        <Tree position={[-80, 0, 20]} />
        <Tree position={[80, 0, 20]} />

        {/* Street Lights */}
        <StreetLight position={[-25, 0, -25]} />
        <StreetLight position={[25, 0, -25]} />
        <StreetLight position={[-25, 0, 25]} />
        <StreetLight position={[25, 0, 25]} />

        {/* Stars */}
        <Stars
          radius={450}
          depth={90}
          count={1500}
          factor={3.5}
          saturation={0}
          fade
          speed={0.25}
        />

        {/* Camera Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={30}
          maxDistance={200}
          target={[0, 10, 0]}
        />
      </Canvas>
    </div>
  );
}
