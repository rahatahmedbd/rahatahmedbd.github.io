'use client';

import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CameraControllerProps {
  mode: 'follow' | 'free';
  targetPosition: [number, number, number];
  enabled?: boolean;
}

export function CameraController({ mode, targetPosition, enabled = true }: CameraControllerProps) {
  const { camera } = useThree();

  // Smooth follow camera
  useFrame(() => {
    if (!enabled || mode !== 'follow') return;

    const target = new THREE.Vector3(...targetPosition);
    const offset = new THREE.Vector3(0, 35, 55);
    const desiredPosition = target.clone().add(offset);

    camera.position.lerp(desiredPosition, 0.04);
    camera.lookAt(target.x, target.y + 8, target.z);
  });

  return null;
}
