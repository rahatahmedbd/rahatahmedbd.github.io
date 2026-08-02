"use client";
import { useEffect, useRef } from "react";

export function Starfield({ density = 140, className = "" }: { density?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d", { alpha: true });
    if (!ctx) return;
    let raf = 0;
    let w = 0, h = 0, dpr = 1;
    type Star = { x:number; y:number; z:number; r:number; tw:number; hue:number };
    let stars: Star[] = [];
    
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = c.clientWidth * dpr;
      h = c.clientHeight * dpr;
      c.width = w;
      c.height = h;
      stars = Array.from({ length: density }, () => ({
        x: Math.random()*w,
        y: Math.random()*h,
        z: Math.random()*2+0.2,
        r: Math.random()*1.6+0.2,
        tw: Math.random()*Math.PI*2,
        hue: Math.random()>0.7 ? 350 : Math.random()>0.5 ? 200 : 260,
      }));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(c);

    const draw = (t: number) => {
      ctx.clearRect(0,0,w,h);
      // subtle vignette gradient
      for (const s of stars) {
        s.x -= s.z * 0.25;
        s.tw += 0.015 * s.z;
        if (s.x < 0) { s.x = w; s.y = Math.random()*h; }
        const alpha = 0.3 + Math.sin(s.tw)*0.3 + 0.4;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r*dpr, 0, Math.PI*2);
        if (s.hue>300) ctx.fillStyle=`hsla(${s.hue},90%,65%,${alpha})`;
        else ctx.fillStyle=`hsla(${s.hue},80%,70%,${alpha})`;
        ctx.fill();
        // glow
        if (s.r>1.2) {
          ctx.shadowBlur = 8 * dpr;
          ctx.shadowColor = ctx.fillStyle as string;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
      // faint grid movement
      ctx.strokeStyle = "rgba(120,120,160,0.06)";
      ctx.lineWidth = 0.5*dpr;
      const grid = 80*dpr;
      const offset = (t*0.02)%grid;
      for (let x = -offset; x < w+grid; x+=grid) {
        ctx.beginPath();
        ctx.moveTo(x,0);
        ctx.lineTo(x+ h*0.15, h);
        ctx.stroke();
      }
      for (let y=0; y<h; y+=grid) {
        ctx.beginPath();
        ctx.moveTo(0,y);
        ctx.lineTo(w, y+ w*0.02);
        ctx.stroke();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [density]);
  return <canvas ref={ref} className={`absolute inset-0 w-full h-full ${className}`} style={{ display: "block" }} />;
}

export function NebulaGlow() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-[30%] left-[10%] h-[80%] w-[60%] rounded-full bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.18),transparent_60%)] blur-[80px]" />
      <div className="absolute -top-[20%] right-[5%] h-[70%] w-[50%] rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.18),transparent_60%)] blur-[90px]" />
      <div className="absolute bottom-[0%] left-[30%] h-[60%] w-[70%] rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.12),transparent_65%)] blur-[100px]" />
      <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_0%,rgba(255,255,255,0.06),transparent_60%)]" />
    </div>
  );
}
