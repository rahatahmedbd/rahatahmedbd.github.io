"use client";

import { Suspense, useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Html, ContactShadows, Float, useProgress } from "@react-three/drei";
import * as THREE from "three";
import { MuseumUI } from "./museum-ui";
import { MuseumLobby } from "./museum-lobby";
import { ProjectRoom } from "./project-room";

export function MuseumScene({ projects, categories, testimonials }: { projects: any[], categories: any[], testimonials: any[] }) {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [view, setView] = useState<"exterior" | "lobby" | "room">("lobby");

  const activeProject = useMemo(() => {
    return projects.find(p => p.id === activeProjectId) || null;
  }, [activeProjectId, projects]);

  const handleSelectProject = (id: string) => {
    setActiveProjectId(id);
    setView("room");
  };

  const handleBackToLobby = () => {
    setActiveProjectId(null);
    setView("lobby");
  };

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

        <Environment preset="night" />
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
