import * as THREE from "three";
import { DISTRICTS, RING_RADIUS, ROAD_RADIUS, type District } from "./districts";

/**
 * Builds the RahatVerse skyline: ground, ring road, nine district landmarks
 * and the ambient filler city. Everything is procedural — no downloads, so
 * the world starts instantly even on a slow connection.
 */

export interface CityBuild {
  group: THREE.Group;
  /** Per-district beacon meshes we animate each frame. */
  update: (t: number, activeIndex: number) => void;
  dispose: () => void;
}

const disposables: Array<{ dispose: () => void }> = [];

function track<T extends THREE.BufferGeometry | THREE.Material>(x: T): T {
  disposables.push(x as unknown as { dispose: () => void });
  return x;
}

function glowSprite(color: string, size: number, opacity = 0.6): THREE.Sprite {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(64, 64, 2, 64, 64, 64);
  grad.addColorStop(0, color);
  grad.addColorStop(0.4, color.replace(/[\d.]+\)$/, "0.35)"));
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(
    track(
      new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        opacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    )
  );
  sprite.scale.set(size, size, 1);
  return sprite;
}

/** Canvas label rendered as a floating holographic sign. */
function labelSprite(text: string, emoji: string, accent: string): THREE.Sprite {
  const w = 512;
  const h = 128;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d")!;

  g.fillStyle = "rgba(4,8,20,0.82)";
  const r = 26;
  g.beginPath();
  g.moveTo(r, 0);
  g.arcTo(w, 0, w, h, r);
  g.arcTo(w, h, 0, h, r);
  g.arcTo(0, h, 0, 0, r);
  g.arcTo(0, 0, w, 0, r);
  g.closePath();
  g.fill();

  g.strokeStyle = accent;
  g.lineWidth = 3;
  g.stroke();

  g.font = "52px system-ui, sans-serif";
  g.textBaseline = "middle";
  g.fillText(emoji, 26, h / 2 + 2);

  g.fillStyle = "#ffffff";
  g.font = "bold 34px Inter, system-ui, sans-serif";
  g.textBaseline = "middle";
  const maxW = w - 120;
  let label = text;
  while (g.measureText(label).width > maxW && label.length > 4) {
    label = label.slice(0, -2);
  }
  g.fillText(label, 96, h / 2 + 2);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(
    track(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }))
  );
  sprite.scale.set(46, 11.5, 1);
  return sprite;
}

function glassMaterial(accent: number, emissive = 0.24) {
  return track(
    new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      emissive: new THREE.Color(accent),
      emissiveIntensity: emissive,
      metalness: 0.85,
      roughness: 0.18,
    })
  );
}

