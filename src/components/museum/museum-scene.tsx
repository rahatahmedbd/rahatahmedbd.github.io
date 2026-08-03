"use client";

import { Suspense, useEffect, useState, useMemo } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Html, ContactShadows, useProgress } from "@react-three/drei";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { MuseumUI } from "./museum-ui";
import { MuseumLobby } from "./museum-lobby";
import { ProjectRoom } from "./project-room";

/**
 * Procedural studio environment — identical premium reflections with zero
 * network downloads (the old `preset="night"` fetched a ~1MB HDR from a CDN
 * and could hang the museum on slow connections).
 */
function StudioEnvironment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envMap;
    return () => {
      scene.environment = null;
      envMap.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

function MuseumFallback() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#050a14] px-6 text-center text-white">
      <div className="text-4xl">🏛️</div>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          This device can&apos;t render the museum
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/55">
          The Portfolio Museum needs WebGL (3D graphics). Nothing is lost — the
          website experience carries exactly the same portfolio, achievements
          and gallery.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <a
          href="/#work"
          className="inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-brand-500 px-6 text-sm font-bold text-white"
        >
          Open the portfolio section
        </a>
        <a
          href="/order"
          className="inline-flex h-12 items-center rounded-full border border-white/15 px-6 text-sm font-semibold text-white/75 transition hover:border-white/35 hover:text-white"
        >
          Order a website
        </a>
      </div>
    </div>
  );
}

export function MuseumScene({ projects, categories, testimonials }: { projects: any[], categories: any[], testimonials: any[] }) {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [view, setView] = useState<"exterior" | "lobby" | "room">("lobby");
  const [webglOk, setWebglOk] = useState(true);

  const activeProject = useMemo(() => {
    return projects.find(p => p.id === activeProjectId) || null;
  }, [activeProjectId, projects]);

  /* Bail out gracefully when WebGL is unavailable — never a 500 page. */
  useEffect(() => {
    try {
      const probe = document.createElement("canvas");
      const gl =
        probe.getContext("webgl2") ||
        probe.getContext("webgl") ||
        probe.getContext("experimental-webgl");
      setWebglOk(!!gl);
    } catch {
      setWebglOk(false);
    }
  }, []);

  const handleSelectProject = (id: string) => {
    setActiveProjectId(id);
    setView("room");
  };

  const handleBackToLobby = () => {
    setActiveProjectId(null);
    setView("lobby");
  };

  if (!webglOk) {
    return <MuseumFallback />;
  }

  return (
    <>
      <MuseumUI 
        view={view} 
        project={activeProject} 
        onBack={handleBackToLobby}
        projectsCount={projects.length}
      />
      
      <Canvas
        camera={{ position: [0, 5, 15], fov: 45 }}
        gl={{ antialias: true, alpha: false, toneMapping: THREE.ACESFilmicToneMapping }}
        dpr={[1, 2]}
      >
        <color attach="background" args={["#050a14"]} />
        <fog attach="fog" args={["#050a14", 10, 50]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#22d3ee" />
        <directionalLight position={[-10, 10, -5]} intensity={1} color="#f43f5e" />

        <Suspense fallback={<Loader />}>
          {view === "lobby" && (
            <MuseumLobby projects={projects} testimonials={testimonials} onSelect={handleSelectProject} />
          )}
          {view === "room" && activeProject && (
            <ProjectRoom project={activeProject} />
          )}
        </Suspense>

        <StudioEnvironment />
        <ContactShadows resolution={1024} scale={50} blur={2} opacity={0.5} far={10} color="#22d3ee" />
      </Canvas>
    </>
  );
}

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-16 h-16 border-4 border-t-[#22d3ee] border-[#0b1526] rounded-full animate-spin" />
        <div className="text-xl font-bold tracking-widest text-[#22d3ee]">LOADING MUSEUM {Math.round(progress)}%</div>
      </div>
    </Html>
  );
}
