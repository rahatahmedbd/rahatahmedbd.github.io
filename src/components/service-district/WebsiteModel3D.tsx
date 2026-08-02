"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Float, Sparkles, Ring, Sphere } from "@react-three/drei";
import * as THREE from "three";
import { RotateCcw, Eye, Sparkles as SparklesIcon, Cpu, ShieldCheck, Lock, CreditCard, Calendar } from "lucide-react";

interface WebsiteModel3DProps {
  category: string;
  pagesCount: string;
  isMultilingual: boolean;
  features: string[];
  estimatedScope: string;
}

// 3D Scene Inside Canvas
function SceneContent({
  category,
  pagesCount,
  isMultilingual,
  features,
}: WebsiteModel3DProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Slow ambient rotation
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
    }
  });

  // Calculate stack height based on pages count
  const numPages = useMemo(() => {
    if (pagesCount.includes("20")) return 6;
    if (pagesCount.includes("11")) return 5;
    if (pagesCount.includes("6")) return 4;
    if (pagesCount.includes("3") || pagesCount.includes("2")) return 3;
    return 1;
  }, [pagesCount]);

  const hasAdmin = features.includes("admin-panel");
  const hasAuth = features.includes("user-login") || features.includes("dashboard");
  const hasPayment = features.includes("payment-gateway");
  const hasAi = features.includes("ai-features");
  const hasBooking = features.includes("booking-system");
  const hasSeo = features.includes("seo-package");

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* 1. BASE BROWSER FRAME / FOUNDATION SLAB */}
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[4.2, 0.2, 2.8]} />
        <meshStandardMaterial
          color="#0f172a"
          roughness={0.2}
          metalness={0.8}
          wireframe={false}
        />
      </mesh>

      {/* Glowing Neon Edge Frame */}
      <lineSegments position={[0, -0.1, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(4.25, 0.22, 2.85)]} />
        <lineBasicMaterial color="#06b6d4" linewidth={2} />
      </lineSegments>

      {/* 2. FLOATING WEBSITE PAGE SLABS */}
      {Array.from({ length: numPages }).map((_, idx) => {
        const yPos = idx * 0.35 + 0.2;
        const color = idx === 0 ? "#10b981" : idx % 2 === 0 ? "#8b5cf6" : "#06b6d4";
        return (
          <Float key={idx} speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
            <mesh position={[0, yPos, 0]}>
              <boxGeometry args={[3.6 - idx * 0.2, 0.12, 2.2 - idx * 0.1]} />
              <meshStandardMaterial
                color={color}
                roughness={0.1}
                metalness={0.5}
                transparent
                opacity={0.85}
              />
            </mesh>
          </Float>
        );
      })}

      {/* 3. ADMIN PANEL CONTROL TOWER */}
      {hasAdmin && (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.4}>
          <group position={[-1.4, numPages * 0.35 + 0.6, -0.8]}>
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.3, 0.4, 0.8, 16]} />
              <meshStandardMaterial
                color="#f59e0b"
                emissive="#f59e0b"
                emissiveIntensity={0.6}
                roughness={0.1}
              />
            </mesh>
            <Sparkles count={15} scale={1} size={3} speed={0.4} color="#f59e0b" />
          </group>
        </Float>
      )}

      {/* 4. USER AUTH SECURITY SHIELD */}
      {hasAuth && (
        <Float speed={2.5} rotationIntensity={0.3} floatIntensity={0.5}>
          <group position={[1.4, numPages * 0.35 + 0.5, -0.8]}>
            <mesh position={[0, 0, 0]}>
              <octahedronGeometry args={[0.35]} />
              <meshStandardMaterial
                color="#3b82f6"
                emissive="#2563eb"
                emissiveIntensity={0.8}
                roughness={0.2}
              />
            </mesh>
          </group>
        </Float>
      )}

      {/* 5. PAYMENT GATEWAY GOLDEN COIN RING */}
      {hasPayment && (
        <Float speed={3} rotationIntensity={0.4} floatIntensity={0.6}>
          <group position={[1.4, numPages * 0.35 + 0.5, 0.8]}>
            <Ring args={[0.25, 0.4, 32]} position={[0, 0, 0]}>
              <meshStandardMaterial
                color="#10b981"
                emissive="#10b981"
                emissiveIntensity={0.9}
                side={THREE.DoubleSide}
              />
            </Ring>
          </group>
        </Float>
      )}

      {/* 6. AI NEURAL SPHERE */}
      {hasAi && (
        <Float speed={4} rotationIntensity={0.5} floatIntensity={0.8}>
          <group position={[0, numPages * 0.35 + 1.1, 0]}>
            <Sphere args={[0.45, 32, 32]}>
              <meshStandardMaterial
                color="#d946ef"
                emissive="#d946ef"
                emissiveIntensity={1.2}
                roughness={0.1}
                wireframe
              />
            </Sphere>
            <Sparkles count={30} scale={1.8} size={4} speed={0.8} color="#d946ef" />
          </group>
        </Float>
      )}

      {/* 7. BOOKING SYSTEM GRID PANEL */}
      {hasBooking && (
        <Float speed={2} floatIntensity={0.3}>
          <group position={[-1.4, numPages * 0.35 + 0.5, 0.8]}>
            <mesh>
              <boxGeometry args={[0.5, 0.5, 0.1]} />
              <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.5} />
            </mesh>
          </group>
        </Float>
      )}

      {/* 8. MULTILINGUAL DUAL ORBIT RING */}
      {isMultilingual && (
        <group position={[0, numPages * 0.35 + 0.2, 0]}>
          <Ring args={[2.2, 2.25, 64]} rotation={[Math.PI / 3, 0, 0]}>
            <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" side={THREE.DoubleSide} />
          </Ring>
        </group>
      )}

      {/* AMBIENT PARTICLES */}
      <Sparkles count={40} scale={6} size={3} speed={0.3} color="#38bdf8" />
    </group>
  );
}

