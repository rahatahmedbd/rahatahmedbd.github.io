import * as THREE from "three";
import { RESERVED, RESERVED_PLOT_HALF, PLAZA, PALETTE } from "./world-config";
import { RADIAL_DIRS } from "./terrain";
import {
  textTexture,
  glowTexture,
  makeBillboardCanvas,
} from "./textures";

export interface InteractPayload {
  title: string;
  body: string;
  accent: number;
  /** optional: opens the map panel instead of a popup */
  openMap?: boolean;
  /** optional: opens the Agency Headquarters experience */
  openHq?: boolean;
}

/**
 * Holographic signage, the plaza logo + globe, digital screens, kiosks and
 * interactive info objects. Everything is procedural (canvas textures).
 */

const DIRECTION_ZONES = [
  "AI Laboratory", // E
  "Website Factory", // NE
  "Portfolio Museum", // N
  "Agency Headquarters", // NW
  "Innovation Tower", // W
  "Client Hub", // SW
  "Order Center", // S
  "Service District", // SE
];

const ADS = [
  { title: "WELCOME TO", sub: "RAHATVERSE · DIGITAL CITY" },
  { title: "ORDER YOUR", sub: "WEBSITE TODAY" },
  { title: "BLOOD", sub: "SAVES LIVES · DONATE" },
  { title: "PORTFOLIO MUSEUM", sub: "OPENING CHAPTER 3" },
  { title: "AI LAB", sub: "RESERVED · CHAPTER 6" },
  { title: "EXPLORE & DISCOVER", sub: "8 DISTRICTS AWAIT" },
];

export interface Landmarks {
  group: THREE.Group;
  update: (dt: number, t: number) => void;
}

