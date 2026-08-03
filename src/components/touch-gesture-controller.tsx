"use client";
import { useRef, useCallback, useState, useEffect, type ReactNode } from "react";
interface Transform { x: number; y: number; scale: number; }
export default function TouchGestureController({ children, className = "" }: { children: ReactNode; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<Transform>({ x: 0, y: 0, scale: 1 });
  const pointers = useRef<Record<number, { x: number; y: number }>>({});
  const startDist = useRef(0); const startScale = useRef(1);
  const getDist = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.hypot(a.x - b.x, a.y - b.y);
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const el = containerRef.current; if (!el) return;
    el.setPointerCapture(e.pointerId);
    pointers.current[e.pointerId] = { x: e.clientX, y: e.clientY };
    if (Object.keys(pointers.current).length === 2) {
      const ids = Object.keys(pointers.current).map(Number); const a = pointers.current[ids[0]]!; const b = pointers.current[ids[1]]!;
      startDist.current = getDist(a, b); startScale.current = transform.scale;
    }
  }, [transform.scale]);
  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!containerRef.current) return;
    if (pointers.current[e.pointerId] === undefined) return;
    pointers.current[e.pointerId] = { x: e.clientX, y: e.clientY };
    const ids = Object.keys(pointers.current).map(Number);
    if (ids.length === 1) {
      const p = pointers.current[ids[0]]!; const rect = containerRef.current.getBoundingClientRect();
      const cx = rect.width / 2; const cy = rect.height / 2;
      setTransform((prev) => ({ ...prev, x: p.x - cx, y: p.y - cy }));
    } else if (ids.length === 2) {
      const a = pointers.current[ids[0]]!; const b = pointers.current[ids[1]]!;
      const d = getDist(a, b); const ratio = d / (startDist.current || 1);
      setTransform((prev) => ({ ...prev, scale: Math.max(0.4, Math.min(3, startScale.current * ratio)) }));
    }
  }, []);
  const onPointerUp = useCallback((e: React.PointerEvent) => {
    delete pointers.current[e.pointerId];
    if (Object.keys(pointers.current).length < 2) { startDist.current = 0; startScale.current = transform.scale; }
    try { (e.target as HTMLElement).releasePointerCapture?.(e.pointerId); } catch {}
  }, [transform.scale]);
  useEffect(() => {
    const handleWheels = (e: WheelEvent) => {
      if (!containerRef.current) return;
      if (e.ctrlKey || e.metaKey) { e.preventDefault(); setTransform((prev) => ({ ...prev, scale: Math.max(0.4, Math.min(3, prev.scale + e.deltaY * -0.002)) })); }
    };
    window.addEventListener("wheel", handleWheels, { passive: false });
    return () => window.removeEventListener("wheel", handleWheels);
  }, []);
  return (
    <div ref={containerRef} className={`relative touch-none select-none overflow-hidden ${className}`} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} style={{ touchAction: "none" }}>
      <div className="will-change-transform" style={{ transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`, transformOrigin: "center center", transition: "transform 0.08s linear" }}>
        {children}
      </div>
    </div>
  );
}
