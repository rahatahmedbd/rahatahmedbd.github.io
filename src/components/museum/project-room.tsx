"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html, Text, Float, Image as DreiImage, useTexture } from "@react-three/drei";

export function ProjectRoom({ project }: { project: any }) {
  const roomRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (roomRef.current) {
      // Gentle floating of the entire room to feel immersive
      roomRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  const isFeatured = project.featured;

  return (
    <group ref={roomRef}>
      {/* Dynamic Lighting for Featured Projects */}
      {isFeatured && (
        <>
          <pointLight position={[0, 5, -5]} intensity={2} color="#f43f5e" />
          <spotLight position={[0, 8, 0]} angle={0.3} penumbra={1} intensity={3} color="#fbbf24" castShadow />
        </>
      )}

      {/* Room Architecture */}
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color={isFeatured ? "#0f0714" : "#050a14"} roughness={isFeatured ? 0.6 : 0.8} metalness={isFeatured ? 0.5 : 0.2} />
      </mesh>

      <gridHelper args={[40, 40, isFeatured ? "#f43f5e" : "#22d3ee", "#ffffff"]} position={[0, -1.99, 0]} />

      {/* Main Display (Desktop Monitor) */}
      <DeviceShowcase position={[0, 1, -5]} project={project} type="desktop" scale={isFeatured ? 1.2 : 1} />
      
      {/* Tablet Display */}
      <DeviceShowcase position={[-5, 0, -3]} rotation={[0, Math.PI / 6, 0]} project={project} type="tablet" />
      
      {/* Mobile Display */}
      <DeviceShowcase position={[4, -0.5, -2]} rotation={[0, -Math.PI / 6, 0]} project={project} type="mobile" />

      {/* Stats/Info Holograms */}
      <InfoPanel position={[-6, 3, -6]} title="Tech Stack" content={project.tags?.join(", ") || "React, Next.js"} />
      <InfoPanel position={[6, 3, -6]} title="Status" content={project.status?.toUpperCase() || "COMPLETED"} />

      {/* Build Process Display */}
      <BuildProcess position={[0, -1.8, -8]} />

      {/* Interactive Feature Stations */}
      <FeatureStations position={[-8, 0, 0]} rotation={[0, Math.PI / 2, 0]} project={project} />

    </group>
  );
}

function DeviceShowcase({ position, rotation = [0,0,0], project, type, scale = 1 }: { position: [number,number,number], rotation?: [number,number,number], project: any, type: "desktop"|"tablet"|"mobile", scale?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Device dimensions
  const dims = {
    desktop: { width: 6, height: 3.5, depth: 0.2, screenW: 5.8, screenH: 3.3 },
    tablet: { width: 2.5, height: 3.5, depth: 0.15, screenW: 2.3, screenH: 3.3 },
    mobile: { width: 1.2, height: 2.4, depth: 0.1, screenW: 1.1, screenH: 2.3 }
  }[type];

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.position.y += Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.002;
    }
  });

  return (
    <group position={position} rotation={rotation} ref={groupRef} scale={scale}>
      {/* Device Bezel */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[dims.width, dims.height, dims.depth]} />
        <meshStandardMaterial color="#1e293b" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Screen Area */}
      <mesh position={[0, 0, dims.depth / 2 + 0.01]}>
        <planeGeometry args={[dims.screenW, dims.screenH]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Screen Content - Use iframe via Html or Image */}
      <Html 
        transform 
        position={[0, 0, dims.depth / 2 + 0.02]} 
        distanceFactor={10}
        zIndexRange={[100, 0]}
        occlude="blending"
      >
        <div 
          style={{ 
            width: `${dims.screenW * 100}px`, 
            height: `${dims.screenH * 100}px`, 
            backgroundColor: '#0b1526',
            borderRadius: type === 'desktop' ? '0' : '8px',
            overflow: 'hidden',
            border: '1px solid #22d3ee',
            backgroundImage: `url(${project.cover_image_url || '/placeholder.jpg'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'top center'
          }} 
        />
      </Html>
      
      {/* Floating label */}
      <Text position={[0, -dims.height/2 - 0.5, 0]} fontSize={0.2} color="#22d3ee">
        {type.toUpperCase()}
      </Text>
    </group>
  );
}

function InfoPanel({ position, title, content }: { position: [number,number,number], title: string, content: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[4, 2]} />
        <meshStandardMaterial color="#0b1526" transparent opacity={0.8} emissive="#22d3ee" emissiveIntensity={0.2} />
      </mesh>
      <Text position={[0, 0.5, 0]} fontSize={0.3} color="#f43f5e" anchorX="center">
        {title}
      </Text>
      <Text position={[0, 0, 0]} fontSize={0.2} color="#ffffff" anchorX="center" maxWidth={3.5} textAlign="center">
        {content}
      </Text>
    </group>
  );
}

function BuildProcess({ position }: { position: [number, number, number] }) {
  const steps = ["Research", "Planning", "Wireframing", "UI Design", "Development", "Testing", "Deployment"];
  return (
    <group position={position}>
      <Text position={[0, 1.5, 0]} fontSize={0.4} color="#22d3ee">BUILD PIPELINE</Text>
      {steps.map((step, i) => (
        <group key={step} position={[-6 + i * 2, 0, 0]}>
          <mesh>
            <boxGeometry args={[1.5, 0.5, 0.5]} />
            <meshStandardMaterial color="#0b1526" emissive="#f43f5e" emissiveIntensity={0.5} />
          </mesh>
          <Text position={[0, 0, 0.26]} fontSize={0.15} color="#ffffff">{step}</Text>
          {i < steps.length - 1 && (
            <mesh position={[1, 0, 0]}>
              <planeGeometry args={[0.5, 0.05]} />
              <meshBasicMaterial color="#22d3ee" />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}

function FeatureStations({ position, rotation, project }: { position: [number, number, number], rotation: [number, number, number], project: any }) {
  const stations = ["Authentication", "Dashboard", "CMS", "Analytics"];
  return (
    <group position={position} rotation={rotation}>
      <Text position={[0, 3, 0]} fontSize={0.4} color="#f43f5e">FEATURE STATIONS</Text>
      {stations.map((feat, i) => (
        <group key={feat} position={[-3 + i * 2, 0, 0]}>
          <mesh position={[0, 1, 0]}>
            <cylinderGeometry args={[0.5, 0.5, 2, 16]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} />
          </mesh>
          <mesh position={[0, 2.2, 0]}>
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshStandardMaterial color="#0b1526" emissive="#22d3ee" emissiveIntensity={1} wireframe />
          </mesh>
          <Text position={[0, 3, 0]} fontSize={0.2} color="#ffffff">{feat}</Text>
        </group>
      ))}
    </group>
  );
}

