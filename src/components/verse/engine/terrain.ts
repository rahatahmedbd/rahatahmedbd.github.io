import * as THREE from "three";
import {
  WORLD,
  PLAZA,
  PALETTE,
  RING_ROADS,
  RESERVED,
  RESERVED_PLOT_HALF,
} from "./world-config";

/**
 * Builds the static world: the floating city platform, roads, plaza, parks,
 * water features and bridges. Buildings are intentionally absent — only the
 * foundation, roads and reserved (empty) plots exist.
 */

export interface Terrain {
  group: THREE.Group;
  /** Park lawns & their trees, so foliage can sway. */
  trees: THREE.Object3D[];
}

const RADIAL_COUNT = 8;
/** Directions for the 8 radial avenues (unit vectors in XZ). */
const RADIAL_DIRS: Array<[number, number]> = [];
for (let i = 0; i < RADIAL_COUNT; i++) {
  const ang = (Math.PI / 4) * i;
  RADIAL_DIRS.push([Math.cos(ang), -Math.sin(ang)]);
}

/** Human-readable labels for each radial direction (compass). */
const RADIAL_LABELS = ["E", "NE", "N", "NW", "W", "SW", "S", "SE"];

function disc(r: number, seg = 72): THREE.Mesh {
  const geo = new THREE.CircleGeometry(r, seg);
  const m = new THREE.MeshStandardMaterial({ color: PALETTE.ground, roughness: 0.9, metalness: 0.08 });
  const mesh = new THREE.Mesh(geo, m);
  mesh.rotation.x = -Math.PI / 2;
  mesh.receiveShadow = true;
  return mesh;
}

/** Vertical helper to place a flat plane at y. */
function flatPlane(w: number, d: number, mat: THREE.Material): THREE.Mesh {
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.receiveShadow = true;
  return mesh;
}

function laneStrip(x: number, z: number, len: number, angle: number): THREE.Mesh {
  const m = flatPlane(0.35, len, new THREE.MeshStandardMaterial({
    color: PALETTE.roadLine, roughness: 0.7, metalness: 0.1,
  }));
  m.position.set(x, 0.06, z);
  m.rotation.z = angle;
  return m;
}

/** A stylised low-poly tree (billboarding handled by foliage sway). */
function makeTree(x: number, z: number, s = 1, seed = 1): THREE.Group {
  const g = new THREE.Group();
  const rnd = (a: number, b: number) => a + ((seed * 7919) % 100) / 100 * (b - a);
  const h = (1.4 + rnd(0, 0.6)) * s;
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18 * s, 0.28 * s, h, 6),
    new THREE.MeshStandardMaterial({ color: 0x9c7a55, roughness: 1 })
  );
  trunk.position.y = h / 2;
  trunk.castShadow = true;
  g.add(trunk);
  const fol = new THREE.Mesh(
    new THREE.IcosahedronGeometry((0.9 + rnd(0, 0.35)) * s, 0),
    new THREE.MeshStandardMaterial({ color: 0x8cc479, roughness: 0.95 })
  );
  fol.position.y = h + (0.6 * s);
  fol.scale.y = 0.85;
  fol.castShadow = true;
  g.add(fol);
  const fol2 = new THREE.Mesh(
    new THREE.IcosahedronGeometry((0.6 + rnd(0, 0.25)) * s, 0),
    new THREE.MeshStandardMaterial({ color: 0xa4d48f, roughness: 0.95 })
  );
  fol2.position.y = h + (1.05 * s);
  fol2.scale.y = 0.8;
  g.add(fol2);
  g.position.set(x, 0, z);
  g.rotation.y = seed;
  return g;
}

