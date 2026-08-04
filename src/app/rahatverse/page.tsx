'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { CityScene } from './city/CityScene';

// RahatVerse Foundation - Phase 06
// 3D City Scene Foundation

export default function RahatVerseFoundation() {
  return (
    <div className="min-h-screen bg-[#0a0c12] text-white overflow-hidden">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="text-2xl">🏙️</div>
                <div>
                  <div className="font-semibold tracking-tight">RahatVerse</div>
                  <div className="text-[10px] text-white/50 -mt-0.5">3D City Experience</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
                  ← Back to Welcome
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
                  Website Experience
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </nav>

      {/* Hero Header */}
      <div className="pt-20 pb-8 text-center">
        <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-white/5 text-sm mb-4 border border-white/10">
          PHASE 06 — FOUNDATION
        </div>
        <h1 className="text-5xl md:text-6xl font-semibold tracking-[-2.5px]">RahatVerse</h1>
        <p className="text-white/60 mt-2">3D City Foundation Ready</p>
      </div>

      {/* 3D Scene Container */}
      <div className="relative mx-auto max-w-[1200px] px-4">
        <div className="aspect-video rounded-3xl overflow-hidden border border-white/10 bg-black relative">
          <CityScene />
        </div>
        
        <div className="text-center mt-4 text-xs text-white/40">
          Orbit Controls Enabled • Drag to rotate • Scroll to zoom
        </div>
      </div>

      {/* Foundation Status */}
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {[
            'Three.js + React Three Fiber',
            'Modular Architecture',
            'Camera System Ready',
            'Vehicle System Ready',
          ].map((item, index) => (
            <div key={index} className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10">
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10 py-8 text-center text-sm text-white/40">
        RahatVerse Foundation • Phase 06 Complete
      </div>
    </div>
  );
}