function buildLandmark(d: District): { group: THREE.Group; beacon: THREE.Object3D; ring: THREE.Mesh } {
  const g = new THREE.Group();
  g.position.set(d.x, 0, d.z);
  g.lookAt(0, 0, 0);

  const accent = d.accent;
  const mat = glassMaterial(accent);
  const frameMat = track(
    new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      emissive: new THREE.Color(accent),
      emissiveIntensity: 0.35,
      metalness: 0.6,
      roughness: 0.35,
    })
  );

  // Plinth — every landmark stands on a lit platform
  const plinth = new THREE.Mesh(
    track(new THREE.CylinderGeometry(d.width * 0.92, d.width * 1.02, 2.4, 8)),
    track(new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.5, roughness: 0.6 }))
  );
  plinth.position.y = 1.2;
  plinth.receiveShadow = true;
  g.add(plinth);

  const rim = new THREE.Mesh(
    track(new THREE.TorusGeometry(d.width * 0.95, 0.5, 8, 48)),
    track(new THREE.MeshBasicMaterial({ color: accent }))
  );
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 2.5;
  g.add(rim);

  const body = new THREE.Group();
  body.position.y = 2.4;

  switch (d.shape) {
    case "tower": {
      const core = new THREE.Mesh(
        track(new THREE.BoxGeometry(d.width * 0.8, d.height, d.width * 0.8)),
        mat
      );
      core.position.y = d.height / 2;
      core.castShadow = true;
      body.add(core);
      // stacked bands
      for (let i = 1; i <= 5; i++) {
        const band = new THREE.Mesh(
          track(new THREE.BoxGeometry(d.width * 0.86, 1.2, d.width * 0.86)),
          frameMat
        );
        band.position.y = (d.height / 6) * i;
        body.add(band);
      }
      const spire = new THREE.Mesh(
        track(new THREE.ConeGeometry(2.4, 22, 6)),
        frameMat
      );
      spire.position.y = d.height + 11;
      body.add(spire);
      break;
    }
    case "dome": {
      const base = new THREE.Mesh(
        track(new THREE.CylinderGeometry(d.width * 0.75, d.width * 0.8, d.height * 0.5, 24)),
        mat
      );
      base.position.y = d.height * 0.25;
      base.castShadow = true;
      body.add(base);
      const dome = new THREE.Mesh(
        track(new THREE.SphereGeometry(d.width * 0.75, 24, 14, 0, Math.PI * 2, 0, Math.PI / 2)),
        track(
          new THREE.MeshStandardMaterial({
            color: 0xf8fafc,
            emissive: new THREE.Color(accent),
            emissiveIntensity: 0.3,
            metalness: 0.4,
            roughness: 0.25,
          })
        )
      );
      dome.position.y = d.height * 0.5;
      body.add(dome);
      // colonnade
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2;
        const col = new THREE.Mesh(
          track(new THREE.CylinderGeometry(1.3, 1.3, d.height * 0.5, 8)),
          frameMat
        );
        col.position.set(Math.cos(a) * d.width * 0.85, d.height * 0.25, Math.sin(a) * d.width * 0.85);
        body.add(col);
      }
      break;
    }
    case "hall": {
      const main = new THREE.Mesh(
        track(new THREE.BoxGeometry(d.width * 1.5, d.height, d.width * 0.9)),
        mat
      );
      main.position.y = d.height / 2;
      main.castShadow = true;
      body.add(main);
      const roof = new THREE.Mesh(
        track(new THREE.BoxGeometry(d.width * 1.62, 2.4, d.width * 1.02)),
        frameMat
      );
      roof.position.y = d.height + 1.2;
      body.add(roof);
      // shop-window arcade facing the road
      for (let i = -2; i <= 2; i++) {
        const win = new THREE.Mesh(
          track(new THREE.BoxGeometry(d.width * 0.22, d.height * 0.45, 1)),
          track(new THREE.MeshBasicMaterial({ color: accent }))
        );
        win.position.set(i * d.width * 0.28, d.height * 0.32, d.width * 0.46);
        body.add(win);
      }
      break;
    }
    case "lab": {
      const tube = new THREE.Mesh(
        track(new THREE.CylinderGeometry(d.width * 0.5, d.width * 0.55, d.height, 20)),
        mat
      );
      tube.position.y = d.height / 2;
      tube.castShadow = true;
      body.add(tube);
      const cap = new THREE.Mesh(
        track(new THREE.SphereGeometry(d.width * 0.5, 20, 12)),
        track(new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: new THREE.Color(accent), emissiveIntensity: 0.9, transparent: true, opacity: 0.55 }))
      );
      cap.position.y = d.height;
      body.add(cap);
      for (let i = 0; i < 3; i++) {
        const ringM = new THREE.Mesh(
          track(new THREE.TorusGeometry(d.width * 0.72, 0.4, 8, 32)),
          track(new THREE.MeshBasicMaterial({ color: accent }))
        );
        ringM.rotation.x = Math.PI / 2;
        ringM.position.y = d.height * (0.3 + i * 0.24);
        body.add(ringM);
      }
      break;
    }
    case "cross": {
      const a = new THREE.Mesh(
        track(new THREE.BoxGeometry(d.width * 1.3, d.height * 0.55, d.width * 0.5)),
        mat
      );
      a.position.y = d.height * 0.4;
      a.castShadow = true;
      body.add(a);
      const b = new THREE.Mesh(
        track(new THREE.BoxGeometry(d.width * 0.5, d.height, d.width * 0.5)),
        mat
      );
      b.position.y = d.height / 2;
      b.castShadow = true;
      body.add(b);
      const emblem = new THREE.Mesh(
        track(new THREE.BoxGeometry(d.width * 0.55, 3, 1)),
        track(new THREE.MeshBasicMaterial({ color: accent }))
      );
      emblem.position.set(0, d.height * 0.72, d.width * 0.27);
      body.add(emblem);
      const emblem2 = emblem.clone();
      emblem2.rotation.z = Math.PI / 2;
      body.add(emblem2);
      break;
    }
    case "gallery": {
      for (let i = 0; i < 3; i++) {
        const wing = new THREE.Mesh(
          track(new THREE.BoxGeometry(d.width * 0.5, d.height * (0.6 + i * 0.2), d.width * 0.5)),
          mat
        );
        wing.position.set((i - 1) * d.width * 0.6, (d.height * (0.6 + i * 0.2)) / 2, 0);
        wing.castShadow = true;
        body.add(wing);
      }
      const canopy = new THREE.Mesh(
        track(new THREE.BoxGeometry(d.width * 1.9, 1.6, d.width * 0.7)),
        frameMat
      );
      canopy.position.y = d.height * 0.42;
      body.add(canopy);
      break;
    }
    case "beacon": {
      const mast = new THREE.Mesh(
        track(new THREE.CylinderGeometry(1.8, 3.4, d.height, 10)),
        frameMat
      );
      mast.position.y = d.height / 2;
      mast.castShadow = true;
      body.add(mast);
      const dish = new THREE.Mesh(
        track(new THREE.SphereGeometry(d.width * 0.42, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2.4)),
        track(new THREE.MeshStandardMaterial({ color: 0xf1f5f9, emissive: new THREE.Color(accent), emissiveIntensity: 0.5, metalness: 0.7, roughness: 0.3, side: THREE.DoubleSide }))
      );
      dish.position.y = d.height * 0.82;
      dish.rotation.x = -0.6;
      body.add(dish);
      for (let i = 0; i < 3; i++) {
        const halo = new THREE.Mesh(
          track(new THREE.TorusGeometry(d.width * 0.5 + i * 4, 0.28, 6, 36)),
          track(new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.5 - i * 0.12 }))
        );
        halo.rotation.x = Math.PI / 2;
        halo.position.y = d.height * 0.9;
        body.add(halo);
      }
      break;
    }
    case "pod": {
      const shell = new THREE.Mesh(
        track(new THREE.SphereGeometry(d.width * 0.62, 26, 18)),
        track(new THREE.MeshStandardMaterial({ color: 0x111827, emissive: new THREE.Color(accent), emissiveIntensity: 0.35, metalness: 0.8, roughness: 0.2 }))
      );
      shell.position.y = d.height * 0.6;
      shell.castShadow = true;
      body.add(shell);
      const legs = 4;
      for (let i = 0; i < legs; i++) {
        const a = (i / legs) * Math.PI * 2 + Math.PI / 4;
        const leg = new THREE.Mesh(
          track(new THREE.CylinderGeometry(1.1, 1.6, d.height * 0.6, 8)),
          frameMat
        );
        leg.position.set(Math.cos(a) * d.width * 0.45, d.height * 0.3, Math.sin(a) * d.width * 0.45);
        leg.rotation.z = Math.cos(a) * 0.14;
        leg.rotation.x = -Math.sin(a) * 0.14;
        body.add(leg);
      }
      const orbit = new THREE.Mesh(
        track(new THREE.TorusGeometry(d.width * 0.85, 0.35, 8, 44)),
        track(new THREE.MeshBasicMaterial({ color: accent }))
      );
      orbit.rotation.x = Math.PI / 2.4;
      orbit.position.y = d.height * 0.6;
      body.add(orbit);
      break;
    }
  }

  g.add(body);

  // Floating holographic sign
  const sign = labelSprite(d.name.en, d.emoji, d.accentCss);
  sign.position.y = d.height + 24;
  g.add(sign);

  // Beacon light column
  const beam = new THREE.Mesh(
    track(new THREE.CylinderGeometry(1.6, 4.5, 260, 12, 1, true)),
    track(
      new THREE.MeshBasicMaterial({
        color: accent,
        transparent: true,
        opacity: 0.09,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    )
  );
  beam.position.y = 130;
  g.add(beam);

  const halo = glowSprite(
    `rgba(${(accent >> 16) & 255},${(accent >> 8) & 255},${accent & 255},0.85)`,
    46,
    0.5
  );
  halo.position.y = d.height + 6;
  g.add(halo);

  // Selection ring on the ground (pulses when the pod is here)
  const selRing = new THREE.Mesh(
    track(new THREE.RingGeometry(d.width * 1.15, d.width * 1.35, 48)),
    track(new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.25, side: THREE.DoubleSide }))
  );
  selRing.rotation.x = -Math.PI / 2;
  selRing.position.y = 0.35;
  g.add(selRing);

  return { group: g, beacon: halo, ring: selRing };
}