export function buildLandmarks(
  registerInteractive: (obj: THREE.Object3D, data: InteractPayload) => void
): Landmarks {
  const group = new THREE.Group();
  const dynamics: Array<{ obj: THREE.Object3D; fn: (t: number) => void }> = [];
  const screenUpdates: Array<(t: number) => void> = [];

  const addDynamic = (obj: THREE.Object3D, fn: (t: number) => void) =>
    dynamics.push({ obj, fn });

  /* ============ Plaza: giant holographic logo + floating globe ============ */
  {
    const core = new THREE.Group();

    // floor medallion logo "RA"
    const medallion = new THREE.Mesh(
      new THREE.RingGeometry(7, 11, 48),
      new THREE.MeshStandardMaterial({
        color: PALETTE.brand,
        emissive: PALETTE.brand,
        emissiveIntensity: 0.6,
        roughness: 0.4,
      })
    );
    medallion.rotation.x = -Math.PI / 2;
    medallion.position.y = 0.1;
    core.add(medallion);

    // rotating accent ring on floor
    const floorRing = new THREE.Mesh(
      new THREE.TorusGeometry(13, 0.25, 8, 48),
      new THREE.MeshStandardMaterial({ color: PALETTE.cyan, emissive: PALETTE.cyan, emissiveIntensity: 1.4 })
    );
    floorRing.rotation.x = Math.PI / 2;
    floorRing.position.y = 0.12;
    core.add(floorRing);
    addDynamic(floorRing, (t) => {
      floorRing.rotation.z = t * 0.6;
    });

    // giant "RAHATVERSE" billboard sprite
    const logo = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: textTexture({
          text: "RAHATVERSE",
          sub: "THE DIGITAL CITY · CHAPTER 2",
          fontSize: 150,
          color: "#0b1526",
          subColor: "#46536b",
        }),
        transparent: true,
        depthWrite: false,
      })
    );
    logo.scale.set(95, 26, 1);
    logo.position.set(0, 34, 0);
    core.add(logo);
    addDynamic(logo, (t) => {
      const p = 0.5 + Math.sin(t * 1.6) * 0.05;
      logo.scale.set(95 * p, 26 * p, 1);
    });

    // holographic backing glow
    const logoGlow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowTexture("rgba(244,63,94,0.85)"),
        color: 0xffffff,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    logoGlow.scale.set(70, 24, 1);
    logoGlow.position.set(0, 33, 0);
    core.add(logoGlow);

    // ---- floating digital globe ----
    const globe = new THREE.Group();
    globe.position.set(0, 60, 0);
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(11, 32, 24),
      new THREE.MeshStandardMaterial({
        color: PALETTE.cyan,
        emissive: PALETTE.cyan,
        emissiveIntensity: 0.35,
        transparent: true,
        opacity: 0.28,
        roughness: 0.2,
        metalness: 0.2,
      })
    );
    globe.add(sphere);
    const wire = new THREE.Mesh(
      new THREE.SphereGeometry(11.02, 24, 16),
      new THREE.MeshBasicMaterial({
        color: PALETTE.cyan,
        wireframe: true,
        transparent: true,
        opacity: 0.85,
      })
    );
    globe.add(wire);
    const ringMat = new THREE.MeshBasicMaterial({
      color: PALETTE.cyan,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(16, 0.35, 10, 60), ringMat);
    globe.add(ring1);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(18, 0.2, 10, 60), ringMat);
    ring2.rotation.x = 1.2;
    ring2.rotation.y = 0.6;
    globe.add(ring2);
    const ring3 = new THREE.Mesh(new THREE.TorusGeometry(20, 0.15, 10, 60), ringMat);
    ring3.rotation.x = -0.9;
    ring3.rotation.z = 0.5;
    globe.add(ring3);
    const glow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowTexture("rgba(103,232,249,0.7)"),
        color: 0xffffff,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    glow.scale.set(56, 56, 1);
    globe.add(glow);
    core.add(globe);
    addDynamic(globe, (t) => {
      globe.rotation.y = t * 0.3;
      globe.position.y = 60 + Math.sin(t * 1.2) * 1.6;
      ring1.rotation.x = t * 0.5;
      ring2.rotation.y = t * 0.4;
      ring3.rotation.z = t * 0.35;
    });

    // pulsing plaza light ring (animated lighting)
    const pulseRing = new THREE.Mesh(
      new THREE.RingGeometry(PLAZA.radius - 1, PLAZA.radius + 1, 64),
      new THREE.MeshBasicMaterial({
        color: PALETTE.brand,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    pulseRing.rotation.x = -Math.PI / 2;
    pulseRing.position.y = 0.3;
    core.add(pulseRing);
    addDynamic(pulseRing, (t) => {
      pulseRing.material.opacity = 0.25 + Math.sin(t * 2.4) * 0.15;
    });

    group.add(core);
  }

  /* ============ Direction signs (navigation) ============ */
  {
    for (let i = 0; i < RADIAL_DIRS.length; i++) {
      const [dx, dz] = RADIAL_DIRS[i];
      const r = 56;
      const x = dx * r;
      const z = dz * r;
      const s = new THREE.Group();
      // pole
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.22, 4.4, 8),
        new THREE.MeshStandardMaterial({ color: PALETTE.metalDark, roughness: 0.5, metalness: 0.6 })
      );
      pole.position.y = 2.2;
      s.add(pole);
      // sign plate facing inward
      const plate = new THREE.Mesh(
        new THREE.PlaneGeometry(6.4, 2.6),
        new THREE.MeshStandardMaterial({
          map: textTexture({
            text: DIRECTION_ZONES[i],
            sub: "District",
            fontSize: 54,
            color: "#ffffff",
            subColor: "rgba(255,255,255,0.75)",
            bg: "#0b1526",
          }),
          emissive: 0x0b1526,
          emissiveIntensity: 0.4,
          roughness: 0.6,
          transparent: true,
        })
      );
      plate.position.set(0, 3.6, 0);
      const ang = Math.atan2(dz, dx);
      plate.rotation.y = -ang + Math.PI / 2;
      s.add(plate);
      // top arrow
      const arrow = new THREE.Mesh(
        new THREE.ConeGeometry(0.7, 1.4, 12),
        new THREE.MeshStandardMaterial({ color: PALETTE.cyan, emissive: PALETTE.cyan, emissiveIntensity: 1.4 })
      );
      arrow.position.set(0, 5.4, 0);
      arrow.rotation.x = Math.PI;
      s.add(arrow);
      addDynamic(arrow, (t) => {
        arrow.position.y = 5.4 + Math.sin(t * 2 + i) * 0.2;
      });
      s.position.set(x, 0, z);
      s.rotation.y = ang;
      group.add(s);
    }
  }

  /* ============ Reserved plots: floating labels + arrows + kiosks ============ */
  {
    for (const zone of RESERVED) {
      const isSecret = zone.id === "secret";
      const plot = new THREE.Group();
      const py = isSecret ? 0 : 0;

      // floating label sprite
      const label = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: textTexture({
            text: zone.name,
            sub: isSecret
              ? "Hidden · Chapter 9"
              : `Reserved · Chapter ${zone.chapter}`,
            fontSize: 84,
            color: "#0b1526",
            subColor: "#46536b",
          }),
          transparent: true,
          depthWrite: false,
        })
      );
      label.scale.set(34, 9, 1);
      label.position.set(0, py + (isSecret ? 8 : 24), 0);
      plot.add(label);
      addDynamic(label, (t) => {
        label.position.y = py + (isSecret ? 8 : 24) + Math.sin(t * 1.4) * 0.8;
      });

      // floating downward holographic arrow (except secret — its own marker)
      if (!isSecret) {
        const arrow = new THREE.Mesh(
          new THREE.ConeGeometry(1.5, 3.4, 16),
          new THREE.MeshStandardMaterial({
            color: zone.accent,
            emissive: zone.accent,
            emissiveIntensity: 1.6,
            transparent: true,
            opacity: 0.9,
          })
        );
        arrow.rotation.x = Math.PI;
        arrow.position.set(0, py + 17, 0);
        plot.add(arrow);
        const arrowGlow = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: glowTexture(),
            color: zone.accent,
            transparent: true,
            opacity: 0.5,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          })
        );
        arrowGlow.scale.set(9, 9, 1);
        arrowGlow.position.set(0, py + 17, 0);
        plot.add(arrowGlow);
      }

      // interactive info kiosk at plot edge
      const kiosk = new THREE.Group();
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(2.4, 3.2, 0.5),
        new THREE.MeshStandardMaterial({ color: PALETTE.metal, roughness: 0.4, metalness: 0.6 })
      );
      body.position.y = 1.6;
      kiosk.add(body);
      const screen = new THREE.Mesh(
        new THREE.PlaneGeometry(1.9, 2.6),
        new THREE.MeshBasicMaterial({ color: zone.accent, transparent: true, opacity: 0.9 })
      );
      screen.position.set(0, 2, 0.27);
      kiosk.add(screen);
      kiosk.position.set(RESERVED_PLOT_HALF, 0, -RESERVED_PLOT_HALF);
      plot.add(kiosk);
      registerInteractive(screen, {
        title: zone.name,
        body: `${zone.info}\n\nTagline — "${zone.tagline}"`,
        accent: zone.accent,
        openHq: zone.id === "agency",
      });

      // If zone is Agency Headquarters, construct the physical 3D Landmark Skyscraper (Chapter 4)
      if (zone.id === "agency") {
        const hqTower = new THREE.Group();

        // Base podium
        const podium = new THREE.Mesh(
          new THREE.BoxGeometry(32, 12, 32),
          new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2, metalness: 0.8 })
        );
        podium.position.y = 6;
        hqTower.add(podium);

        // Glass Tower Body
        const glassTower = new THREE.Mesh(
          new THREE.BoxGeometry(24, 40, 24),
          new THREE.MeshStandardMaterial({
            color: PALETTE.brand,
            emissive: PALETTE.brand,
            emissiveIntensity: 0.35,
            transparent: true,
            opacity: 0.85,
            roughness: 0.1,
            metalness: 0.4,
          })
        );
        glassTower.position.y = 32;
        hqTower.add(glassTower);

        // Corner Columns
        const colMat = new THREE.MeshStandardMaterial({ color: PALETTE.metalDark, roughness: 0.3, metalness: 0.8 });
        [[-11.5, -11.5], [11.5, -11.5], [-11.5, 11.5], [11.5, 11.5]].forEach(([cx, cz]) => {
          const col = new THREE.Mesh(new THREE.BoxGeometry(1.5, 40, 1.5), colMat);
          col.position.set(cx, 32, cz);
          hqTower.add(col);
        });

        // Tower Crown & Spire
        const crown = new THREE.Mesh(
          new THREE.BoxGeometry(16, 20, 16),
          new THREE.MeshStandardMaterial({ color: PALETTE.cyan, emissive: PALETTE.cyan, emissiveIntensity: 0.6, transparent: true, opacity: 0.9 })
        );
        crown.position.y = 62;
        hqTower.add(crown);

        const spire = new THREE.Mesh(
          new THREE.CylinderGeometry(0.2, 1.2, 24, 12),
          new THREE.MeshStandardMaterial({ color: PALETTE.cyan, emissive: PALETTE.cyan, emissiveIntensity: 2.0 })
        );
        spire.position.y = 84;
        hqTower.add(spire);

        const skyBeam = new THREE.Mesh(
          new THREE.CylinderGeometry(1.5, 6, 120, 16, 1, true),
          new THREE.MeshBasicMaterial({
            color: PALETTE.brand,
            transparent: true,
            opacity: 0.35,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide,
            depthWrite: false,
          })
        );
        skyBeam.position.y = 150;
        hqTower.add(skyBeam);
        addDynamic(skyBeam, (t) => {
          skyBeam.rotation.y = t * 0.5;
          skyBeam.material.opacity = 0.25 + Math.sin(t * 3.0) * 0.1;
        });

        // Rotating Hologram Ring
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(12, 0.4, 12, 36),
          new THREE.MeshStandardMaterial({ color: PALETTE.brand, emissive: PALETTE.brand, emissiveIntensity: 1.8 })
        );
        ring.rotation.x = Math.PI / 2;
        ring.position.y = 70;
        hqTower.add(ring);
        addDynamic(ring, (t) => {
          ring.rotation.z = t * 1.2;
        });

        // Digital Entrance Doorway
        const doorFrame = new THREE.Mesh(
          new THREE.BoxGeometry(10, 8, 1),
          new THREE.MeshStandardMaterial({ color: PALETTE.cyan, emissive: PALETTE.cyan, emissiveIntensity: 1.5 })
        );
        doorFrame.position.set(0, 4, 16.2);
        hqTower.add(doorFrame);

        const doorPortal = new THREE.Mesh(
          new THREE.PlaneGeometry(8, 6.5),
          new THREE.MeshBasicMaterial({
            map: textTexture({
              text: "AGENCY HEADQUARTERS",
              sub: "Click to Enter (Chapter 4)",
              fontSize: 48,
              color: "#ffffff",
              subColor: "#f43f5e",
              bg: "#040914",
            }),
          })
        );
        doorPortal.position.set(0, 4, 16.8);
        hqTower.add(doorPortal);

        registerInteractive(doorPortal, {
          title: "Agency Headquarters",
          body: "Welcome to Agency Headquarters — Chapter 4. Click to enter the 10 interactive rooms, AI development process, and avatar guide.",
          accent: PALETTE.brand,
          openHq: true,
        });

        plot.add(hqTower);
      }

      plot.position.set(zone.x, 0, zone.z);
      group.add(plot);
    }
  }

  /* ============ Digital screens + billboards (advertising) ============ */
  {
    // 4 vertical screens around the plaza (cardinal)
    const screenPos: Array<[number, number]> = [
      [0, PLAZA.radius - 6], // south
      [PLAZA.radius - 6, 0], // east
      [0, -(PLAZA.radius - 6)], // north
      [-(PLAZA.radius - 6), 0], // west
    ];
    const screenBuilders: Array<{ x: number; z: number; rot: number; interactive: boolean; idx: number }> = [];
    screenPos.forEach(([x, z], idx) => {
      const facing = Math.atan2(z, x);
      screenBuilders.push({ x, z, rot: facing, interactive: idx === 0, idx });
    });

    for (const sb of screenBuilders) {
      const g = new THREE.Group();
      const { texture, update } = makeBillboardCanvas(512, 320, (ctx, w, h, t) => {
        const ad = ADS[Math.floor(t / 4) % ADS.length];
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, "#0e2a4a");
        grad.addColorStop(1, "#10203a");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
        // accent bar
        ctx.fillStyle = "rgba(244,63,94,0.9)";
        ctx.fillRect(0, h - 8, w, 8);
        ctx.fillStyle = "#ffffff";
        ctx.font = "700 34px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(ad.title, w / 2, h * 0.42);
        ctx.fillStyle = "rgba(103,232,249,0.95)";
        ctx.font = "500 22px Inter, sans-serif";
        ctx.fillText(ad.sub, w / 2, h * 0.68);
        ctx.fillStyle = "rgba(255,255,255,0.35)";
        ctx.font = "500 15px Inter, sans-serif";
        ctx.fillText("RAHATVERSE MEDIA", w / 2, h * 0.88);
      });
      update(0);
      const panel = new THREE.Mesh(
        new THREE.BoxGeometry(7, 0.8, 0.5),
        new THREE.MeshStandardMaterial({ color: PALETTE.metalDark, roughness: 0.5, metalness: 0.5 })
      );
      panel.position.y = 4.6;
      g.add(panel);
      const screen = new THREE.Mesh(
        new THREE.PlaneGeometry(6.6, 4.1),
        new THREE.MeshBasicMaterial({ map: texture, toneMapped: false })
      );
      screen.position.set(0, 6.8, 0.05);
      g.add(screen);
      // post
      const post = new THREE.Mesh(
        new THREE.CylinderGeometry(0.28, 0.34, 4.6, 8),
        new THREE.MeshStandardMaterial({ color: PALETTE.metalDark, roughness: 0.5, metalness: 0.5 })
      );
      post.position.y = 2.3;
      g.add(post);
      g.position.set(sb.x, 0, sb.z);
      g.rotation.y = sb.rot;
      group.add(g);
      screenUpdates.push(update);
      if (sb.interactive) {
        registerInteractive(screen, {
          title: "City Billboard",
          body: "Live advertising network of RahatVerse. This board cycles announcements about the portfolio, blood donation, and upcoming districts.",
          accent: PALETTE.cyan,
        });
      }
    }

    // a couple of tall billboards along avenues
    const billPos: Array<[number, number]> = [
      [40, -78], // north avenue
      [-42, 78], // south-west area
      [84, 40], // east
    ];
    for (let i = 0; i < billPos.length; i++) {
      const [bx, bz] = billPos[i];
      const { texture, update } = makeBillboardCanvas(512, 256, (ctx, w, h, t) => {
        ctx.fillStyle = "#0e1f36";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "rgba(34,211,238,0.9)";
        ctx.fillRect(0, 0, 12, h);
        ctx.fillStyle = "#ffffff";
        ctx.font = "700 30px Inter, sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(ADS[Math.floor(t / 3) % ADS.length].title, 40, h * 0.42);
        ctx.fillStyle = "rgba(167,139,250,0.95)";
        ctx.font = "500 20px Inter, sans-serif";
        ctx.fillText(ADS[Math.floor(t / 3) % ADS.length].sub, 40, h * 0.7);
      });
      update(0);
      const g = new THREE.Group();
      const board = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 8.5, 4.2),
        new THREE.MeshStandardMaterial({ color: PALETTE.metalDark, roughness: 0.5, metalness: 0.5 })
      );
      board.position.y = 5.2;
      g.add(board);
      const face = new THREE.Mesh(
        new THREE.PlaneGeometry(4.6, 9.4),
        new THREE.MeshBasicMaterial({ map: texture, toneMapped: false })
      );
      face.position.set(0, 5.2, 2.2);
      g.add(face);
      const post = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.38, 1.4, 8),
        new THREE.MeshStandardMaterial({ color: PALETTE.metalDark, roughness: 0.5, metalness: 0.5 })
      );
      post.position.y = 0.7;
      g.add(post);
      g.position.set(bx, 0, bz);
      g.rotation.y = i;
      group.add(g);
      screenUpdates.push(update);
    }
  }

  /* ============ Interactive map terminal (plaza) ============ */
  {
    const g = new THREE.Group();
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(1.6, 2, 1, 12),
      new THREE.MeshStandardMaterial({ color: PALETTE.metal, roughness: 0.4, metalness: 0.6 })
    );
    base.position.y = 0.5;
    g.add(base);
    const neck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.4, 0.4, 3, 10),
      new THREE.MeshStandardMaterial({ color: PALETTE.metalDark, roughness: 0.5, metalness: 0.6 })
    );
    neck.position.y = 2.5;
    g.add(neck);
    const head = new THREE.Mesh(
      new THREE.BoxGeometry(3.6, 2.6, 0.6),
      new THREE.MeshStandardMaterial({ color: PALETTE.metalDark, roughness: 0.5, metalness: 0.5 })
    );
    head.position.y = 4.6;
    g.add(head);
    const screen = new THREE.Mesh(
      new THREE.PlaneGeometry(3.2, 2.2),
      new THREE.MeshStandardMaterial({
        map: textTexture({ text: "CITY MAP", sub: "Tap to explore", fontSize: 46, color: "#0b1526" }),
        transparent: true,
        emissive: 0x22d3ee,
        emissiveIntensity: 0.3,
      })
    );
    screen.position.set(0, 4.6, 0.32);
    g.add(screen);
    g.position.set(0, 0, 26);
    group.add(g);
    registerInteractive(screen, {
      title: "Interactive Map Terminal",
      body: "The central navigation hub of RahatVerse. Open the city map to see every district and reserved location.",
      accent: PALETTE.cyan,
      openMap: true,
    });
  }

  /* ============ Hidden holograms / secret messages ============ */
  {
    // 1. Secret island message
    const secretGroup = new THREE.Group();
    const secretPos: [number, number] = [-202, -202];
    const holo = new THREE.Mesh(
      new THREE.PlaneGeometry(14, 7),
      new THREE.MeshStandardMaterial({
        map: textTexture({
          text: "YOU FOUND THE SECRET DISTRICT",
          sub: "Welcome, explorer. 🌟",
          fontSize: 46,
          color: "#fef3c7",
          subColor: "rgba(255,255,255,0.9)",
        }),
        transparent: true,
        emissive: 0xa78bfa,
        emissiveIntensity: 0.5,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
    );
    holo.position.set(secretPos[0], 6.5, secretPos[1]);
    holo.rotation.y = Math.PI / 4;
    secretGroup.add(holo);
    group.add(secretGroup);
    addDynamic(holo, (t) => {
      holo.material.opacity = 0.7 + Math.sin(t * 2.2) * 0.3;
    });
    registerInteractive(holo, {
      title: "Secret District",
      body: "A hidden island beyond the bridge. Few visitors ever find it — you were curious enough to cross.\n\nThe Agency's biggest surprises will be built here.",
      accent: PALETTE.violet,
    });

    // 2. Hidden message near plaza base
    const hidden = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 4),
      new THREE.MeshStandardMaterial({
        map: textTexture({ text: "keep building, builder.", sub: "— RahatVerse", fontSize: 40, color: "#e0f2fe" }),
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
    );
    hidden.position.set(-30, 2.6, -30);
    hidden.rotation.y = 0.6;
    group.add(hidden);

    // 3. Message near museum plot
    const hidden2 = new THREE.Mesh(
      new THREE.PlaneGeometry(9, 4),
      new THREE.MeshStandardMaterial({
        map: textTexture({ text: "the portfolio lives here.", sub: "Chapter 3", fontSize: 38, color: "#fef3c7" }),
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
    );
    hidden2.position.set(8, 2.4, -146);
    hidden2.rotation.y = 0.3;
    group.add(hidden2);
  }

  const update = (dt: number, t: number) => {
    for (const d of dynamics) d.fn(t);
    for (const u of screenUpdates) u(t);
  };

  return { group, update };
}
