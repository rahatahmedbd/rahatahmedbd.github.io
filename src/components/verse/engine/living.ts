import * as THREE from "three";
import { PALETTE, RESERVED } from "./world-config";
import { glowTexture, textTexture } from "./textures";
import type { InteractPayload } from "./landmarks";

/**
 * The living layer: NPC citizens, drones, decorative flying vehicles,
 * floating particles and hidden collectibles. Everything is procedural and
 * animated in the engine loop.
 */

export interface Living {
  group: THREE.Group;
  update: (dt: number, t: number, player: THREE.Vector3) => void;
  collectibles: Collectible[];
  collectiblePositions: THREE.Vector3[];
  getCollectedCount: () => number;
}

export interface Collectible {
  id: number;
  mesh: THREE.Object3D;
  position: THREE.Vector3;
  collected: boolean;
  label: string;
}

type NpcKind = "visitor" | "developer" | "designer" | "robot";

interface Npc {
  group: THREE.Group;
  kind: NpcKind;
  home: THREE.Vector3;
  waypoints: THREE.Vector3[];
  wpIndex: number;
  speed: number;
  walkPhase: number;
  state: "walk" | "idle" | "wave";
  stateTimer: number;
  legs: THREE.Object3D[];
  arms: THREE.Object3D[];
  head: THREE.Object3D;
  body: THREE.Object3D;
  hover?: boolean;
  phase: number;
}

function limbPivot(mat: THREE.Material, offset: [number, number], len: number, w: number): THREE.Group {
  const g = new THREE.Group();
  const m = new THREE.Mesh(new THREE.CylinderGeometry(w, w * 0.8, len, 6), mat);
  m.position.y = -len / 2;
  m.castShadow = true;
  g.add(m);
  g.position.set(offset[0], offset[1], 0);
  return g;
}

function makeHumanoid(kind: NpcKind): Npc {
  const g = new THREE.Group();
  const bodyMat = new THREE.MeshStandardMaterial({
    color:
      kind === "developer"
        ? 0x60a5fa
        : kind === "designer"
        ? 0xf472b6
        : kind === "robot"
        ? 0x94a3b8
        : 0xffffff,
    roughness: 0.7,
  });
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xf2c9a0, roughness: 0.8 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x22303e, roughness: 0.8 });
  const accentMat = new THREE.MeshStandardMaterial({ color: PALETTE.brand, roughness: 0.6 });

  if (kind === "robot") {
    // boxy hovering robot
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.1, 0.8), bodyMat);
    body.position.y = 1.5;
    body.castShadow = true;
    g.add(body);
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.55, 0.7), darkMat);
    head.position.y = 2.3;
    head.castShadow = true;
    g.add(head);
    const eye = new THREE.Mesh(
      new THREE.BoxGeometry(0.34, 0.12, 0.05),
      new THREE.MeshBasicMaterial({ color: PALETTE.cyan })
    );
    eye.position.set(0, 2.32, 0.36);
    g.add(eye);
    const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5, 6), darkMat);
    ant.position.set(0, 2.7, 0);
    g.add(ant);
    const tip = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 6, 6),
      new THREE.MeshStandardMaterial({ color: PALETTE.brand, emissive: PALETTE.brand, emissiveIntensity: 2 })
    );
    tip.position.set(0, 2.95, 0);
    g.add(tip);
    const armMat = new THREE.MeshStandardMaterial({ color: PALETTE.metalDark, roughness: 0.5, metalness: 0.6 });
    for (const side of [-1, 1]) {
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.9, 0.22), armMat);
      arm.position.set(side * 0.85, 1.5, 0);
      g.add(arm);
    }
    return {
      group: g, kind, home: new THREE.Vector3(), waypoints: [],
      wpIndex: 0, speed: 0.5, walkPhase: 0, state: "idle", stateTimer: 0,
      legs: [], arms: [], head, body, hover: true, phase: Math.random() * 10,
    };
  }

  // humanoid
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.62, 1.5, 8), bodyMat);
  torso.position.y = 1.6;
  torso.castShadow = true;
  g.add(torso);
  const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.66, 0.3, 8), accentMat);
  belt.position.y = 1.05;
  g.add(belt);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.42, 12, 10), skinMat);
  head.position.y = 2.6;
  head.castShadow = true;
  g.add(head);
  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.42, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), darkMat);
  hair.position.y = 2.72;
  g.add(hair);
  const legs: THREE.Object3D[] = [
    limbPivot(darkMat, [-0.22, 0.85], 1.0, 0.22),
    limbPivot(darkMat, [0.22, 0.85], 1.0, 0.22),
  ];
  const arms: THREE.Object3D[] = [
    limbPivot(bodyMat, [-0.62, 2.2], 1.15, 0.16),
    limbPivot(bodyMat, [0.62, 2.2], 1.15, 0.16),
  ];
  for (const l of legs) g.add(l);
  for (const a of arms) g.add(a);

  return {
    group: g, kind, home: new THREE.Vector3(), waypoints: [],
    wpIndex: 0, speed: 0.7, walkPhase: 0, state: "idle", stateTimer: 0,
    legs, arms, head, body: torso, hover: false, phase: Math.random() * 10,
  };
}