function park(name: string, cx: number, cz: number, radius: number, accent: number): THREE.Group {
  const g = new THREE.Group();
  // lawn
  const lawn = new THREE.Mesh(
    new THREE.CircleGeometry(radius, 48),
    new THREE.MeshStandardMaterial({ color: PALETTE.grass, roughness: 1 })
  );
  lawn.rotation.x = -Math.PI / 2;
  lawn.position.set(cx, 0.02, cz);
  lawn.receiveShadow = true;
  g.add(lawn);
  // path through
  const path = flatPlane(2.4, radius * 2, new THREE.MeshStandardMaterial({ color: PALETTE.path, roughness: 1 }));
  path.position.set(cx, 0.04, cz);
  g.add(path);
  // a ring of trees
  const count = 12;
  for (let i = 0; i < count; i++) {
    const a = (Math.PI * 2 * i) / count + (i % 2) * 0.3;
    const rr = radius * (0.45 + ((i % 3) / 3) * 0.45);
    const t = makeTree(cx + Math.cos(a) * rr, cz + Math.sin(a) * rr, 0.8 + (i % 3) * 0.25, i + 3);
    g.add(t);
  }
  // centre feature: a small sculpture / fountain
  const pedestal = new THREE.Mesh(
    new THREE.CylinderGeometry(0.7, 0.9, 1.1, 10),
    new THREE.MeshStandardMaterial({ color: PALETTE.metal, roughness: 0.4, metalness: 0.6 })
  );
  pedestal.position.set(cx, 0.55, cz);
  g.add(pedestal);
  const gem = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.7, 0),
    new THREE.MeshStandardMaterial({ color: accent, emissive: accent, emissiveIntensity: 0.8 })
  );
  gem.position.set(cx, 1.7, cz);
  g.add(gem);
  // name plate
  return g;
}

/** A pond with a tiny decorative bridge over it. */
function makePond(cx: number, cz: number): THREE.Group {
  const g = new THREE.Group();
  const water = new THREE.Mesh(
    new THREE.CircleGeometry(11, 32),
    new THREE.MeshStandardMaterial({ color: PALETTE.water, roughness: 0.25, metalness: 0.1, transparent: true, opacity: 0.92 })
  );
  water.rotation.x = -Math.PI / 2;
  water.position.set(cx, 0.03, cz);
  g.add(water);
  // shore ring
  const shore = new THREE.Mesh(
    new THREE.RingGeometry(10.6, 11.8, 32),
    new THREE.MeshStandardMaterial({ color: 0xb8bfcb, roughness: 1 })
  );
  shore.rotation.x = -Math.PI / 2;
  shore.position.set(cx, 0.02, cz);
  g.add(shore);
  // bridge deck across it
  const deck = flatPlane(3.2, 22, new THREE.MeshStandardMaterial({ color: 0xd6dce6, roughness: 0.8 }));
  deck.position.set(cx, 0.7, cz);
  g.add(deck);
  const railMat = new THREE.MeshStandardMaterial({ color: PALETTE.metalDark, roughness: 0.5, metalness: 0.5 });
  for (const side of [-1, 1]) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.9, 0.18), railMat);
    rail.position.set(cx + side * 1.5, 1.05, cz);
    g.add(rail);
  }
  return g;
}

