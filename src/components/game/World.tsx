"use client";

import React, { useState } from "react";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useGameStore } from "./store";

function InteractiveObject({
  position,
  color,
  label,
  onInteract,
}: {
  position: [number, number, number];
  color: string;
  label: string;
  onInteract?: () => void;
}) {
  const setInteractionText = useGameStore((state) => state.setInteractionText);
  const [hovered, setHovered] = useState(false);

  return (
    <RigidBody type="fixed" position={position} colliders="cuboid">
      <mesh
        castShadow
        receiveShadow
        onPointerEnter={() => {
          setHovered(true);
          setInteractionText(`Click to Enter ${label}`);
        }}
        onPointerLeave={() => {
          setHovered(false);
          setInteractionText(null);
        }}
        onClick={() => {
          if (onInteract) onInteract();
        }}
      >
        <boxGeometry args={[3, 4, 3]} />
        <meshStandardMaterial
          color={color}
          emissive={hovered ? color : "#000000"}
          emissiveIntensity={hovered ? 0.6 : 0.2}
        />
      </mesh>
    </RigidBody>
  );
}

function Checkpoint({ position, name }: { position: [number, number, number]; name: string }) {
  const setCheckpoint = useGameStore((state) => state.setCheckpoint);

  return (
    <RigidBody type="fixed" position={position} sensor onIntersectionEnter={() => setCheckpoint(position)}>
      <CuboidCollider args={[4, 2, 4]} />
      <mesh position={[0, -1.9, 0]}>
        <cylinderGeometry args={[2, 2, 0.1, 32]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.5} transparent opacity={0.3} />
      </mesh>
    </RigidBody>
  );
}

export default function World() {
  const setShowHqModal = useGameStore((state) => state.setShowHqModal);

  return (
    <group>
      {/* Ground Floor */}
      <RigidBody type="fixed" colliders="cuboid" position={[0, -2, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[100, 1, 100]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      </RigidBody>

      {/* Main Roads / Grid */}
      <mesh position={[0, -1.49, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#334155" wireframe />
      </mesh>

      {/* Agency Headquarters — Unlocked Chapter 4 Landmark */}
      <InteractiveObject
        position={[5, 0, 5]}
        color="#f43f5e"
        label="Agency Headquarters (Chapter 4)"
        onInteract={() => setShowHqModal(true)}
      />

      {/* Other Buildings */}
      <InteractiveObject position={[-10, -0.5, -5]} color="#3b82f6" label="Portfolio Museum (Chapter 5)" />
      <InteractiveObject position={[12, -0.5, -15]} color="#8b5cf6" label="Website Factory (Chapter 6)" />
      <InteractiveObject position={[-8, -0.5, 12]} color="#eab308" label="Teleport Station (Inactive)" />

      {/* Checkpoints */}
      <Checkpoint position={[0, -0.5, 0]} name="Spawn District" />
      <Checkpoint position={[20, -0.5, -20]} name="Tech District" />

      {/* Decorative blocks */}
      <RigidBody type="fixed" colliders="cuboid" position={[15, 2, 10]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[4, 8, 4]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
      </RigidBody>
    </group>
  );
}