function makeWaypoints(home: THREE.Vector3, radius: number, count: number): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < count; i++) {
    const a = (Math.PI * 2 * i) / count + Math.random() * 0.4;
    const r = radius * (0.4 + Math.random() * 0.6);
    pts.push(new THREE.Vector3(home.x + Math.cos(a) * r, 0, home.z + Math.sin(a) * r));
  }
  return pts;
}

function makeDrone(): THREE.Group {
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.SphereGeometry(0.7, 10, 8),
    new THREE.MeshStandardMaterial({ color: 0x2c3e50, roughness: 0.4, metalness: 0.6 })
  );
  g.add(body);
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.85, 0.06, 6, 24),
    new THREE.MeshStandardMaterial({ color: PALETTE.cyan, emissive: PALETTE.cyan, emissiveIntensity: 2 })
  );
  ring.rotation.x = Math.PI / 2;
  g.add(ring);
  const armMat = new THREE.MeshStandardMaterial({ color: PALETTE.metalDark, roughness: 0.4, metalness: 0.6 });
  const rotorMat = new THREE.MeshStandardMaterial({ color: 0x111820, roughness: 0.6 });
  const propGroup = new THREE.Group();
  for (let i = 0; i < 4; i++) {
    const a = (Math.PI / 2) * i + Math.PI / 4;
    const arm = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.06, 0.12), armMat);
    arm.position.set(Math.cos(a) * 0.7, 0, Math.sin(a) * 0.7);
    arm.rotation.y = -a;
    g.add(arm);
    const rotor = new THREE.Mesh(new THREE.CircleGeometry(0.42, 14), rotorMat);
    rotor.rotation.x = -Math.PI / 2;
    rotor.position.set(Math.cos(a) * 1.4, 0.05, Math.sin(a) * 1.4);
    propGroup.add(rotor);
  }
  g.add(propGroup);
  const glow = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: glowTexture("rgba(103,232,249,0.9)"),
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );
  glow.scale.set(2.6, 2.6, 1);
  g.add(glow);
  (g as any).userData.prop = propGroup;
  return g;
}

function makeAirCar(): THREE.Group {
  const g = new THREE.Group();
  const hull = new THREE.Mesh(
    new THREE.SphereGeometry(1.6, 14, 10),
    new THREE.MeshStandardMaterial({ color: 0xdfe6f0, roughness: 0.35, metalness: 0.5 })
  );
  hull.scale.set(2.1, 0.8, 1);
  g.add(hull);
  const windowMat = new THREE.MeshStandardMaterial({
    color: PALETTE.cyan,
    emissive: PALETTE.cyan,
    emissiveIntensity: 1.4,
  });
  const wind = new THREE.Mesh(new THREE.SphereGeometry(1.3, 12, 8), windowMat);
  wind.scale.set(1.4, 0.5, 0.9);
  wind.position.y = 0.15;
  g.add(wind);
  const fin = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.5, 1.2),
    new THREE.MeshStandardMaterial({ color: PALETTE.metalDark, roughness: 0.4, metalness: 0.6 })
  );
  fin.position.set(0, 0.4, -1.8);
  g.add(fin);
  const glow = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: glowTexture("rgba(255,255,255,0.8)"),
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );
  glow.scale.set(5, 3, 1);
  g.add(glow);
  return g;
}

