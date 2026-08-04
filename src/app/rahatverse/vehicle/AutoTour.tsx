'use client';

import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Vehicle } from './Vehicle';

// Tour stops (district positions)
const tourStops = [
  { id: 'store', name: 'Website Store', position: [0, 0, 0], description: 'Order your premium website here.' },
  { id: 'about', name: 'About Me', position: [0, 0, -60], description: 'Learn about Rahat Ahmed.' },
  { id: 'education', name: 'Education', position: [-52, 0, 52], description: 'Academic journey from village to college.' },
  { id: 'skills', name: 'Skills', position: [-60, 0, 0], description: 'Web Development & Teaching.' },
  { id: 'achievements', name: 'Achievements', position: [52, 0, -52], description: 'Awards and recognitions.' },
  { id: 'portfolio', name: 'Portfolio', position: [60, 0, 0], description: 'Projects and work showcase.' },
  { id: 'gallery', name: 'Gallery', position: [0, 0, 60], description: 'Memorable moments captured.' },
  { id: 'blood', name: 'Blood Donation', position: [52, 0, 52], description: 'Shantichakra Blood Society.' },
  { id: 'contact', name: 'Contact', position: [-52, 0, -52], description: 'Get in touch with Rahat.' },
  { id: 'ai', name: 'AI Assistant', position: [0, 35, -35], description: 'Future AI companion.' },
];

interface AutoTourProps {
  isPlaying: boolean;
  onStopChange: (stop: { id: string; name: string; description: string }) => void;
  onTourComplete: () => void;
}

export function AutoTour({ isPlaying, onStopChange, onTourComplete }: AutoTourProps) {
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [isMoving, setIsMoving] = useState(true);
  const vehicleRef = useRef<THREE.Group>(null!);
  const progressRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);

  const currentStop = tourStops[currentStopIndex];
  const nextStop = tourStops[(currentStopIndex + 1) % tourStops.length];

  // Smooth movement between stops
  useFrame(() => {
    if (!isPlaying || !isMoving) return;

    const now = Date.now();
    if (lastTimeRef.current === null) lastTimeRef.current = now;
    
    const elapsed = (now - lastTimeRef.current) / 1000;
    lastTimeRef.current = now;

    progressRef.current += elapsed * 0.08;

    if (progressRef.current >= 1) {
      progressRef.current = 0;
      setIsMoving(false);
      
      onStopChange(currentStop);
      
      setTimeout(() => {
        const nextIndex = (currentStopIndex + 1) % tourStops.length;
        setCurrentStopIndex(nextIndex);
        setIsMoving(true);
        
        if (nextIndex === 0) {
          onTourComplete();
        }
      }, 3500);
    }

    const t = Math.min(progressRef.current, 1);
    const easedT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    const x = THREE.MathUtils.lerp(currentStop.position[0], nextStop.position[0], easedT);
    const z = THREE.MathUtils.lerp(currentStop.position[2], nextStop.position[2], easedT);
    const y = 3;

    if (vehicleRef.current) {
      vehicleRef.current.position.set(x, y, z);
      
      const angle = Math.atan2(
        nextStop.position[2] - currentStop.position[2],
        nextStop.position[0] - currentStop.position[0]
      );
      vehicleRef.current.rotation.y = angle + Math.PI;
    }
  });

  return (
    <group ref={vehicleRef}>
      <Vehicle position={[0, 3, 0]} />
    </group>
  );
}