export function WebsiteModel3D({
  category,
  pagesCount,
  isMultilingual,
  features,
  estimatedScope,
}: WebsiteModel3DProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const hasAdmin = features.includes("admin-panel");
  const hasAuth = features.includes("user-login") || features.includes("dashboard");
  const hasPayment = features.includes("payment-gateway");
  const hasAi = features.includes("ai-features");
  const hasBooking = features.includes("booking-system");

  return (
    <div className="relative w-full h-[380px] sm:h-[420px] rounded-3xl overflow-hidden border border-border/15 bg-slate-950/80 shadow-2xl backdrop-blur flex flex-col justify-between p-4 group">
      {/* Top Overlay HUD Bar */}
      <div className="z-10 flex items-center justify-between gap-2 px-3 py-2 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur text-xs">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="font-mono font-bold text-slate-200">LIVE 3D BLUEPRINT</span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-400 font-semibold text-[11px] border border-brand-500/30">
          {estimatedScope}
        </span>
      </div>

      {/* 3D Canvas / WebGL Render */}
      <div className="absolute inset-0 z-0">
        {mounted ? (
          <Canvas
            camera={{ position: [0, 4, 7], fov: 45 }}
            gl={{ antialias: true, alpha: true }}
          >
            <ambientLight intensity={0.7} />
            <directionalLight position={[10, 10, 5]} intensity={1.2} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#06b6d4" />
            <SceneContent
              category={category}
              pagesCount={pagesCount}
              isMultilingual={isMultilingual}
              features={features}
              estimatedScope={estimatedScope}
            />
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.8} />
          </Canvas>
        ) : (
          <div className="w-full h-full grid place-items-center text-slate-400 text-xs">
            Loading 3D Visualizer...
          </div>
        )}
      </div>

      {/* Active Feature Badges Overlay */}
      <div className="z-10 flex flex-wrap gap-1.5 p-2 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur">
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          <Eye className="h-3 w-3" />
          {pagesCount} Pages
        </span>
        {isMultilingual && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Bilingual (EN/BN)
          </span>
        )}
        {hasAdmin && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <ShieldCheck className="h-3 w-3" /> Admin CMS
          </span>
        )}
        {hasAuth && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Lock className="h-3 w-3" /> Auth
          </span>
        )}
        {hasPayment && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CreditCard className="h-3 w-3" /> Payments
          </span>
        )}
        {hasAi && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20">
            <Cpu className="h-3 w-3" /> AI Engine
          </span>
        )}
        {hasBooking && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Calendar className="h-3 w-3" /> Booking
          </span>
        )}
      </div>
    </div>
  );
}
