import * as THREE from "three";
import { TIME_SEQUENCE, TimePhase } from "./world-config";
import { glowTexture } from "./textures";

/**
 * Premium animated sky + lighting with smooth Morning → Day → Sunset → Night
 * transitions. Continuous clock `t` in [0,1) spans the full cycle.
 */

interface PhaseKey {
  top: THREE.Color;
  horizon: THREE.Color;
  sunColor: THREE.Color;
  sunDir: THREE.Vector3;
  sunIntensity: number;
  ambient: number;
  hemi: number;
  night: number; // 0..1
}

function makePhase(hex: number, hz: number, sc: number, sd: THREE.Vector3, si: number, am: number, he: number, night: number): PhaseKey {
  return {
    top: new THREE.Color(hex),
    horizon: new THREE.Color(hz),
    sunColor: new THREE.Color(sc),
    sunDir: sd.clone().normalize(),
    sunIntensity: si,
    ambient: am,
    hemi: he,
    night,
  };
}

export const PHASES: Record<TimePhase, PhaseKey> = {
  morning: makePhase(
    0x8fc2f2, 0xdfeaf8, 0xffe4bd,
    new THREE.Vector3(0.55, 0.28, 0.5), 1.35, 0.55, 0.6, 0.05
  ),
  day: makePhase(
    0x3f96e8, 0xcfe6fb, 0xfff3dd,
    new THREE.Vector3(0.18, 0.98, 0.12), 2.7, 0.72, 0.82, 0.0
  ),
  sunset: makePhase(
    0xef7a45, 0xffc98f, 0xff7d3c,
    new THREE.Vector3(-0.6, 0.22, -0.5), 1.5, 0.5, 0.55, 0.15
  ),
  night: makePhase(
    0x0a1028, 0x1a2240, 0x9db4ff,
    new THREE.Vector3(0, -0.55, 0.7), 0.05, 0.28, 0.2, 0.95
  ),
};

export function phaseAt(t: number): TimePhase {
  const idx = Math.floor((t % 1) * TIME_SEQUENCE.length) % TIME_SEQUENCE.length;
  return TIME_SEQUENCE[idx];
}

export interface Sky {
  group: THREE.Group;
  update: (dt: number, t: number) => TimePhase;
  setTarget: (phase: TimePhase) => void;
  getNightFactor: () => number;
  setScene: (s: THREE.Scene) => void;
}

