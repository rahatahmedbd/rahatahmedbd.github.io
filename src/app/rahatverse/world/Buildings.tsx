"use client";

import React, { useEffect, useState } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";

import { rahatVerseTourStops, type RahatVerseStop } from "@/data/platform";

/**
 * Lightweight box-buildings placed at every RahatVerse tour stop.
 *
 * Each building:
 * - Shows a tooltip on hover (desktop) / tap (mobile) via a projected
 *   HTML element (the scene owns the tooltip DOM node, we only move it)
 * - Calls onSelect when clicked/tapped so the scene can animate the
 *   camera to focus the building
 *
 * Geometry is intentionally primitive (2 boxes per building) so the
 * whole district adds ~20 draw calls and stays cheap on mid-range
 * mobile GPUs.
 */

const BUILDING_COLORS = [
  "#1e3a8a",
  "#7c3aed",
  "#0e7490",
  "#be185d",
  "#166534",
  "#a16207",
  "#4c1d95",
  "#155e75",
  "#9f1239",
  "#1e40af",
] as const;

interface BuildingSpec {
  stop: RahatVerseStop;
  width: number;
  depth: number;
  height: number;
  color: string;
}

function buildingSpecs(): BuildingSpec[] {
  return rahatVerseTourStops.map((stop, index) => {
    const isStore = stop.id === "website-store";
    const width = isStore ? 24 : 12 + (index % 3) * 3;
    const depth = isStore ? 24 : 12 + ((index + 1) % 3) * 3;
    const height = isStore ? 34 : 20 + ((index * 7) % 18);
    return {
      stop,
      width,
      depth,
      height,
      color: BUILDING_COLORS[index % BUILDING_COLORS.length],
    };
  });
}

interface BuildingsProps {
  tooltipRef: React.RefObject<HTMLDivElement | null>;
  onHoverChange: (stop: RahatVerseStop | null) => void;
  onSelect: (stop: RahatVerseStop) => void;
}

export function Buildings({ tooltipRef, onHoverChange, onSelect }: BuildingsProps) {
  const [specs] = useState<BuildingSpec[]>(() => buildingSpecs());
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const hoveredSpec =
    hoveredId === null ? null : (specs.find((spec) => spec.stop.id === hoveredId) ?? null);

  // Pointer cursor while hovering a building; reset on unmount.
  useEffect(() => {
    document.body.style.cursor = hoveredId ? "pointer" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hoveredId]);

  // Move the tooltip DOM node to the building's screen position each
  // frame. Direct style writes keep this at zero React re-renders.
  useFrame((state) => {
    const element = tooltipRef.current;
    if (!element) return;

    const spec = hoveredSpec;
    if (!spec) {
      element.style.opacity = "0";
      return;
    }

    const position = new THREE.Vector3(
      spec.stop.position[0],
      spec.height + 3,
      spec.stop.position[2],
    ).project(state.camera);

    if (position.z > 1) {
      element.style.opacity = "0";
      return;
    }

    const x = (position.x * 0.5 + 0.5) * state.size.width;
    const y = (-position.y * 0.5 + 0.5) * state.size.height;
    element.style.opacity = "1";
    element.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -130%)`;
  });

  const handlePointerOver = (event: ThreeEvent<PointerEvent>, spec: BuildingSpec) => {
    event.stopPropagation();
    setHoveredId(spec.stop.id);
    onHoverChange(spec.stop);
  };

  const handlePointerOut = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setHoveredId(null);
    onHoverChange(null);
  };

  const handleClick = (event: ThreeEvent<MouseEvent>, spec: BuildingSpec) => {
    event.stopPropagation();
    onSelect(spec.stop);
  };

  return (
    <group>
      {specs.map((spec) => {
        const isHovered = hoveredId === spec.stop.id;
        return (
          <group key={spec.stop.id} position={[spec.stop.position[0], 0, spec.stop.position[2]]}>
            {/* Main tower */}
            <mesh
              position={[0, spec.height / 2, 0]}
              castShadow
              onClick={(event) => handleClick(event, spec)}
              onPointerOver={(event) => handlePointerOver(event, spec)}
              onPointerOut={handlePointerOut}
            >
              <boxGeometry args={[spec.width, spec.height, spec.depth]} />
              <meshLambertMaterial
                color={spec.color}
                emissive={isHovered ? "#22d3ee" : "#000000"}
                emissiveIntensity={isHovered ? 0.55 : 0}
              />
            </mesh>

            {/* Roof block */}
            <mesh position={[0, spec.height + 1.6, 0]} castShadow>
              <boxGeometry args={[spec.width * 0.45, 3.2, spec.depth * 0.45]} />
              <meshLambertMaterial color="#0f172a" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
