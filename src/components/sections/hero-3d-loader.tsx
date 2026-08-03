"use client";

import dynamic from "next/dynamic";
import { Component, type ErrorInfo, type ReactNode } from "react";

const Hero3DScene = dynamic(() => import("./hero-3d"), {
  ssr: false,
  loading: () => <ScenePlaceholder label="Loading interactive preview…" />,
});

function ScenePlaceholder({ label }: { label: string }) {
  return (
    <div
      className="grid h-[420px] w-full place-items-center rounded-3xl border border-white/10 bg-gradient-to-b from-[#0a0a12] to-[#0f0f1a] px-6 text-center text-sm text-white/65"
      role="status"
    >
      {label}
    </div>
  );
}

class SceneErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Keep a non-essential WebGL problem from taking down the homepage.
    console.error("Interactive 3D preview could not start:", error, info);
  }

  render() {
    if (this.state.failed) {
      return <ScenePlaceholder label="Interactive preview is unavailable on this device." />;
    }

    return this.props.children;
  }
}

/**
 * Loads WebGL only in the browser. This avoids server/client canvas hydration
 * issues and makes the optional visual enhancement safe on unsupported devices.
 */
export default function Hero3DLoader() {
  return (
    <SceneErrorBoundary>
      <Hero3DScene />
    </SceneErrorBoundary>
  );
}
