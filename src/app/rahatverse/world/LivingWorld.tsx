"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface LivingWorldProps {
  timeOfDay: "morning" | "day" | "evening" | "night";
  weather: "sunny" | "cloudy" | "rain";
}

/**
 * Theme-driven environment for RahatVerse.
 *
 * Owns every theme-dependent visual: gradient sky, fog, ambient /
 * hemisphere / directional lights, street lamps, drifting clouds and a
 * lightweight starfield. All values lerp toward the active theme each
 * frame, so switching themes transitions smoothly instead of cutting.
 *
 * Performance notes (mid-range mobile safe):
 * - Sky is a single 64x256 canvas-texture sphere (1 draw call, no shader)
 * - Stars are 350 points with additive blending (1 draw call)
 * - Lamps/clouds/trees are primitive geometry with shared cheap materials
 * - Everything animates through direct ref writes in useFrame (no React
 *   re-renders per frame)
 */

type TimeOfDay = NonNullable<LivingWorldProps["timeOfDay"]>;

interface ThemeConfig {
  skyTop: string;
  skyBottom: string;
  fog: string;
  ambient: number;
  hemisphere: { sky: string; ground: string; intensity: number };
  directional: { color: string; intensity: number; position: [number, number, number] };
  stars: number;
  /** Moon glow intensity (0 = invisible, 1 = full night moon). */
  moon: number;
  clouds: number;
  lamps: number;
  billboard: number;
}

const THEMES: Record<TimeOfDay, ThemeConfig> = {
  morning: {
    skyTop: "#2c5aa0",
    skyBottom: "#ffd9a8",
    fog: "#c9d6ec",
    ambient: 0.55,
    hemisphere: { sky: "#bfdbfe", ground: "#8b9bb4", intensity: 0.6 },
    directional: { color: "#ffd9a0", intensity: 1.15, position: [-70, 45, 50] },
    stars: 0,
    moon: 0,
    clouds: 0.55,
    lamps: 0,
    billboard: 0.35,
  },
  day: {
    skyTop: "#0ea5e9",
    skyBottom: "#e0f2fe",
    fog: "#cfe7f7",
    ambient: 0.6,
    hemisphere: { sky: "#7dd3fc", ground: "#9fb3c8", intensity: 0.7 },
    directional: { color: "#ffffff", intensity: 1.6, position: [90, 140, 70] },
    stars: 0,
    moon: 0,
    clouds: 0.75,
    lamps: 0,
    billboard: 0.35,
  },
  evening: {
    skyTop: "#1e1b4b",
    skyBottom: "#ff8c42",
    fog: "#b77a5e",
    ambient: 0.42,
    hemisphere: { sky: "#fda4af", ground: "#5b3a2a", intensity: 0.5 },
    directional: { color: "#ffb07a", intensity: 0.9, position: [60, 25, -80] },
    stars: 0.35,
    moon: 0.4,
    clouds: 0.35,
    lamps: 2.2,
    billboard: 0.75,
  },
  night: {
    skyTop: "#020617",
    skyBottom: "#1e293b",
    fog: "#0b1424",
    ambient: 0.25,
    hemisphere: { sky: "#1e3a8a", ground: "#0f172a", intensity: 0.35 },
    directional: { color: "#9db8ff", intensity: 0.45, position: [-50, 70, -60] },
    stars: 1,
    moon: 1,
    clouds: 0.08,
    lamps: 2.9,
    billboard: 1.1,
  },
};

const SKY_RADIUS = 420;
const STAR_COUNT = 350;
const LERP_FACTOR = 0.05;
const STAR_SEED = 20260805;

/**
 * Deterministic PRNG (mulberry32) so star placement is stable across
 * renders and the React Compiler's purity rule is satisfied (no
 * Math.random calls inside useMemo).
 */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function paintSkyGradient(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  texture: THREE.CanvasTexture,
  top: string,
  bottom: string,
) {
  const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, top);
  gradient.addColorStop(1, bottom);
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
  texture.needsUpdate = true;
}

const LAMP_POSITIONS: ReadonlyArray<[number, number]> = [
  [40, 0],
  [0, 40],
  [-40, 0],
  [0, -40],
  [30, 30],
  [-30, 30],
  [30, -30],
  [-30, -30],
];

