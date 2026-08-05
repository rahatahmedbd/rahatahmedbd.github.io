"use client";

import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface CameraControllerProps {
  mode: "follow" | "free";
  targetPosition: [number, number, number];
  enabled?: boolean;
  /**
   * When set, the camera flies smoothly to frame this position (easing
   * over ~1.4s) instead of cutting. onFocusComplete fires once when the
   * flight ends so the caller can reveal the building's content.
   */
  focusPosition?: [number, number, number] | null;
  onFocusComplete?: () => void;
}

const FOCUS_DURATION_MS = 1200;
const FOCUS_OFFSET = new THREE.Vector3(0, 34, 50);
const FOCUS_LOOK_AT = new THREE.Vector3(0, 12, 0);

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function CameraController({
  mode,
  targetPosition,
  enabled = true,
  focusPosition = null,
  onFocusComplete,
}: CameraControllerProps) {
  const { camera } = useThree();
  const flightRef = useRef<{
    from: THREE.Vector3;
    start: number;
    target: THREE.Vector3;
    done: boolean;
  } | null>(null);
  const completeFiredRef = useRef(false);

  // Start a new flight whenever a focus target arrives.
  useEffect(() => {
    if (!focusPosition) return;
    flightRef.current = {
      from: camera.position.clone(),
      start: performance.now(),
      target: new THREE.Vector3(...focusPosition),
      done: false,
    };
    completeFiredRef.current = false;
  }, [camera, focusPosition]);

  useFrame(() => {
    const flight = flightRef.current;

    // Focus flight takes priority over follow mode.
    if (flight && !flight.done) {
      const progress = Math.min((performance.now() - flight.start) / FOCUS_DURATION_MS, 1);
      const eased = easeInOutCubic(progress);

      const desiredPosition = flight.target.clone().add(FOCUS_OFFSET);
      camera.position.lerpVectors(flight.from, desiredPosition, eased);
      camera.lookAt(flight.target.clone().add(FOCUS_LOOK_AT));

      if (progress >= 1) {
        flight.done = true;
        flightRef.current = null;
        if (!completeFiredRef.current) {
          completeFiredRef.current = true;
          onFocusComplete?.();
        }
      }
      return;
    }

    if (!enabled || mode !== "follow") return;

    const target = new THREE.Vector3(...targetPosition);
    const offset = new THREE.Vector3(0, 35, 55);
    const desiredPosition = target.clone().add(offset);

    camera.position.lerp(desiredPosition, 0.04);
    camera.lookAt(target.x, target.y + 8, target.z);
  });

  return null;
}
