"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import { Physics } from "@react-three/rapier";
import { Environment, Loader, KeyboardControls } from "@react-three/drei";
import Player from "./Player";
import World from "./World";
import { GameUI } from "./GameUI";

export default function CanvasContainer() {
  const keyboardMap = useMemo(() => [
    { name: "forward", keys: ["ArrowUp", "KeyW"] },
    { name: "backward", keys: ["ArrowDown", "KeyS"] },
    { name: "left", keys: ["ArrowLeft", "KeyA"] },
    { name: "right", keys: ["ArrowRight", "KeyD"] },
    { name: "jump", keys: ["Space"] },
    { name: "run", keys: ["Shift"] },
    { name: "interact", keys: ["KeyE"] },
  ], []);

  return (
    <div className="fixed inset-0 w-full h-full z-0 bg-slate-950 touch-none">
      <KeyboardControls map={keyboardMap}>
        <Canvas
          shadows
          camera={{ position: [0, 5, 10], fov: 65 }}
          dpr={[1, 2]} // Support high DPI but cap at 2 for performance
          gl={{ antialias: false }} // Better performance
        >
          <Suspense fallback={null}>
            <Environment preset="city" />
            
            <ambientLight intensity={0.4} />
            <directionalLight
              castShadow
              position={[20, 30, 10]}
              intensity={1.5}
              shadow-mapSize={[1024, 1024]}
              shadow-camera-left={-30}
              shadow-camera-right={30}
              shadow-camera-top={30}
              shadow-camera-bottom={-30}
              shadow-bias={-0.0001}
            />
            
            <Physics timeStep="vary">
              <Player />
              <World />
            </Physics>

          </Suspense>
        </Canvas>
      </KeyboardControls>
      
      <Loader 
        containerStyles={{ backgroundColor: '#0f172a' }}
        innerStyles={{ backgroundColor: '#06b6d4', width: '300px' }}
        barStyles={{ backgroundColor: '#ffffff' }}
        dataInterpolation={(p) => `Loading RahatVerse... ${p.toFixed(0)}%`}
      />
      <GameUI />
    </div>
  );
}