export function buildLiving(
  registerInteractive: (obj: THREE.Object3D, data: InteractPayload) => void
): Living {
  const group = new THREE.Group();
  const npcs: Npc[] = [];
  const drones: Array<{ group: THREE.Group; center: THREE.Vector3; radius: number; speed: number; phase: number }> = [];
  const cars: Array<{ group: THREE.Group; cx: number; cz: number; rx: number; rz: number; speed: number; phase: number; y: number }> = [];

  /* ---------- NPCs ---------- */
  const npcSpecs: Array<{ kind: NpcKind; x: number; z: number; r: number }> = [
    { kind: "visitor", x: 10, z: 20, r: 12 },
    { kind: "visitor", x: -14, z: 18, r: 12 },
    { kind: "developer", x: 8, z: -14, r: 12 },
    { kind: "designer", x: -8, z: -18, r: 12 },
    { kind: "visitor", x: 40, z: 60, r: 16 },
    { kind: "developer", x: -46, z: 52, r: 16 },
    { kind: "designer", x: 52, z: -46, r: 16 },
    { kind: "visitor", x: 0, z: 120, r: 20 },
    { kind: "robot", x: 20, z: -70, r: 14 },
  ];
  const greetings: Record<NpcKind, { title: string; body: string }> = {
    visitor: {
      title: "City Visitor",
      body: "“Welcome to RahatVerse! I'm just exploring the districts like you. The plaza is lovely at sunset.”",
    },
    developer: {
      title: "Developer Citizen",
      body: "“I help build the websites here. The Website Factory and AI Lab are reserved for future chapters.”",
    },
    designer: {
      title: "Designer Citizen",
      body: "“I design the holograms and interfaces you see around the city. The Portfolio Museum will showcase them soon.”",
    },
    robot: {
      title: "Service Robot",
      body: "BEEP. “I maintain the city's lights and screens. Everything here is safe and clean. Enjoy your visit.”",
    },
  };
  npcSpecs.forEach((spec, i) => {
    const npc = makeHumanoid(spec.kind);
    const home = new THREE.Vector3(spec.x, 0, spec.z);
    npc.home = home;
    npc.waypoints = makeWaypoints(home, spec.r, 5 + (i % 3));
    npc.waypoints.forEach((w) => (w.y = 0));
    npc.wpIndex = Math.floor(Math.random() * npc.waypoints.length);
    npc.group.position.copy(npc.waypoints[npc.wpIndex]);
    npc.group.scale.setScalar(0.9 + (i % 3) * 0.08);
    // name tag
    const tag = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: textTexture({
        text:
          spec.kind === "robot"
            ? "RBOT-7"
            : spec.kind === "developer"
            ? "Dev"
            : spec.kind === "designer"
            ? "Designer"
            : "Visitor",
        fontSize: 34,
        color: "#0b1526",
      }),
        transparent: true,
        depthWrite: false,
      })
    );
    tag.scale.set(2.6, 0.9, 1);
    tag.position.y = npc.kind === "robot" ? 3.4 : 3.3;
    npc.group.add(tag);
    group.add(npc.group);
    npcs.push(npc);

    // interactive greeting
    registerInteractive(npc.group, { title: greetings[spec.kind].title, body: greetings[spec.kind].body, accent: PALETTE.cyan });
  });

  /* ---------- Drones ---------- */
  for (let i = 0; i < 5; i++) {
    const d = makeDrone();
    const center = new THREE.Vector3(
      (Math.random() - 0.5) * 200,
      8 + Math.random() * 6,
      (Math.random() - 0.5) * 200
    );
    const radius = 14 + Math.random() * 26;
    const speed = 0.3 + Math.random() * 0.3;
    d.position.copy(center);
    group.add(d);
    drones.push({ group: d, center, radius, speed, phase: Math.random() * 10 });
  }

  /* ---------- Flying vehicles (decorative) ---------- */
  const carOrbits: Array<{ cx: number; cz: number; rx: number; rz: number; y: number; speed: number }> = [
    { cx: 0, cz: 0, rx: 190, rz: 190, y: 60, speed: 0.05 },
    { cx: 60, cz: -40, rx: 120, rz: 220, y: 90, speed: -0.04 },
    { cx: -80, cz: 60, rx: 160, rz: 130, y: 75, speed: 0.06 },
  ];
  for (let i = 0; i < carOrbits.length; i++) {
    const o = carOrbits[i];
    const c = makeAirCar();
    c.scale.setScalar(1.3);
    c.position.set(o.cx + o.rx, o.y, o.cz);
    group.add(c);
    cars.push({ group: c, cx: o.cx, cz: o.cz, rx: o.rx, rz: o.rz, speed: o.speed, phase: i * 2, y: o.y });
  }

  /* ---------- Floating particles (wind) ---------- */
  const pCount = 500;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(pCount * 3);
  const pBase = new Float32Array(pCount);
  for (let i = 0; i < pCount; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 40 + Math.random() * 300;
    pPos[i * 3] = Math.cos(a) * r;
    pPos[i * 3 + 1] = 0.5 + Math.random() * 30;
    pPos[i * 3 + 2] = Math.sin(a) * r;
    pBase[i] = Math.random() * 10;
  }
  pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({
    color: 0x9cc8ff,
    size: 0.5,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
    sizeAttenuation: true,
  });
  const particles = new THREE.Points(pGeo, pMat);
  group.add(particles);

  /* ---------- Collectibles (floating crystals) ---------- */
  const collectibles: Collectible[] = [];
  const crystalPos: Array<[number, number, string]> = [
    [0, 20, "Plaza Crystal"],
    [62, -52, "Avenue Crystal"],
    [-62, -88, "NW Crystal"],
    [140, 0, "AI Sector Crystal"],
    [-150, 0, "Innovation Crystal"],
    [0, 150, "Order District Crystal"],
    [250, -6, "East Park Crystal"],
    [-202, -202, "Secret Island Crystal"],
  ];
  crystalPos.forEach(([x, z, label], i) => {
    const mesh = new THREE.Mesh(
      new THREE.OctahedronGeometry(1.0, 0),
      new THREE.MeshStandardMaterial({
        color: PALETTE.gold,
        emissive: PALETTE.gold,
        emissiveIntensity: 1.1,
        metalness: 0.3,
        roughness: 0.2,
      })
    );
    mesh.position.set(x, 2.4, z);
    mesh.castShadow = true;
    const glow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowTexture("rgba(212,175,55,0.9)"),
        transparent: true,
        opacity: 0.45,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    glow.scale.set(4.5, 4.5, 1);
    mesh.add(glow);
    group.add(mesh);
    collectibles.push({ id: i, mesh, position: new THREE.Vector3(x, 2.4, z), collected: false, label });
  });

  const update = (dt: number, t: number, player: THREE.Vector3) => {
    /* particles drift with wind */
    const pos = pGeo.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < pCount; i++) {
      const windSpd = 1.5 + Math.sin(pBase[i] + t) * 0.8;
      let px = pos.getX(i) + dt * windSpd;
      px = px > 360 ? -360 : px;
      pos.setX(i, px);
      const py = pos.getY(i) + Math.sin(t * 0.5 + pBase[i]) * dt * 0.4;
      pos.setY(i, py);
    }
    pos.needsUpdate = true;

    /* drones */
    for (const d of drones) {
      const a = t * d.speed + d.phase;
      d.group.position.set(
        d.center.x + Math.cos(a) * d.radius,
        d.center.y + Math.sin(t * 1.3 + d.phase) * 1.2,
        d.center.z + Math.sin(a) * d.radius
      );
      const prop = (d.group as any).userData.prop as THREE.Group;
      prop.rotation.y += dt * 30;
      d.group.rotation.y = Math.sin(t + d.phase) * 0.4;
    }

    /* cars */
    for (const c of cars) {
      const a = t * c.speed + c.phase;
      const nx = c.cx + Math.cos(a) * c.rx;
      const nz = c.cz + Math.sin(a) * c.rz;
      const prevX = c.cx + Math.cos(a - c.speed * dt) * c.rx;
      const prevZ = c.cz + Math.sin(a - c.speed * dt) * c.rz;
      c.group.position.set(nx, c.y, nz);
      c.group.rotation.y = Math.atan2(nz - prevZ, nx - prevX);
      c.group.rotation.z = Math.sin(a * 2) * 0.06;
    }

    /* NPCs */
    for (const npc of npcs) {
      npc.stateTimer -= dt;
      const distToPlayer = npc.group.position.distanceTo(player);

      if (npc.state === "wave" && npc.stateTimer <= 0) {
        npc.state = "walk";
        npc.stateTimer = 1 + Math.random() * 3;
      }

      if (distToPlayer < 9 && npc.state !== "wave" && npc.stateTimer <= 0) {
        npc.state = "wave";
        npc.stateTimer = 2;
      }

      if (npc.state === "walk") {
        const target = npc.waypoints[npc.wpIndex];
        const to = new THREE.Vector3().subVectors(target, npc.group.position);
        to.y = 0;
        if (to.length() < 0.6) {
          npc.wpIndex = (npc.wpIndex + 1) % npc.waypoints.length;
          npc.stateTimer = 0.5 + Math.random() * 2;
          npc.state = "idle";
        } else {
          to.normalize();
          const sp = npc.speed * (npc.hover ? 0.6 : 1);
          npc.group.position.x += to.x * sp * dt;
          npc.group.position.z += to.z * sp * dt;
          npc.group.rotation.y = Math.atan2(to.x, to.z);
          npc.walkPhase += dt * 6;
        }
      }

      // look at player (head yaw)
      if (npc.head) {
        const dx = player.x - npc.group.position.x;
        const dz = player.z - npc.group.position.z;
        const targetYaw = Math.atan2(dx, dz);
        let headYaw = targetYaw - npc.group.rotation.y;
        // wrap
        while (headYaw > Math.PI) headYaw -= Math.PI * 2;
        while (headYaw < -Math.PI) headYaw += Math.PI * 2;
        npc.head.rotation.y += (headYaw - npc.head.rotation.y) * Math.min(1, dt * 4);
      }

      // limb animation
      if (npc.hover) {
        npc.body.position.y = 1.5 + Math.sin(t * 1.4 + npc.phase) * 0.15;
        npc.group.position.y = Math.sin(t * 1.1 + npc.phase) * 0.1;
      } else {
        const swing = npc.state === "walk" ? Math.sin(npc.walkPhase) * 0.6 : 0;
        npc.group.position.y = npc.state === "walk" ? Math.abs(Math.sin(npc.walkPhase)) * 0.06 : Math.sin(t * 1.2 + npc.phase) * 0.02;
        if (npc.legs.length) {
          npc.legs[0].rotation.x = npc.state === "walk" ? swing : 0;
          npc.legs[1].rotation.x = npc.state === "walk" ? -swing : 0;
        }
        if (npc.arms.length) {
          const waveSwing = Math.sin(t * 8) * 0.4;
          if (npc.state === "wave") {
            npc.arms[1].rotation.x = -1.6 + Math.sin(t * 6) * 0.2;
            npc.arms[0].rotation.x = -0.2;
          } else {
            npc.arms[0].rotation.x = npc.state === "walk" ? -swing * 0.6 : 0;
            npc.arms[1].rotation.x = npc.state === "walk" ? swing * 0.6 : 0;
          }
          void waveSwing;
        }
      }
    }

    /* collectibles spin/bob */
    for (const c of collectibles) {
      if (c.collected) continue;
      c.mesh.rotation.y += dt * 1.6;
      c.mesh.position.y = c.position.y + Math.sin(t * 1.8 + c.id) * 0.3;
    }
  };

  return {
    group,
    update,
    collectibles,
    collectiblePositions: collectibles.map((c) => c.position),
    getCollectedCount: () => collectibles.filter((c) => c.collected).length,
  };
}
