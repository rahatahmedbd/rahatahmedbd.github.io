"use client";
import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Stars, Sparkles } from "@react-three/drei";
import * as THREE from "three";

function AbstractShape() {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (mesh.current) {
      mesh.current.rotation.y = clock.getElapsedTime() * 0.3;
      mesh.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
    }
  });
  return (
    <mesh ref={mesh} scale={2.2} castShadow receiveShadow>
      <torusKnotGeometry args={[0.8, 0.35, 128, 16]} />
      <meshStandardMaterial
        color="#c99a3e"
        emissive="#d4af37"
        emissiveIntensity={0.6}
        roughness={0.2}
        metalness={0.9}
        wireframe={false}
      />
    </mesh>
  );
}

function OrbitRing() {
  const ring = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ring.current) ring.current.rotation.z = clock.getElapsedTime() * 0.2;
  });
  return (
    <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <torusGeometry args={[2.4, 0.03, 8, 100]} />
      <meshStandardMaterial color="#f43f5e" emissive="#f43f5e" emissiveIntensity={0.5} roughness={0.2} metalness={0.9} />
    </mesh>
  );
}

export default function Hero3D() {
  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-brand-900/20 bg-gradient-to-b from-[#0a0a12] to-[#0f0f1a]">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        style={{ touchAction: "none" }}
        fallback={
          <div className="grid h-full place-items-center px-6 text-center text-sm text-white/65">
            Interactive preview is unavailable on this device.
          </div>
        }
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={2} color="#fff" />
          <pointLight position={[-3, -3, -3]} intensity={1} color="#c99a3e" />
          <AbstractShape />
          <OrbitRing />
          <Stars radius={40} depth={20} count={2000} factor={3} saturation={0} fade speed={0.5} />
          <Sparkles count={40} scale={6} size={2} speed={0.3} opacity={0.6} color="#d4af37" />
          <Environment preset="city" />
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            autoRotate={false}
            zoomSpeed={1.2}
            rotateSpeed={0.8}
            minDistance={3}
            maxDistance={12}
          />
        </Suspense>
      </Canvas>
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0a0a12]/80 via-transparent to-transparent" />
      <div className="absolute bottom-4 left-4 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 px-3 py-2 text-[11px] text-white/70 font-medium">
        🖱️ 1 Finger = Rotate · 2 Finger = Zoom / Resize
      </div>
    </div>
  );
}