export function buildTerrain(): Terrain {
  const group = new THREE.Group();
  const trees: THREE.Object3D[] = [];
  const groundR = WORLD.groundRadius;

  /* ---- Floating platform ---- */
  const top = disc(groundR, 128);
  group.add(top);

  const side = new THREE.Mesh(
    new THREE.CylinderGeometry(groundR, groundR - 2, -WORLD.voidY, 128, 1, true),
    new THREE.MeshStandardMaterial({ color: 0x8a93a3, roughness: 0.9, side: THREE.DoubleSide })
  );
  side.position.y = WORLD.voidY / 2;
  group.add(side);

  const bottom = new THREE.Mesh(
    new THREE.CircleGeometry(groundR, 64),
    new THREE.MeshStandardMaterial({ color: 0x39404d, roughness: 1 })
  );
  bottom.rotation.x = Math.PI / 2;
  bottom.position.y = WORLD.voidY;
  group.add(bottom);

  // glowing rim
  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(groundR, 1.4, 10, 160),
    new THREE.MeshStandardMaterial({ color: PALETTE.cyan, emissive: PALETTE.cyan, emissiveIntensity: 1.4 })
  );
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.06;
  group.add(rim);

  /* ---- Digital grid (concentric + radial lines) ---- */
  {
    const pts: number[] = [];
    for (let r = 24; r <= groundR; r += 30) {
      const seg = Math.max(24, Math.round((Math.PI * 2 * r) / 6));
      for (let i = 0; i < seg; i++) {
        const a = (Math.PI * 2 * i) / seg;
        const a2 = (Math.PI * 2 * (i + 1)) / seg;
        pts.push(Math.cos(a) * r, 0.01, Math.sin(a) * r);
        pts.push(Math.cos(a2) * r, 0.01, Math.sin(a2) * r);
      }
    }
    for (let s = 0; s < 48; s++) {
      const a = (Math.PI * 2 * s) / 48;
      pts.push(0, 0.01, 0);
      pts.push(Math.cos(a) * groundR, 0.01, Math.sin(a) * groundR);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: PALETTE.grid,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    });
    const grid = new THREE.LineSegments(geo, lineMat);
    group.add(grid);
  }

  /* ---- Roads: 8 radial avenues ---- */
  const roadMat = new THREE.MeshStandardMaterial({ color: PALETTE.road, roughness: 0.92 });
  const avenueLen = groundR - PLAZA.radius - 14; // from plaza edge to just short of rim
  for (let i = 0; i < RADIAL_COUNT; i++) {
    const [dx, dz] = RADIAL_DIRS[i];
    const mid = PLAZA.radius + 6 + avenueLen / 2;
    const mx = dx * mid;
    const mz = dz * mid;
    const road = flatPlane(9, avenueLen, roadMat);
    road.position.set(mx, 0.02, mz);
    road.rotation.y = -Math.atan2(dz, dx); // orient along direction
    group.add(road);
    // edge lane lines
    const ang = Math.atan2(-dz, dx); // screen angle for rotation.z after flatten
    const L = avenueLen;
    const cxp = dx * (PLAZA.radius + 6 + L / 2);
    const czp = dz * (PLAZA.radius + 6 + L / 2);
    // lines perpendicular offset
    const px = -dz, pz = dx;
    for (const s of [-3.3, 3.3]) {
      const line = laneStrip(cxp + px * s, czp + pz * s, L, ang);
      group.add(line);
    }
  }

  /* ---- Ring roads ---- */
  for (const r of RING_ROADS) {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(r - 4.5, r + 4.5, 96),
      new THREE.MeshStandardMaterial({ color: PALETTE.road, roughness: 0.92 })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.02;
    ring.receiveShadow = true;
    group.add(ring);
    // edges
    for (const er of [r - 4.7, r + 4.7]) {
      const edge = new THREE.Mesh(
        new THREE.TorusGeometry(er, 0.16, 6, 96),
        new THREE.MeshStandardMaterial({ color: PALETTE.roadLine, roughness: 0.7 })
      );
      edge.rotation.x = Math.PI / 2;
      edge.position.y = 0.05;
      group.add(edge);
    }
  }

  /* ---- Central Plaza ---- */
  {
    const plaza = new THREE.Mesh(
      new THREE.CircleGeometry(PLAZA.radius, 96),
      new THREE.MeshStandardMaterial({ color: PALETTE.plaza, roughness: 0.75, metalness: 0.12 })
    );
    plaza.rotation.x = -Math.PI / 2;
    plaza.position.y = 0.03;
    plaza.receiveShadow = true;
    group.add(plaza);
    // accent inlay ring
    const inlay = new THREE.Mesh(
      new THREE.RingGeometry(PLAZA.radius * 0.92, PLAZA.radius * 0.96, 96),
      new THREE.MeshStandardMaterial({ color: PALETTE.plazaAccent, emissive: PALETTE.plazaAccent, emissiveIntensity: 0.5, roughness: 0.5 })
    );
    inlay.rotation.x = -Math.PI / 2;
    inlay.position.y = 0.05;
    group.add(inlay);
    // radial plaza spokes (accent lines)
    const spokePts: number[] = [];
    for (let i = 0; i < 48; i++) {
      const a = (Math.PI * 2 * i) / 48;
      spokePts.push(0, 0.05, 0);
      spokePts.push(Math.cos(a) * PLAZA.radius * 0.9, 0.05, Math.sin(a) * PLAZA.radius * 0.9);
    }
    const spokeGeo = new THREE.BufferGeometry();
    spokeGeo.setAttribute("position", new THREE.Float32BufferAttribute(spokePts, 3));
    const spokes = new THREE.LineSegments(
      spokeGeo,
      new THREE.LineBasicMaterial({ color: PALETTE.plazaAccent, transparent: true, opacity: 0.28, depthWrite: false })
    );
    group.add(spokes);
  }

  /* ---- Fountain (plaza) ---- */
  {
    const f = new THREE.Group();
    const pool = new THREE.Mesh(
      new THREE.CircleGeometry(7, 40),
      new THREE.MeshStandardMaterial({ color: PALETTE.water, roughness: 0.2, transparent: true, opacity: 0.92 })
    );
    pool.rotation.x = -Math.PI / 2;
    pool.position.y = 0.08;
    f.add(pool);
    const rimM = new THREE.MeshStandardMaterial({ color: 0xe8ecf2, roughness: 0.6 });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(7, 0.55, 10, 40), rimM);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.18;
    f.add(ring);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.4, 0.9, 12), rimM);
    base.position.y = 0.55;
    f.add(base);
    f.position.set(0, 0, 30);
    group.add(f);
  }

  /* ---- Secret lake (NW) + bridge + island ---- */
  {
    // lake water disc
    const lakeCenter: [number, number] = [-177, -177];
    const lakeR = 84;
    const water = new THREE.Mesh(
      new THREE.CircleGeometry(lakeR, 64),
      new THREE.MeshStandardMaterial({ color: PALETTE.water, roughness: 0.2, transparent: true, opacity: 0.9 })
    );
    water.rotation.x = -Math.PI / 2;
    water.position.set(lakeCenter[0], 0.02, lakeCenter[1]);
    group.add(water);
    const shore = new THREE.Mesh(
      new THREE.RingGeometry(lakeR - 1.2, lakeR + 1.6, 64),
      new THREE.MeshStandardMaterial({ color: 0xb8bfcb, roughness: 1 })
    );
    shore.rotation.x = -Math.PI / 2;
    shore.position.set(lakeCenter[0], 0.03, lakeCenter[1]);
    group.add(shore);

    // the NW avenue becomes a bridge across the lake: direction is NW (-0.707,-0.707)
    const nx = -0.7071, nz = -0.7071;
    // mainland shore ~ r=170, island at r=285
    const startR = 166, endR = 300;
    const s0x = nx * startR, s0z = nz * startR;
    const s1x = nx * endR, s1z = nz * endR;
    const deckLen = endR - startR + 6;
    const deckMid = (startR + endR) / 2;
    const deckMat = new THREE.MeshStandardMaterial({ color: 0xd6dce6, roughness: 0.8 });
    const deck = flatPlane(9, deckLen, deckMat);
    deck.position.set(nx * deckMid, 0.5, nz * deckMid);
    deck.rotation.y = -Math.atan2(nz, nx);
    group.add(deck);
    // rails
    const railMat = new THREE.MeshStandardMaterial({ color: PALETTE.metalDark, roughness: 0.5, metalness: 0.5 });
    const px = -nz, pz = nx;
    for (const s of [-1, 1]) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.1, deckLen), railMat);
      rail.position.set(nx * deckMid + px * s * 4.2, 1.05, nz * deckMid + pz * s * 4.2);
      rail.rotation.y = -Math.atan2(nz, nx);
      group.add(rail);
    }
    // bridge light posts
    for (const rr of [178, 210, 242, 274]) {
      for (const s of [-3.6, 3.6]) {
        const lamp = new THREE.Mesh(
          new THREE.SphereGeometry(0.3, 8, 8),
          new THREE.MeshStandardMaterial({ color: PALETTE.cyan, emissive: PALETTE.cyan, emissiveIntensity: 1.6 })
        );
        lamp.position.set(nx * rr + px * s, 2.4, nz * rr + pz * s);
        group.add(lamp);
      }
    }
  }

  /* ---- Parks ---- */
  const parks: Array<[number, number, string, number]> = [
    [0, -250, "North Gardens", PALETTE.grass],
    [250, 0, "East Park", PALETTE.grassDark],
    [-250, 0, "West Park", PALETTE.grass],
    [0, 250, "South Commons", PALETTE.grass],
  ];
  for (const [cx, cz, , accent] of parks) {
    const p = park("", cx, cz, 44, accent);
    group.add(p);
    p.traverse((o) => {
      if (o instanceof THREE.Mesh && o.geometry.type === "IcosahedronGeometry") trees.push(o);
    });
  }

  /* ---- Decorative pond with bridge (East Park) ---- */
  {
    const pond = makePond(250, -6);
    group.add(pond);
    const pond2 = makePond(-250, 8);
    group.add(pond2);
  }

  /* ---- Reserved plots (empty foundations, clearly marked) ---- */
  {
    for (const z of RESERVED) {
      if (z.id === "secret") continue; // secret is the island; handled by landmarks as a special plot
      const g = new THREE.Group();
      // raised foundation slab
      const slab = new THREE.Mesh(
        new THREE.BoxGeometry(RESERVED_PLOT_HALF * 2, 0.7, RESERVED_PLOT_HALF * 2),
        new THREE.MeshStandardMaterial({ color: 0xdde3ec, roughness: 0.8 })
      );
      slab.position.y = 0.35;
      slab.castShadow = true;
      slab.receiveShadow = true;
      g.add(slab);
      // glowing perimeter frame
      const frameMat = new THREE.MeshBasicMaterial({ color: z.accent });
      const edge = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(RESERVED_PLOT_HALF * 2 + 0.6, 0.1, RESERVED_PLOT_HALF * 2 + 0.6)),
        frameMat
      );
      edge.position.y = 0.8;
      g.add(edge);
      // corner posts
      for (const [sx, sz] of [[1, 1], [1, -1], [-1, 1], [-1, -1]] as Array<[number, number]>) {
        const post = new THREE.Mesh(
          new THREE.CylinderGeometry(0.25, 0.3, 2.4, 8),
          new THREE.MeshStandardMaterial({ color: PALETTE.metal, roughness: 0.5, metalness: 0.5 })
        );
        post.position.set(sx * RESERVED_PLOT_HALF, 1.2, sz * RESERVED_PLOT_HALF);
        g.add(post);
      }
      g.position.set(z.x, 0, z.z);
      group.add(g);
    }
  }

  // secret island terrain (a grassy mound on the lake island)
  {
    const g = new THREE.Group();
    const mound = new THREE.Mesh(
      new THREE.CircleGeometry(24, 40),
      new THREE.MeshStandardMaterial({ color: PALETTE.grass, roughness: 1 })
    );
    mound.rotation.x = -Math.PI / 2;
    mound.position.y = 0.05;
    g.add(mound);
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI * 2 * i) / 6;
      const t = makeTree(-202 + Math.cos(a) * 10, -202 + Math.sin(a) * 10, 0.7, i + 40);
      g.add(t);
      t.traverse((o) => {
        if (o instanceof THREE.Mesh && o.geometry.type === "IcosahedronGeometry") trees.push(o);
      });
    }
    group.add(g);
  }

  return { group, trees };
}

export { RADIAL_LABELS, RADIAL_DIRS };