export function buildCity(): CityBuild {
  const group = new THREE.Group();

  /* ── Ground ───────────────────────────────────────────────────────────── */
  const ground = new THREE.Mesh(
    track(new THREE.CircleGeometry(430, 96)),
    track(new THREE.MeshStandardMaterial({ color: 0x0a1020, roughness: 0.95, metalness: 0.05 }))
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  group.add(ground);

  // Faint tech grid
  const grid = new THREE.GridHelper(860, 86, 0x1e3a5f, 0x13233d);
  (grid.material as THREE.Material).transparent = true;
  (grid.material as THREE.Material).opacity = 0.32;
  grid.position.y = 0.05;
  group.add(grid);

  /* ── Ring road the pod drives on ──────────────────────────────────────── */
  const road = new THREE.Mesh(
    track(new THREE.RingGeometry(ROAD_RADIUS - 7, ROAD_RADIUS + 7, 128)),
    track(new THREE.MeshStandardMaterial({ color: 0x1b2740, roughness: 0.8, metalness: 0.15 }))
  );
  road.rotation.x = -Math.PI / 2;
  road.position.y = 0.12;
  road.receiveShadow = true;
  group.add(road);

  for (const r of [ROAD_RADIUS - 6.4, ROAD_RADIUS + 6.4]) {
    const edge = new THREE.Mesh(
      track(new THREE.RingGeometry(r - 0.35, r + 0.35, 128)),
      track(new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.55 }))
    );
    edge.rotation.x = -Math.PI / 2;
    edge.position.y = 0.2;
    group.add(edge);
  }

  // Dashed centre line
  const dashCount = 120;
  const dashGeo = track(new THREE.PlaneGeometry(3.4, 0.5));
  const dashMat = track(new THREE.MeshBasicMaterial({ color: 0x93c5fd, transparent: true, opacity: 0.35 }));
  const dashes = new THREE.InstancedMesh(dashGeo, dashMat, dashCount);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const s = new THREE.Vector3(1, 1, 1);
  for (let i = 0; i < dashCount; i++) {
    const a = (i / dashCount) * Math.PI * 2;
    const p = new THREE.Vector3(Math.cos(a) * ROAD_RADIUS, 0.22, Math.sin(a) * ROAD_RADIUS);
    q.setFromEuler(new THREE.Euler(-Math.PI / 2, 0, -a + Math.PI / 2));
    m.compose(p, q, s);
    dashes.setMatrixAt(i, m);
  }
  group.add(dashes);

  // Spokes from the plaza out to each district
  for (const d of DISTRICTS) {
    const a = Math.atan2(d.z, d.x);
    const len = RING_RADIUS;
    const spoke = new THREE.Mesh(
      track(new THREE.PlaneGeometry(len, 9)),
      track(new THREE.MeshStandardMaterial({ color: 0x162238, roughness: 0.85 }))
    );
    spoke.rotation.x = -Math.PI / 2;
    spoke.rotation.z = -a;
    spoke.position.set((Math.cos(a) * len) / 2, 0.1, (Math.sin(a) * len) / 2);
    group.add(spoke);
  }

  /* ── Central plaza ────────────────────────────────────────────────────── */
  const plaza = new THREE.Mesh(
    track(new THREE.CylinderGeometry(38, 40, 1.6, 48)),
    track(new THREE.MeshStandardMaterial({ color: 0x14203a, metalness: 0.4, roughness: 0.5 }))
  );
  plaza.position.y = 0.8;
  plaza.receiveShadow = true;
  group.add(plaza);

  const plazaRing = new THREE.Mesh(
    track(new THREE.TorusGeometry(38, 0.7, 8, 64)),
    track(new THREE.MeshBasicMaterial({ color: 0xf43f5e }))
  );
  plazaRing.rotation.x = Math.PI / 2;
  plazaRing.position.y = 1.7;
  group.add(plazaRing);

  // Monument at the centre — the "RA" core
  const monument = new THREE.Group();
  const coreCrystal = new THREE.Mesh(
    track(new THREE.OctahedronGeometry(11, 0)),
    track(
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xf43f5e,
        emissiveIntensity: 1.3,
        metalness: 0.5,
        roughness: 0.15,
        transparent: true,
        opacity: 0.92,
      })
    )
  );
  coreCrystal.position.y = 34;
  monument.add(coreCrystal);
  const pylon = new THREE.Mesh(
    track(new THREE.CylinderGeometry(3.2, 6.5, 26, 8)),
    track(new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.75, roughness: 0.3 }))
  );
  pylon.position.y = 14;
  monument.add(pylon);
  for (let i = 0; i < 3; i++) {
    const orb = new THREE.Mesh(
      track(new THREE.TorusGeometry(15 + i * 3, 0.35, 8, 48)),
      track(new THREE.MeshBasicMaterial({ color: [0xf43f5e, 0x22d3ee, 0xa78bfa][i], transparent: true, opacity: 0.6 }))
    );
    orb.position.y = 34;
    orb.rotation.x = Math.PI / 2 + i * 0.5;
    orb.rotation.z = i * 0.7;
    monument.add(orb);
  }
  monument.add((() => {
    const gl = glowSprite("rgba(244,63,94,0.9)", 90, 0.45);
    gl.position.y = 34;
    return gl;
  })());
  group.add(monument);

  /* ── District landmarks ───────────────────────────────────────────────── */
  const beacons: Array<{ beacon: THREE.Object3D; ring: THREE.Mesh; base: number }> = [];
  DISTRICTS.forEach((d) => {
    const { group: lg, beacon, ring } = buildLandmark(d);
    group.add(lg);
    beacons.push({ beacon, ring, base: (ring.material as THREE.MeshBasicMaterial).opacity });
  });

  /* ── Ambient skyline (filler city outside the ring) ───────────────────── */
  const fillerGeo = track(new THREE.BoxGeometry(1, 1, 1));
  const fillerMat = track(
    new THREE.MeshStandardMaterial({ color: 0x101a2e, metalness: 0.7, roughness: 0.4 })
  );
  const fillerCount = 190;
  const filler = new THREE.InstancedMesh(fillerGeo, fillerMat, fillerCount);
  const windowMat = track(
    new THREE.MeshBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.55 })
  );
  const windowGeo = track(new THREE.BoxGeometry(1, 1, 1));
  const windows = new THREE.InstancedMesh(windowGeo, windowMat, fillerCount);

  for (let i = 0; i < fillerCount; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = RING_RADIUS + 55 + Math.random() * 210;
    const h = 18 + Math.random() * 96;
    const w = 8 + Math.random() * 16;
    const p = new THREE.Vector3(Math.cos(a) * r, h / 2, Math.sin(a) * r);
    q.setFromEuler(new THREE.Euler(0, Math.random() * Math.PI, 0));
    m.compose(p, q, new THREE.Vector3(w, h, w));
    filler.setMatrixAt(i, m);

    m.compose(
      new THREE.Vector3(p.x, h * 0.62, p.z),
      q,
      new THREE.Vector3(w * 1.01, h * 0.06, w * 1.01)
    );
    windows.setMatrixAt(i, m);
  }
  group.add(filler);
  group.add(windows);

  /* ── Floating traffic (ambient life) ──────────────────────────────────── */
  const trafficGeo = track(new THREE.BoxGeometry(3.4, 0.9, 1.6));
  const trafficMat = track(new THREE.MeshBasicMaterial({ color: 0x7dd3fc }));
  const trafficCount = 34;
  const traffic = new THREE.InstancedMesh(trafficGeo, trafficMat, trafficCount);
  const trafficData = Array.from({ length: trafficCount }, () => ({
    r: RING_RADIUS + 40 + Math.random() * 190,
    y: 60 + Math.random() * 90,
    a: Math.random() * Math.PI * 2,
    speed: (0.05 + Math.random() * 0.12) * (Math.random() > 0.5 ? 1 : -1),
  }));
  group.add(traffic);

  /* ── Stars / particles above ──────────────────────────────────────────── */
  const starCount = 900;
  const starPos = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 400 + Math.random() * 900;
    starPos[i * 3] = Math.cos(a) * r;
    starPos[i * 3 + 1] = 60 + Math.random() * 600;
    starPos[i * 3 + 2] = Math.sin(a) * r;
  }
  const starGeo = track(new THREE.BufferGeometry());
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
  const stars = new THREE.Points(
    starGeo,
    track(new THREE.PointsMaterial({ color: 0xbfdbfe, size: 2.4, transparent: true, opacity: 0.7, sizeAttenuation: true }))
  );
  group.add(stars);

  /* ── Update ───────────────────────────────────────────────────────────── */
  const update = (t: number, activeIndex: number) => {
    coreCrystal.rotation.y = t * 0.35;
    coreCrystal.rotation.x = Math.sin(t * 0.4) * 0.15;
    coreCrystal.position.y = 34 + Math.sin(t * 0.9) * 1.6;
    monument.children.forEach((c, i) => {
      if (c instanceof THREE.Mesh && c.geometry instanceof THREE.TorusGeometry) {
        c.rotation.z += 0.002 * (i + 1);
      }
    });

    beacons.forEach((b, i) => {
      const active = i === activeIndex;
      const pulse = 0.5 + Math.sin(t * 2 + i) * 0.16;
      (b.beacon as THREE.Sprite).material.opacity = active ? 0.85 : pulse * 0.55;
      const mat = b.ring.material as THREE.MeshBasicMaterial;
      mat.opacity = active ? 0.3 + Math.sin(t * 3.2) * 0.22 : 0.16;
      b.ring.scale.setScalar(active ? 1 + Math.sin(t * 2.4) * 0.05 : 1);
    });

    for (let i = 0; i < trafficCount; i++) {
      const d = trafficData[i];
      d.a += d.speed * 0.004;
      const p = new THREE.Vector3(Math.cos(d.a) * d.r, d.y, Math.sin(d.a) * d.r);
      q.setFromEuler(new THREE.Euler(0, -d.a + (d.speed > 0 ? Math.PI / 2 : -Math.PI / 2), 0));
      m.compose(p, q, s);
      traffic.setMatrixAt(i, m);
    }
    traffic.instanceMatrix.needsUpdate = true;
  };

  const dispose = () => {
    for (const d of disposables) {
      try {
        d.dispose();
      } catch {
        /* ignore */
      }
    }
    disposables.length = 0;
  };

  return { group, update, dispose };
}