export function buildSky(): Sky {
  const group = new THREE.Group();
  const DOME_R = 1500;

  /* ---- gradient dome shader ---- */
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      uTop: { value: new THREE.Color(0x3f96e8) },
      uHorizon: { value: new THREE.Color(0xcfe6fb) },
      uSunColor: { value: new THREE.Color(0xfff3dd) },
      uSunDir: { value: new THREE.Vector3(0.18, 0.98, 0.12).normalize() },
      uSunIntensity: { value: 2.7 },
    },
    vertexShader: /* glsl */ `
      varying vec3 vNorm;
      void main() {
        vNorm = normalize(position);
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uTop;
      uniform vec3 uHorizon;
      uniform vec3 uSunColor;
      uniform vec3 uSunDir;
      uniform float uSunIntensity;
      varying vec3 vNorm;
      void main() {
        vec3 n = normalize(vNorm);
        float h = n.y;
        vec3 col = mix(uHorizon, uTop, smoothstep(0.0, 0.6, h));
        col = mix(col, uHorizon, smoothstep(0.12, -0.05, h));
        float sun = pow(max(dot(n, uSunDir), 0.0), 600.0) * uSunIntensity;
        float halo = pow(max(dot(n, uSunDir), 0.0), 6.0) * 0.25 * uSunIntensity;
        col += uSunColor * sun;
        col += uSunColor * halo;
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });
  const dome = new THREE.Mesh(new THREE.SphereGeometry(DOME_R, 32, 24), mat);
  group.add(dome);

  /* ---- stars ---- */
  const starGeo = new THREE.BufferGeometry();
  {
    const N = 900;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const a = Math.random() * Math.PI * 2;
      const y = Math.random() * 0.95 + 0.02;
      const r = Math.sqrt(1 - y * y);
      pos[i * 3] = Math.cos(a) * r * DOME_R * 1.02;
      pos[i * 3 + 1] = y * DOME_R;
      pos[i * 3 + 2] = Math.sin(a) * r * DOME_R;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  }
  const stars = new THREE.Points(
    starGeo,
    new THREE.PointsMaterial({
      color: 0xffffff,
      size: 2.2,
      sizeAttenuation: false,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    })
  );
  group.add(stars);

  /* ---- sun / moon glows ---- */
  const glowTex = glowTexture("rgba(255,255,255,1)");
  const sunSprite = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: glowTex, color: 0xffe9bd, transparent: true, opacity: 0.95, depthWrite: false })
  );
  sunSprite.scale.set(220, 220, 1);
  group.add(sunSprite);
  const moonSprite = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: glowTex, color: 0xdfe7ff, transparent: true, opacity: 0, depthWrite: false })
  );
  moonSprite.scale.set(150, 150, 1);
  group.add(moonSprite);

  /* ---- clouds ---- */
  const cloudGroup = new THREE.Group();
  const cloudMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.5,
    roughness: 1,
    depthWrite: false,
    fog: false,
  });
  const cloudSeed = Math.random() * 100;
  for (let i = 0; i < 14; i++) {
    const c = new THREE.Group();
    const parts = 3 + Math.floor(Math.random() * 3);
    for (let p = 0; p < parts; p++) {
      const s = 40 + Math.random() * 70;
      const blob = new THREE.Mesh(new THREE.SphereGeometry(s, 8, 8), cloudMat);
      blob.position.set((Math.random() - 0.5) * 90, (Math.random() - 0.5) * 14, (Math.random() - 0.5) * 40);
      blob.scale.y = 0.35;
      c.add(blob);
    }
    const a = Math.random() * Math.PI * 2;
    const r = 300 + Math.random() * 700;
    c.position.set(Math.cos(a) * r, 320 + Math.random() * 260, Math.sin(a) * r);
    cloudGroup.add(c);
  }
  group.add(cloudGroup);

  /* ---- lights ---- */
  const sunLight = new THREE.DirectionalLight(0xfff3dd, 2.7);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(2048, 2048);
  sunLight.shadow.camera.near = 50;
  sunLight.shadow.camera.far = 1200;
  const d = 260;
  sunLight.shadow.camera.left = -d;
  sunLight.shadow.camera.right = d;
  sunLight.shadow.camera.top = d;
  sunLight.shadow.camera.bottom = -d;
  sunLight.shadow.bias = -0.0004;
  group.add(sunLight);
  group.add(sunLight.target);

  const hemi = new THREE.HemisphereLight(0xcfe6fb, 0x3a3f4d, 0.8);
  group.add(hemi);
  const ambient = new THREE.AmbientLight(0xffffff, 0.35);
  group.add(ambient);

  let target = 1.0; // target normalized day-cycle position [0..1]
  let t = 0.4; // start near morning
  let current = sample(t);

  function interpKey(keys: PhaseKey[], u: number): PhaseKey {
    const n = keys.length;
    const f = u * n;
    const i = Math.floor(f) % n;
    const j = (i + 1) % n;
    const frac = f - i;
    const s = frac * frac * (3 - 2 * frac);
    const a = keys[i];
    const b = keys[j];
    const res = {
      top: a.top.clone().lerp(b.top, s),
      horizon: a.horizon.clone().lerp(b.horizon, s),
      sunColor: a.sunColor.clone().lerp(b.sunColor, s),
      sunDir: a.sunDir.clone().lerp(b.sunDir, s).normalize(),
      sunIntensity: a.sunIntensity + (b.sunIntensity - a.sunIntensity) * s,
      ambient: a.ambient + (b.ambient - a.ambient) * s,
      hemi: a.hemi + (b.hemi - a.hemi) * s,
      night: a.night + (b.night - a.night) * s,
    };
    return res;
  }

  function sample(tt: number): PhaseKey {
    return interpKey([PHASES.morning, PHASES.day, PHASES.sunset, PHASES.night], (tt % 1 + 1) % 1);
  }

  const nightFactor = () => current.night;

  function apply(k: PhaseKey) {
    mat.uniforms.uTop.value.copy(k.top);
    mat.uniforms.uHorizon.value.copy(k.horizon);
    mat.uniforms.uSunColor.value.copy(k.sunColor);
    mat.uniforms.uSunDir.value.copy(k.sunDir);
    mat.uniforms.uSunIntensity.value = k.sunIntensity;
    stars.material.opacity = k.night * 0.95;

    sunSprite.material.opacity = Math.max(0, k.night > 0.5 ? 0 : 1) * (k.sunIntensity > 0.3 ? 1 : 0) * 0.95;
    moonSprite.material.opacity = k.night * 0.9;

    const sunPos = k.sunDir.clone().multiplyScalar(900);
    sunSprite.position.copy(sunPos);
    moonSprite.position.copy(sunPos.clone().multiplyScalar(-1));

    sunLight.position.copy(sunDirToLight(k.sunDir));
    sunLight.intensity = k.sunIntensity;
    sunLight.color.copy(k.sunColor);
    hemi.intensity = k.hemi;
    hemi.color.copy(k.top);
    hemi.groundColor.set(k.night > 0.4 ? 0x0c1020 : 0x3a3f4d);
    ambient.intensity = k.ambient;

    const horizonC = k.horizon.clone();
    if (scene) {
      (scene.fog as THREE.Fog).color.copy(horizonC);
    }
  }

  function sunDirToLight(v: THREE.Vector3): THREE.Vector3 {
    // keep light above ground to avoid lighting from below; elevation min
    const c = v.clone();
    if (c.y < 0.12) c.y = 0.12;
    return c.normalize().multiplyScalar(520);
  }

  let scene: THREE.Scene | null = null;

  function update(dt: number, realT: number): TimePhase {
    // automatic gentle day cycle
    t = (t + dt / 90) % 1; // full cycle ~90s
    const targetReached = sample(t);
    current = targetReached;
    apply(current);
    // clouds drift
    cloudGroup.rotation.y += dt * 0.004;
    for (let i = 0; i < cloudGroup.children.length; i++) {
      const c = cloudGroup.children[i];
      c.position.x += dt * (0.4 + (i % 3) * 0.2) * Math.sin(cloudSeed + i);
      if (c.position.x > 1200) c.position.x = -1200;
    }
    stars.rotation.y += dt * 0.002;
    return phaseAt(t);
  }

  function setTarget(phase: TimePhase) {
    // jump clock to the start of that phase
    const idx = TIME_SEQUENCE.indexOf(phase);
    t = idx / TIME_SEQUENCE.length + 0.02;
  }

  return {
    group,
    update,
    setTarget,
    getNightFactor: nightFactor,
    setScene: (s: THREE.Scene) => {
      scene = s;
    },
  };
}
