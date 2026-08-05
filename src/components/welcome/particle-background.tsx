"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Lightweight canvas 2D atmosphere for the cinematic welcome screen.
 *
 * - ~40-90 drifting particles (soft rose/white/amber) with slow sway
 * - 3 large, slowly drifting radial "orb" glows (burgundy / navy / amber)
 * - Subtle parallax: responds to mouse movement (desktop) and device
 *   tilt (mobile), lerped for smoothness
 * - prefers-reduced-motion: draws one static frame, no loop, no parallax
 * - Single <canvas>, capped devicePixelRatio, pauses when the tab is
 *   hidden — no WebGL, no dependencies beyond the browser
 */

interface Particle {
  baseX: number;
  baseY: number;
  radius: number;
  vy: number;
  swayAmp: number;
  swayFreq: number;
  phase: number;
  alpha: number;
  color: string;
}

interface Orb {
  x: number;
  y: number;
  radius: number;
  color: string;
  phaseX: number;
  phaseY: number;
  speed: number;
}

const ORB_COLORS = ["124,12,47", "26,60,90", "201,162,39"] as const;
const PARTICLE_COLORS = ["229,215,220", "226,190,200", "255,245,240", "201,162,39"] as const;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function ParticleBackground({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let orbs: Orb[] = [];
    let frameId = 0;
    let running = true;
    let lastTime = 0;

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const tilt = { gamma: 0, beta: 0 };

    const spawn = () => {
      const count = Math.max(36, Math.min(90, Math.floor((width * height) / 20000)));
      particles = Array.from({ length: count }, () => {
        const color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
        return {
          baseX: Math.random() * width,
          baseY: Math.random() * height,
          radius: 0.6 + Math.random() * 1.4,
          vy: 0.05 + Math.random() * 0.22,
          swayAmp: 6 + Math.random() * 14,
          swayFreq: 0.004 + Math.random() * 0.012,
          phase: Math.random() * Math.PI * 2,
          alpha: 0.1 + Math.random() * 0.32,
          color,
        };
      });

      const largest = Math.max(width, height);
      orbs = [
        {
          x: width * 0.22,
          y: height * 0.3,
          radius: largest * 0.34,
          color: ORB_COLORS[0],
          phaseX: 0,
          phaseY: 1.4,
          speed: 0.00008,
        },
        {
          x: width * 0.8,
          y: height * 0.68,
          radius: largest * 0.3,
          color: ORB_COLORS[1],
          phaseX: 2.1,
          phaseY: 0.6,
          speed: 0.00006,
        },
        {
          x: width * 0.58,
          y: height * 0.16,
          radius: largest * 0.22,
          color: ORB_COLORS[2],
          phaseX: 4.2,
          phaseY: 2.8,
          speed: 0.0001,
        },
      ];
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      spawn();
    };

    const drawStatic = () => {
      context.clearRect(0, 0, width, height);
      for (const orb of orbs) {
        const gradient = context.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
        gradient.addColorStop(0, `rgba(${orb.color},0.10)`);
        gradient.addColorStop(0.55, `rgba(${orb.color},0.045)`);
        gradient.addColorStop(1, `rgba(${orb.color},0)`);
        context.fillStyle = gradient;
        context.fillRect(orb.x - orb.radius, orb.y - orb.radius, orb.radius * 2, orb.radius * 2);
      }
      for (const particle of particles) {
        context.beginPath();
        context.arc(particle.baseX, particle.baseY, particle.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(${particle.color},${particle.alpha})`;
        context.fill();
      }
    };

    const draw = (time: number) => {
      if (!running) return;
      frameId = requestAnimationFrame(draw);

      const elapsed = time - lastTime;
      lastTime = time;
      if (elapsed > 100) return;

      // Smoothly approach the parallax target.
      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;

      const parallaxX = clamp(pointer.x * 14 + tilt.gamma * 9, -22, 22);
      const parallaxY = clamp(pointer.y * 10 + tilt.beta * 6, -18, 18);

      context.clearRect(0, 0, width, height);
      const t = time;

      // Orbs: slow drift + parallax.
      for (const orb of orbs) {
        const ox = orb.x + Math.sin(t * orb.speed + orb.phaseX) * 26 + parallaxX * 0.45;
        const oy = orb.y + Math.cos(t * orb.speed * 0.8 + orb.phaseY) * 20 + parallaxY * 0.45;
        const gradient = context.createRadialGradient(ox, oy, 0, ox, oy, orb.radius);
        gradient.addColorStop(0, `rgba(${orb.color},0.10)`);
        gradient.addColorStop(0.55, `rgba(${orb.color},0.045)`);
        gradient.addColorStop(1, `rgba(${orb.color},0)`);
        context.fillStyle = gradient;
        context.fillRect(ox - orb.radius, oy - orb.radius, orb.radius * 2, orb.radius * 2);
      }

      // Particles: gentle rise + sway + parallax.
      for (const particle of particles) {
        const y = particle.baseY - ((t * particle.vy * 0.016) % (height + 40));
        const x =
          particle.baseX +
          Math.sin(t * particle.swayFreq + particle.phase) * particle.swayAmp +
          parallaxX;
        const wrappedY = y < -20 ? height + 20 : y;
        context.beginPath();
        context.arc(x, wrappedY, particle.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(${particle.color},${particle.alpha})`;
        context.fill();
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointer.tx = (event.clientX / width) * 2 - 1;
      pointer.ty = (event.clientY / height) * 2 - 1;
    };

    const handleTilt = (event: DeviceOrientationEvent) => {
      if (event.gamma !== null && event.beta !== null) {
        tilt.gamma = clamp(event.gamma / 30, -1, 1);
        tilt.beta = clamp((event.beta - 45) / 30, -1, 1);
      }
    };

    const handleVisibility = () => {
      running = document.visibilityState === "visible";
      if (running && !reduceMotion) {
        cancelAnimationFrame(frameId);
        lastTime = 0;
        frameId = requestAnimationFrame(draw);
      }
    };

    resize();
    window.addEventListener("resize", resize);

    if (reduceMotion) {
      // Static frame only — no loop, no parallax.
      drawStatic();
      running = false;
    } else {
      window.addEventListener("pointermove", handlePointerMove, { passive: true });
      window.addEventListener("deviceorientation", handleTilt, { passive: true });
      document.addEventListener("visibilitychange", handleVisibility);
      frameId = requestAnimationFrame(draw);
    }

    return () => {
      running = false;
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("deviceorientation", handleTilt);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [reduceMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className ?? ""}`}
    />
  );
}