/** The self-driving pod the visitor rides. */
export function buildVehicle(): { group: THREE.Group; update: (t: number, speed: number) => void } {
  const g = new THREE.Group();

  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    metalness: 0.85,
    roughness: 0.16,
  });
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x0ea5e9,
    emissive: 0x22d3ee,
    emissiveIntensity: 0.5,
    metalness: 0.9,
    roughness: 0.08,
    transparent: true,
    opacity: 0.72,
  });

  const chassis = new THREE.Mesh(new THREE.CapsuleGeometry(2.1, 5.4, 8, 20), bodyMat);
  chassis.rotation.z = Math.PI / 2;
  chassis.position.y = 2.6;
  chassis.castShadow = true;
  g.add(chassis);

  const canopy = new THREE.Mesh(
    new THREE.SphereGeometry(2.05, 22, 14, 0, Math.PI * 2, 0, Math.PI / 1.9),
    glassMat
  );
  canopy.position.set(0.4, 3.5, 0);
  canopy.scale.set(1.5, 0.85, 1);
  g.add(canopy);

  const fin = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.8, 0.35), bodyMat);
  fin.position.set(-3.4, 4, 0);
  g.add(fin);

  // Hover thrusters
  const thrusters: THREE.Mesh[] = [];
  const thrusterGlow: THREE.Sprite[] = [];
  for (const [x, z] of [
    [2.6, 1.8],
    [2.6, -1.8],
    [-2.6, 1.8],
    [-2.6, -1.8],
  ]) {
    const t = new THREE.Mesh(
      new THREE.CylinderGeometry(0.85, 1.15, 1.1, 14),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.3 })
    );
    t.position.set(x, 1.5, z);
    g.add(t);
    thrusters.push(t);

    const gl = glowSprite("rgba(34,211,238,0.95)", 5.5, 0.85);
    gl.position.set(x, 0.7, z);
    g.add(gl);
    thrusterGlow.push(gl);
  }

  // Headlights
  const beamL = new THREE.Mesh(
    new THREE.ConeGeometry(2.6, 16, 14, 1, true),
    new THREE.MeshBasicMaterial({
      color: 0xbae6fd,
      transparent: true,
      opacity: 0.14,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );
  beamL.rotation.z = -Math.PI / 2;
  beamL.position.set(11, 2.4, 0);
  g.add(beamL);

  const trail = glowSprite("rgba(244,63,94,0.9)", 12, 0.5);
  trail.position.set(-4.6, 2.4, 0);
  g.add(trail);

  const update = (t: number, speed: number) => {
    const hover = Math.sin(t * 2.2) * 0.22;
    g.children.forEach((c) => {
      if (c === chassis || c === canopy || c === fin) c.position.y += 0;
    });
    chassis.position.y = 2.6 + hover;
    canopy.position.y = 3.5 + hover;
    fin.position.y = 4 + hover;
    thrusters.forEach((th, i) => {
      th.position.y = 1.5 + hover;
      th.rotation.y = t * 2 + i;
    });
    const intensity = 0.55 + speed * 0.5 + Math.sin(t * 9) * 0.08;
    thrusterGlow.forEach((gl) => {
      gl.position.y = 0.7 + hover;
      gl.material.opacity = Math.min(1, intensity);
      gl.scale.setScalar(4.5 + speed * 3);
    });
    trail.material.opacity = 0.25 + speed * 0.5;
    trail.scale.setScalar(9 + speed * 10);
    beamL.material.opacity = 0.1 + speed * 0.12;
  };

  return { group: g, update };
}

/** The futuristic entry gate the tour starts from. */
export function buildGate(): THREE.Group {
  const g = new THREE.Group();
  const gateZ = ROAD_RADIUS;
  g.position.set(0, 0, gateZ);

  const pillarMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    emissive: 0xf43f5e,
    emissiveIntensity: 0.28,
    metalness: 0.85,
    roughness: 0.22,
  });

  for (const x of [-17, 17]) {
    const pillar = new THREE.Mesh(new THREE.BoxGeometry(5, 52, 5), pillarMat);
    pillar.position.set(x, 26, 0);
    pillar.castShadow = true;
    g.add(pillar);

    for (let i = 1; i <= 4; i++) {
      const band = new THREE.Mesh(
        new THREE.BoxGeometry(6.2, 0.9, 6.2),
        new THREE.MeshBasicMaterial({ color: 0xf43f5e })
      );
      band.position.set(x, i * 11, 0);
      g.add(band);
    }
  }

  const arch = new THREE.Mesh(
    new THREE.TorusGeometry(17, 2.2, 12, 40, Math.PI),
    pillarMat
  );
  arch.position.y = 52;
  g.add(arch);

  const portal = new THREE.Mesh(
    new THREE.CircleGeometry(15, 48),
    new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  portal.position.y = 30;
  g.add(portal);

  return g;
}
