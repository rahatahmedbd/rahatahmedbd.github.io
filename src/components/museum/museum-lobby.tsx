"use client";

import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text, Float, Billboard } from "@react-three/drei";

export function MuseumLobby({ projects, testimonials, onSelect }: { projects: any[], testimonials: any[], onSelect: (id: string) => void }) {
  const mapRef = useRef<THREE.Group>(null);

  // Distribute projects around a holographic globe
  const projectNodes = useMemo(() => {
    return projects.map((p, i) => {
      const phi = Math.acos(-1 + (2 * i) / projects.length);
      const theta = Math.sqrt(projects.length * Math.PI) * phi;
      const radius = 6;
      
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      return {
        ...p,
        position: [x, y, z] as [number, number, number]
      };
    });
  }, [projects]);

  useFrame((state, delta) => {
    if (mapRef.current) {
      mapRef.current.rotation.y += delta * 0.05;
      mapRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.5;
    }
  });

  return (
    <group>
      {/* Lobby Environment / Architecture */}
      <mesh position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[8, 30, 64]} />
        <meshStandardMaterial color="#0b1526" roughness={0.1} metalness={0.8} />
      </mesh>
      
      {/* Grid Floor */}
      <gridHelper args={[60, 60, "#22d3ee", "#ffffff"]} position={[0, -4.9, 0]} />

      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <group ref={mapRef}>
          {/* Holographic Globe core */}
          <mesh>
            <sphereGeometry args={[5.5, 32, 32]} />
            <meshStandardMaterial 
              color="#0b1526" 
              emissive="#22d3ee" 
              emissiveIntensity={0.2} 
              wireframe 
              transparent 
              opacity={0.1} 
            />
          </mesh>
          
          {/* Project Nodes */}
          {projectNodes.map((node) => (
            <ProjectNode 
              key={node.id} 
              node={node} 
              onClick={() => onSelect(node.id)} 
            />
          ))}
        </group>
      </Float>

      {/* Technology Wall */}
      <group position={[-15, 2, -10]} rotation={[0, Math.PI / 4, 0]}>
        <mesh position={[0, 0, -0.1]}>
          <planeGeometry args={[10, 8]} />
          <meshStandardMaterial color="#0b1526" transparent opacity={0.7} />
        </mesh>
        <Text position={[0, 3, 0]} fontSize={0.8} color="#22d3ee">TECHNOLOGY WALL</Text>
        <Text position={[-3, 1, 0]} fontSize={0.4} color="#ffffff">Next.js</Text>
        <Text position={[0, 1, 0]} fontSize={0.4} color="#ffffff">React</Text>
        <Text position={[3, 1, 0]} fontSize={0.4} color="#ffffff">Supabase</Text>
        <Text position={[-2, -1, 0]} fontSize={0.4} color="#ffffff">Tailwind CSS</Text>
        <Text position={[2, -1, 0]} fontSize={0.4} color="#ffffff">Three.js</Text>
      </group>

      {/* Achievement Hall Stats */}
      <group position={[15, 2, -10]} rotation={[0, -Math.PI / 4, 0]}>
        <mesh position={[0, 0, -0.1]}>
          <planeGeometry args={[10, 8]} />
          <meshStandardMaterial color="#0b1526" transparent opacity={0.7} />
        </mesh>
        <Text position={[0, 3, 0]} fontSize={0.8} color="#f43f5e">ACHIEVEMENT HALL</Text>
        <Text position={[0, 1, 0]} fontSize={0.5} color="#ffffff">{projects.length} Total Projects</Text>
        <Text position={[0, -0.5, 0]} fontSize={0.5} color="#ffffff">10+ Industries Served</Text>
        <Text position={[0, -2, 0]} fontSize={0.5} color="#ffffff">100% Client Satisfaction</Text>
      </group>

      {/* Secret Prototype Lab Marker */}
      <group position={[0, -8, -15]}>
        <mesh 
          onClick={() => { alert("SECRET PROTOTYPE LAB FOUND!\nThis area is restricted for Chapter 9."); }}
          onPointerEnter={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
          onPointerLeave={(e) => { e.stopPropagation(); document.body.style.cursor = 'default'; }}
        >
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color="#0b1526" emissive="#a78bfa" emissiveIntensity={1} />
        </mesh>
        <Text position={[0, -0.8, 0]} fontSize={0.2} color="#a78bfa">SECRET LAB (DO NOT ENTER)</Text>
      </group>

      {/* Testimonials Gallery */}
      <group position={[0, 8, -25]}>
        <Text position={[0, 4, 0]} fontSize={1} color="#f43f5e">CLIENT TESTIMONIALS</Text>
        {testimonials.slice(0, 4).map((test, i) => (
          <group key={test.id} position={[-9 + i * 6, 0, Math.abs(i - 1.5) * -2]}>
            <mesh position={[0, 0, -0.1]}>
              <planeGeometry args={[5, 4]} />
              <meshStandardMaterial color="#0b1526" transparent opacity={0.8} />
            </mesh>
            <Text position={[0, 1, 0]} fontSize={0.3} color="#22d3ee">{test.author_name}</Text>
            <Text position={[0, 0.5, 0]} fontSize={0.2} color="#ffffff">{test.author_title || ""}</Text>
            <Text position={[0, -0.5, 0]} fontSize={0.2} color="#ffffff" maxWidth={4} textAlign="center">
              &ldquo;{test.content.length > 100 ? test.content.substring(0, 100) + '\u2026' : test.content}&rdquo;
            </Text>
            <Text position={[0, -1.5, 0]} fontSize={0.3} color="#f59e0b">{"★".repeat(test.rating)}</Text>
          </group>
        ))}
      </group>
    </group>
  );
}

function ProjectNode({ node, onClick }: { node: any, onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const color = node.featured ? "#f43f5e" : "#22d3ee";
  const scale = hovered ? 1.5 : 1;

  return (
    <group position={node.position}>
      <mesh 
        onPointerEnter={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerLeave={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'default'; }}
        onClick={(e) => { e.stopPropagation(); onClick(); document.body.style.cursor = 'default'; }}
        scale={scale}
      >
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 2 : 0.8} />
      </mesh>
      
      {hovered && (
        <Billboard>
          <Text 
            position={[0, 0.8, 0]} 
            fontSize={0.4} 
            color="#ffffff"
            outlineWidth={0.05}
            outlineColor="#000000"
            anchorX="center"
            anchorY="middle"
          >
            {node.title}
          </Text>
        </Billboard>
      )}
    </group>
  );
}
