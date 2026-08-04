'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { AutoTour } from './vehicle/AutoTour';
import { InfoPanel } from './ui/InfoPanel';
import { MiniMap } from './ui/MiniMap';
import { Controls } from './ui/Controls';
import { CameraController } from './camera/CameraController';

// RahatVerse - Phase 10: Camera, Controls & Interaction

export default function RahatVerseExperience() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentStop, setCurrentStop] = useState<{ id: string; name: string; description: string } | null>(null);
  const [currentMode, setCurrentMode] = useState<'auto' | 'explore'>('auto');
  const [currentPosition] = useState<[number, number, number]>([0, 3, 0]);
  const [miniMapCollapsed, setMiniMapCollapsed] = useState(false);

  const handleStopChange = (stop: { id: string; name: string; description: string }) => {
    setCurrentStop(stop);
  };

  const handleTourComplete = () => {
    setIsPlaying(false);
  };

  const handleClosePanel = () => {
    setCurrentStop(null);
  };

  const handlePauseResume = () => {
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    setIsPlaying(true);
    setCurrentStop(null);
    window.location.reload();
  };

  const handleModeSwitch = (mode: 'auto' | 'explore') => {
    setCurrentMode(mode);
    if (mode === 'explore') setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0c12] text-white overflow-hidden">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🏙️</div>
            <div>
              <div className="font-semibold tracking-tight">RahatVerse</div>
              <div className="text-[10px] text-white/50 -mt-0.5">Interactive Experience</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
                ← Exit RahatVerse
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* 3D Scene */}
      <div className="fixed inset-0 pt-16">
        <Canvas
          camera={{ position: [0, 65, 95], fov: 42 }}
          style={{ background: '#0a0c12' }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[90, 140, 70]} intensity={1.6} castShadow />

          {/* Ground */}
          <mesh rotation={[-Math.PI * 0.5, 0, 0]} position={[0, -0.6, 0]} receiveShadow>
            <planeGeometry args={[320, 320]} />
            <meshLambertMaterial color="#0f172a" />
          </mesh>

          {/* Roads */}
          <mesh position={[0, 0.15, 0]} rotation={[0, 0, 0]}>
            <boxGeometry args={[260, 0.4, 6]} />
            <meshLambertMaterial color="#475569" />
          </mesh>
          <mesh position={[0, 0.15, 0]} rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[260, 0.4, 6]} />
            <meshLambertMaterial color="#475569" />
          </mesh>

          {/* Buildings */}
          <mesh position={[0, 16, 0]} castShadow>
            <boxGeometry args={[24, 32, 24]} />
            <meshLambertMaterial color="#1e40af" />
          </mesh>

          {/* Auto Tour Vehicle */}
          <AutoTour 
            isPlaying={isPlaying} 
            onStopChange={handleStopChange}
            onTourComplete={handleTourComplete}
          />

          {/* Camera Controller */}
          <CameraController 
            mode={currentMode === 'auto' ? 'follow' : 'free'} 
            targetPosition={currentPosition}
            enabled={currentMode === 'auto'}
          />

          <Stars radius={450} depth={90} count={1500} factor={3.5} fade speed={0.25} />
          <OrbitControls 
            enablePan 
            enableZoom 
            enableRotate 
            minDistance={25} 
            maxDistance={220} 
            enabled={currentMode === 'explore'}
          />
        </Canvas>
      </div>

      {/* Controls */}
      <Controls 
        isPlaying={isPlaying} 
        onPauseResume={handlePauseResume}
        onRestart={handleRestart}
        onModeSwitch={handleModeSwitch}
        currentMode={currentMode}
      />

      {/* Info Panel */}
      <InfoPanel stop={currentStop} onClose={handleClosePanel} />

      {/* Mini Map */}
      <MiniMap 
        currentPosition={currentPosition} 
        currentDistrict={currentStop?.name || 'Website Store'}
        isCollapsed={miniMapCollapsed}
        onToggle={() => setMiniMapCollapsed(!miniMapCollapsed)}
      />

      {/* Status Indicator */}
      <div className="fixed top-24 right-6 z-50 text-xs bg-black/60 px-4 py-2 rounded-full border border-white/10">
        {currentMode === 'auto' 
          ? (isPlaying ? '🚗 Auto Tour Active' : '⏸️ Tour Paused') 
          : '🕹️ Explore Mode'}
      </div>
    </div>
  );
}
