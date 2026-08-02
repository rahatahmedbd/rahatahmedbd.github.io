"use client";
import { useRef } from "react";

export function useSwipe(onLeft: ()=>void, onRight: ()=>void, threshold = 60) {
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current===null || startY.current===null) return;
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const dx = endX - startX.current;
    const dy = endY - startY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > threshold) {
      if (dx < 0) onLeft(); else onRight();
    }
    startX.current = null;
    startY.current = null;
  };

  return { onTouchStart, onTouchEnd };
}
