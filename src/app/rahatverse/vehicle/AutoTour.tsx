"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { rahatVerseTourStops, type RahatVerseStop } from "@/data/platform";
import { Vehicle } from "./Vehicle";

interface AutoTourProps {
  isPlaying: boolean;
  initialStopIndex?: number;
  resetToken?: number;
  onStopChange: (stop: RahatVerseStop) => void;
  onProgressChange?: (progress: { stopId: string; stopIndex: number }) => void;
  onTourComplete: () => void;
  /** Written every frame with the vehicle's live world position. */
  positionRef?: React.RefObject<[number, number, number]>;
}

function clampStopIndex(index: number): number {
  return Math.min(Math.max(Math.floor(index), 0), rahatVerseTourStops.length - 1);
}

export function AutoTour({
  isPlaying,
  initialStopIndex = 0,
  resetToken = 0,
  onStopChange,
  onProgressChange,
  onTourComplete,
  positionRef,
}: AutoTourProps) {
  const initialStopIndexRef = useRef(clampStopIndex(initialStopIndex));
  const [currentStopIndex, setCurrentStopIndex] = useState(clampStopIndex(initialStopIndex));
  const [isMoving, setIsMoving] = useState(true);
  const vehicleRef = useRef<THREE.Group>(null!);
  const progressRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentStop = rahatVerseTourStops[currentStopIndex] ?? rahatVerseTourStops[0];
  const nextStop = rahatVerseTourStops[(currentStopIndex + 1) % rahatVerseTourStops.length];

  useEffect(() => {
    const nextIndex = resetToken === 0 ? initialStopIndexRef.current : 0;
    setCurrentStopIndex(nextIndex);
    setIsMoving(true);
    progressRef.current = 0;
    lastTimeRef.current = null;
  }, [resetToken]);

  useEffect(() => {
    if (!isPlaying) lastTimeRef.current = null;
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    };
  }, []);

  useFrame(() => {
    if (!isPlaying || !isMoving || !currentStop || !nextStop) return;

    const now = Date.now();
    if (lastTimeRef.current === null) lastTimeRef.current = now;

    const elapsed = (now - lastTimeRef.current) / 1000;
    lastTimeRef.current = now;
    progressRef.current += elapsed * 0.08;

    if (progressRef.current >= 1) {
      progressRef.current = 0;
      lastTimeRef.current = null;
      setIsMoving(false);
      onStopChange(currentStop);
      onProgressChange?.({ stopId: currentStop.id, stopIndex: currentStopIndex });

      pauseTimeoutRef.current = setTimeout(() => {
        const nextIndex = (currentStopIndex + 1) % rahatVerseTourStops.length;
        setCurrentStopIndex(nextIndex);
        setIsMoving(true);
        if (nextIndex === 0) onTourComplete();
      }, 3500);
      return;
    }

    const t = Math.min(progressRef.current, 1);
    const easedT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    const x = THREE.MathUtils.lerp(currentStop.position[0], nextStop.position[0], easedT);
    const z = THREE.MathUtils.lerp(currentStop.position[2], nextStop.position[2], easedT);

    if (vehicleRef.current) {
      vehicleRef.current.position.set(x, 3, z);
      const angle = Math.atan2(
        nextStop.position[2] - currentStop.position[2],
        nextStop.position[0] - currentStop.position[0],
      );
      vehicleRef.current.rotation.y = angle + Math.PI;
    }

    // Feed the live position to the mini-map (ref write, no re-render).
    if (positionRef) {
      positionRef.current = [x, 3, z];
    }
  });

  return (
    <group ref={vehicleRef}>
      <Vehicle position={[0, 3, 0]} />
    </group>
  );
}