const CLOUDS: ReadonlyArray<{ x: number; y: number; z: number; scale: number }> = [
  { x: -50, y: 88, z: -60, scale: 1 },
  { x: 55, y: 84, z: -70, scale: 0.8 },
  { x: -90, y: 80, z: 30, scale: 0.7 },
  { x: 85, y: 82, z: 45, scale: 0.9 },
  { x: -30, y: 92, z: 90, scale: 0.75 },
  { x: 95, y: 78, z: -30, scale: 0.65 },
];

export function LivingWorld({ timeOfDay, weather }: LivingWorldProps) {
  const treesRef = useRef<THREE.Group>(null!);
  const cloudsGroupRef = useRef<THREE.Group>(null!);
  const ambientRef = useRef<THREE.AmbientLight>(null!);
  const hemisphereRef = useRef<THREE.HemisphereLight>(null!);
  const directionalRef = useRef<THREE.DirectionalLight>(null!);
  const directionalPosition = useRef(new THREE.Vector3(...THEMES.day.directional.position));
  const fogRef = useRef<THREE.Fog>(null!);
  const starsMaterialRef = useRef<THREE.PointsMaterial>(null!);
  const moonMaterialRef = useRef<THREE.MeshBasicMaterial>(null!);
  const moonHaloMaterialRef = useRef<THREE.MeshBasicMaterial>(null!);
  const billboardMaterialRef = useRef<THREE.MeshLambertMaterial>(null!);
  const lampHeadRefs = useRef<(THREE.MeshLambertMaterial | null)[]>([]);
  const cloudMaterialRefs = useRef<(THREE.MeshLambertMaterial | null)[]>([]);

  // Sky gradient painted onto a tiny canvas texture (no shaders).
  // Created once via a lazy state initializer with the "day" start state;
  // useFrame repaints it during theme transitions (frame callbacks may
  // mutate the texture).
  const [sky] = useState<{
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    texture: THREE.CanvasTexture;
  } | null>(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 256;
    const context = canvas.getContext("2d");
    if (!context) return null;
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    paintSkyGradient(canvas, context, texture, THEMES.day.skyTop, THEMES.day.skyBottom);
    return { canvas, context, texture };
  });

  // Target colors as THREE.Color per theme (recreated only on theme change).
  const targetColors = useMemo(
    () => ({
      hemiSky: new THREE.Color(THEMES[timeOfDay].hemisphere.sky),
      hemiGround: new THREE.Color(THEMES[timeOfDay].hemisphere.ground),
      dirColor: new THREE.Color(THEMES[timeOfDay].directional.color),
      skyTop: new THREE.Color(THEMES[timeOfDay].skyTop),
      skyBottom: new THREE.Color(THEMES[timeOfDay].skyBottom),
      fog: new THREE.Color(THEMES[timeOfDay].fog),
    }),
    [timeOfDay],
  );

  // Current (animated) values — start at "day" so the first load lerps in.
  const current = useRef({
    ambient: THEMES.day.ambient,
    hemiIntensity: THEMES.day.hemisphere.intensity,
    dirIntensity: THEMES.day.directional.intensity,
    stars: 0,
    moon: 0,
    clouds: THEMES.day.clouds,
    lamps: 0,
    billboard: THEMES.day.billboard,
    hemiSky: new THREE.Color(THEMES.day.hemisphere.sky),
    hemiGround: new THREE.Color(THEMES.day.hemisphere.ground),
    dirColor: new THREE.Color(THEMES.day.directional.color),
    skyTop: new THREE.Color(THEMES.day.skyTop),
    skyBottom: new THREE.Color(THEMES.day.skyBottom),
    fog: new THREE.Color(THEMES.day.fog),
  });

  // Star positions: sparse upper shell inside the sky sphere.
  // Seeded PRNG keeps this deterministic (stable across renders).
  const starPositions = useMemo(() => {
    const random = mulberry32(STAR_SEED);
    const positions = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      const radius = 340 + random() * 60;
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = Math.abs(radius * Math.cos(phi)) * 0.9 + 8;
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    return positions;
  }, []);

  useFrame((state) => {
    // Gentle tree swaying
    if (treesRef.current) {
      treesRef.current.children.forEach((tree, i) => {
        tree.rotation.z = Math.sin(state.clock.elapsedTime * 0.7 + i) * 0.025;
      });
    }

    // Cloud drift
    if (cloudsGroupRef.current) {
      cloudsGroupRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.04) * 12;
    }

    const target = THEMES[timeOfDay];
    const c = current.current;
    const damp = (a: number, b: number) => a + (b - a) * LERP_FACTOR;
    const colors = targetColors;

    c.ambient = damp(c.ambient, target.ambient);
    c.hemiIntensity = damp(c.hemiIntensity, target.hemisphere.intensity);
    c.dirIntensity = damp(c.dirIntensity, target.directional.intensity);
    c.stars = damp(c.stars, target.stars);
    c.moon = damp(c.moon, target.moon);
    c.clouds = damp(c.clouds, target.clouds);
    c.lamps = damp(c.lamps, target.lamps);
    c.billboard = damp(c.billboard, target.billboard);
    c.hemiSky.lerp(colors.hemiSky, LERP_FACTOR);
    c.hemiGround.lerp(colors.hemiGround, LERP_FACTOR);
    c.dirColor.lerp(colors.dirColor, LERP_FACTOR);
    c.skyTop.lerp(colors.skyTop, LERP_FACTOR);
    c.skyBottom.lerp(colors.skyBottom, LERP_FACTOR);
    c.fog.lerp(colors.fog, LERP_FACTOR);

    if (ambientRef.current) ambientRef.current.intensity = c.ambient;

    if (hemisphereRef.current) {
      hemisphereRef.current.intensity = c.hemiIntensity;
      hemisphereRef.current.color.copy(c.hemiSky);
      hemisphereRef.current.groundColor.copy(c.hemiGround);
    }

    if (directionalRef.current) {
      directionalRef.current.intensity = c.dirIntensity;
      directionalRef.current.color.copy(c.dirColor);
      directionalPosition.current.lerp(
        new THREE.Vector3(...target.directional.position),
        LERP_FACTOR,
      );
      directionalRef.current.position.copy(directionalPosition.current);
    }

    if (fogRef.current) {
      fogRef.current.color.copy(c.fog);
      // Cloudy weather thickens the fog slightly.
      const near = weather === "cloudy" ? 60 : 90;
      fogRef.current.near = near;
    }

    // Stars: gentle twinkle (opacity + size shimmer) on top of the
    // theme fade — a single cheap points draw stays one call.
    if (starsMaterialRef.current) {
      const time = state.clock.elapsedTime;
      const twinkle = 0.82 + 0.18 * Math.sin(time * 1.7);
      starsMaterialRef.current.opacity = c.stars * twinkle;
      starsMaterialRef.current.size = 0.5 + 0.08 * Math.sin(time * 2.3);
    }
    if (moonMaterialRef.current) moonMaterialRef.current.opacity = c.moon;
    if (moonHaloMaterialRef.current) {
      moonHaloMaterialRef.current.opacity = c.moon * 0.22;
    }
    if (billboardMaterialRef.current) {
      billboardMaterialRef.current.emissiveIntensity = c.billboard;
    }

    for (const material of lampHeadRefs.current) {
      if (material) material.emissiveIntensity = c.lamps;
    }
    for (const material of cloudMaterialRefs.current) {
      if (material) material.opacity = c.clouds;
    }

    // Repaint the sky canvas only while the colors are still moving.
    if (sky && (!c.skyTop.equals(colors.skyTop) || !c.skyBottom.equals(colors.skyBottom))) {
      paintSkyGradient(
        sky.canvas,
        sky.context,
        sky.texture,
        c.skyTop.getStyle(),
        c.skyBottom.getStyle(),
      );
    }
  });

  return (
    <group>
      {/* ---- Lights (theme-driven, lerped) ---- */}
      <ambientLight ref={ambientRef} intensity={0.6} />
      <hemisphereLight ref={hemisphereRef} args={["#7dd3fc", "#9fb3c8", 0.7]} />
      <directionalLight ref={directionalRef} position={[90, 140, 70]} intensity={1.6} castShadow />

      {/* ---- Gradient sky (canvas texture sphere) ---- */}
      {sky ? (
        <mesh>
          <sphereGeometry args={[SKY_RADIUS, 24, 12]} />
          <meshBasicMaterial
            map={sky.texture}
            side={THREE.BackSide}
            fog={false}
            depthWrite={false}
          />
        </mesh>
      ) : null}

      {/* ---- Theme fog ---- */}
      <fog ref={fogRef} attach="fog" args={["#cfe7f7", 90, 260]} />

      {/* ---- Night starfield (lightweight points) ---- */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[starPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={starsMaterialRef}
          color="#e2e8f0"
          size={0.55}
          sizeAttenuation
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* ---- Night moon (fades in with the theme) ---- */}
      <mesh position={[-250, 285, -230]}>
        <sphereGeometry args={[16, 16, 16]} />
        <meshBasicMaterial
          ref={moonMaterialRef}
          color="#f1f5f9"
          transparent
          opacity={0}
          fog={false}
        />
      </mesh>
      <mesh position={[-250, 285, -230]}>
        <sphereGeometry args={[34, 16, 16]} />
        <meshBasicMaterial
          ref={moonHaloMaterialRef}
          color="#cbd5e1"
          transparent
          opacity={0}
          fog={false}
          depthWrite={false}
        />
      </mesh>

      {/* ---- Drifting clouds (day emphasis, fade at night) ---- */}
      <group ref={cloudsGroupRef}>
        {CLOUDS.map((cloud, cloudIndex) => (
          <group key={cloudIndex} position={[cloud.x, cloud.y, cloud.z]} scale={cloud.scale}>
            {[
              { x: 0, y: 0, r: 12 },
              { x: 10, y: 3, r: 9 },
            ].map((puff, puffIndex) => (
              <mesh key={puffIndex} position={[puff.x, puff.y, 0]}>
                <sphereGeometry args={[puff.r, 10, 8]} />
                <meshLambertMaterial
                  ref={(material) => {
                    cloudMaterialRefs.current[cloudIndex * 2 + puffIndex] = material;
                  }}
                  color="#f1f5f9"
                  transparent
                  opacity={0.75}
                />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      {/* ---- Street lamps (on at evening/night) ---- */}
      {LAMP_POSITIONS.map(([x, z], index) => (
        <group key={index} position={[x, 0, z]}>
          <mesh position={[0, 3.5, 0]}>
            <cylinderGeometry args={[0.25, 0.35, 7, 8]} />
            <meshLambertMaterial color="#334155" />
          </mesh>
          <mesh position={[0, 7.4, 0]}>
            <boxGeometry args={[1.1, 0.5, 1.1]} />
            <meshLambertMaterial
              ref={(material) => {
                lampHeadRefs.current[index] = material;
              }}
              color="#1e293b"
              emissive="#fbbf24"
              emissiveIntensity={0}
            />
          </mesh>
        </group>
      ))}

      {/* ---- Animated Trees ---- */}
      <group ref={treesRef}>
        {[-70, -20, 30, 75].map((x, index) => (
          <group key={index} position={[x, 0, -25]}>
            <mesh position={[0, 3, 0]}>
              <cylinderGeometry args={[0.6, 0.8, 6]} />
              <meshLambertMaterial color="#334155" />
            </mesh>
            <mesh position={[0, 8.5, 0]}>
              <sphereGeometry args={[3.8]} />
              <meshLambertMaterial color="#166534" />
            </mesh>
          </group>
        ))}
      </group>

      {/* ---- Billboard (glows more at night) ---- */}
      <group position={[0, 48, -85]}>
        <mesh>
          <boxGeometry args={[20, 7, 1.2]} />
          <meshLambertMaterial
            ref={billboardMaterialRef}
            color="#1e40af"
            emissive="#1e3a8a"
            emissiveIntensity={0.35}
          />
        </mesh>
        <mesh position={[0, 0, 0.7]}>
          <planeGeometry args={[16, 4.5]} />
          <meshLambertMaterial color="#bae6fd" transparent opacity={0.85} />
        </mesh>
      </group>
    </group>
  );
}
