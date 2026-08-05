"use client";

import React, { useEffect, useRef, useState } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";

import { rahatVerseTourStops, type RahatVerseStop } from "@/data/platform";

/**
 * Lightweight box-buildings placed at every RahatVerse tour stop.
 *
 * Interaction model (Phase 32):
 * - Desktop: hover previews the tooltip; click flies the camera.
 * - Mobile: there is no hover, so the FIRST tap previews the building
 *   (tooltip + highlight + "tap to visit" hint); the SECOND tap on the
 *   same building triggers the camera flight. Tapping elsewhere clears
 *   the preview.
 *
 * Visual polish (per user feedback — "city feels plain"):
 * - Warm lit windows on each building (small emissive boxes, cheap)
 * - A glowing cyan ring floats above the hovered/previewed building
 * - Tooltip DOM node is moved by the scene each frame (zero React
 *   re-renders) and clamped to the viewport so it never overflows
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

const WINDOW_COLOR = "#fcd34d";

interface BuildingSpec {
  stop: RahatVerseStop;
  width: number;
  depth: number;
  height: number;
  color: string;
  windows: Array<{ x: number; y: number; z: number; sx: number; sy: number; sz: number }>;
}

function buildingSpecs(): BuildingSpec[] {
  return rahatVerseTourStops.map((stop, index) => {
    const isStore = stop.id === "website-store";
    const width = isStore ? 24 : 12 + (index % 3) * 3;
    const depth = isStore ? 24 : 12 + ((index + 1) % 3) * 3;
    const height = isStore ? 34 : 20 + ((index * 7) % 18);

    // Two warm lit windows on the front face, staggered heights.
    const frontZ = depth / 2 + 0.08;
    const backZ = -depth / 2 - 0.08;
    const windows = [
      { x: -width * 0.22, y: height * 0.62, z: frontZ, sx: 2.4, sy: 3.2, sz: 0.15 },
      { x: width * 0.22, y: height * 0.38, z: frontZ, sx: 2.4, sy: 3.2, sz: 0.15 },
      { x: 0, y: height * 0.5, z: backZ, sx: 2.4, sy: 3.2, sz: 0.15 },
    ];

    return {
      stop,
      width,
      depth,
      height,
      color: BUILDING_COLORS[index % BUILDING_COLORS.length],
      windows,
    };
  });
}

interface BuildingsProps {
  tooltipRef: React.RefObject<HTMLDivElement | null>;
  onTooltipChange: (stop: RahatVerseStop | null) => void;
  /** True while the tooltip is in mobile "tap to visit" preview mode. */
  onPreviewChange: (previewing: boolean) => void;
  onSelect: (stop: RahatVerseStop) => void;
}

export function Buildings({
  tooltipRef,
  onTooltipChange,
  onPreviewChange,
  onSelect,
}: BuildingsProps) {
  const [specs] = useState<BuildingSpec[]>(() => buildingSpecs());
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [previewedId, setPreviewedId] = useState<string | null>(null);
  const ringRef = useRef<THREE.Mesh>(null!);
  // The last pointer type seen on this object (set by onPointerOver,
  // which is typed as PointerEvent — onClick's nativeEvent is not).
  const pointerTypeRef = useRef<"mouse" | "touch" | "pen">("mouse");

  const activeId = hoveredId ?? previewedId;
  const activeSpec = activeId === null ? null : (specs.find((s) => s.stop.id === activeId) ?? null);

  // Pointer cursor while interacting with a building.
  useEffect(() => {
    document.body.style.cursor = activeId ? "pointer" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [activeId]);

  // Keep the scene's tooltip in sync.
  useEffect(() => {
    onTooltipChange(activeSpec ? activeSpec.stop : null);
    onPreviewChange(hoveredId === null && previewedId !== null);
  }, [activeSpec, hoveredId, previewedId, onTooltipChange, onPreviewChange]);

  // Move the tooltip DOM node to the building's screen position each
  // frame, clamped to the viewport so it never overflows the screen.
  useFrame((state) => {
    const element = tooltipRef.current;
    if (!element) return;

    if (!activeSpec) {
      element.style.opacity = "0";
      return;
    }

    const position = new THREE.Vector3(
      activeSpec.stop.position[0],
      activeSpec.height + 3,
      activeSpec.stop.position[2],
    ).project(state.camera);

    if (position.z > 1) {
      element.style.opacity = "0";
      return;
    }

    const x = Math.min(
      Math.max((position.x * 0.5 + 0.5) * state.size.width, 100),
      state.size.width - 100,
    );
    const y = Math.min(
      Math.max((-position.y * 0.5 + 0.5) * state.size.height, 90),
      state.size.height - 70,
    );
    element.style.opacity = "1";
    element.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -130%)`;
  });

  // Slow ring spin above the active building.
  useFrame((_, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.6;
    }
  });

  const handlePointerOver = (event: ThreeEvent<PointerEvent>, spec: BuildingSpec) => {
    event.stopPropagation();
    pointerTypeRef.current =
      event.pointerType === "touch" ? "touch" : event.pointerType === "pen" ? "pen" : "mouse";
    // Touch has no hover — only real mouse/pen hovers preview.
    if (event.pointerType === "mouse" || event.pointerType === "pen") {
      setHoveredId(spec.stop.id);
    }
  };

  const handlePointerOut = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    if (event.pointerType === "mouse" || event.pointerType === "pen") {
      setHoveredId(null);
    }
  };

  const handleClick = (event: ThreeEvent<MouseEvent>, spec: BuildingSpec) => {
    event.stopPropagation();
    const isTouch = pointerTypeRef.current === "touch";

    if (isTouch) {
      // Mobile tap-to-preview: first tap previews, second tap visits.
      if (previewedId === spec.stop.id) {
        setPreviewedId(null);
        onSelect(spec.stop);
      } else {
        setHoveredId(null);
        setPreviewedId(spec.stop.id);
      }
      return;
    }

    // Desktop: hover already previewed — click flies the camera.
    onSelect(spec.stop);
  };

  return (
    <group>
      {specs.map((spec) => {
        const isActive = activeId === spec.stop.id;
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
                emissive={isActive ? "#22d3ee" : "#000000"}
                emissiveIntensity={isActive ? 0.5 : 0}
              />
            </mesh>

            {/* Roof block */}
            <mesh position={[0, spec.height + 1.6, 0]} castShadow>
              <boxGeometry args={[spec.width * 0.45, 3.2, spec.depth * 0.45]} />
              <meshLambertMaterial color="#0f172a" />
            </mesh>

            {/* Warm lit windows */}
            {spec.windows.map((w, windowIndex) => (
              <mesh key={windowIndex} position={[w.x, w.y, w.z]}>
                <boxGeometry args={[w.sx, w.sy, w.sz]} />
                <meshLambertMaterial
                  color={WINDOW_COLOR}
                  emissive={WINDOW_COLOR}
                  emissiveIntensity={isActive ? 1.6 : 0.7}
                />
              </mesh>
            ))}
          </group>
        );
      })}

      {/* Floating glow ring above the hovered/previewed building */}
      {activeSpec ? (
        <mesh
          ref={ringRef}
          position={[
            activeSpec.stop.position[0],
            activeSpec.height + 6.5,
            activeSpec.stop.position[2],
          ]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[Math.max(activeSpec.width, activeSpec.depth) * 0.6, 0.12, 8, 40]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.85} />
        </mesh>
      ) : null}
    </group>
  );
}
