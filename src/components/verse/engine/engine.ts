import * as THREE from "three";
import { WORLD, DISTRICTS, RESERVED, PLAZA, TimePhase } from "./world-config";
import { buildTerrain } from "./terrain";
import { buildSky } from "./sky";
import { buildLandmarks, InteractPayload } from "./landmarks";
import { buildLiving } from "./living";
import type { VerseAudio } from "./audio";
import type { HudState } from "./world-config";
import { glowTexture } from "./textures";

export interface EngineCallbacks {
  onHud: (patch: Partial<HudState>) => void;
  onCollect: (found: number, total: number, label: string) => void;
}

interface EngineOptions {
  container: HTMLElement;
  minimapCanvas: HTMLCanvasElement;
  audio: VerseAudio;
  callbacks: EngineCallbacks;
}

export class VerseEngine {
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private clock = new THREE.Clock();
  private raf = 0;
  private disposed = false;

  private player = new THREE.Vector3(0, 0, 70);
  private playerYaw = Math.PI;
  private camYaw = 0;
  private camPitch = 0.35;
  private camDist = 30;
  private keys = new Set<string>();
  private moveTarget: THREE.Vector3 | null = null;
  private joystick = { x: 0, y: 0 };

  private terrain!: ReturnType<typeof buildTerrain>;
  private sky!: ReturnType<typeof buildSky>;
  private landmarks!: ReturnType<typeof buildLandmarks>;
  private living!: ReturnType<typeof buildLiving>;
  private interactives: Array<THREE.Object3D> = [];

  private time = 0;
  private elapsed = 0;
  private currentDistrict = "Central Plaza";
  private hoverData: InteractPayload | null = null;
  private raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2();

  private downX = 0;
  private downY = 0;
  private dragging = false;
  private moving = false;

  private minimap: CanvasRenderingContext2D | null = null;

  constructor(private opts: EngineOptions) {
    this.init();
  }

  private init() {
    const { container, minimapCanvas } = this.opts;
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.NoToneMapping;
    container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0xcfe6fb, 220, WORLD.fogFar);
    this.camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.5,
      6000
    );

    // lights provided by the sky system
    this.sky = buildSky();
    this.sky.setScene(this.scene);
    this.scene.add(this.sky.group);

    // terrain
    this.terrain = buildTerrain();
    this.scene.add(this.terrain.group);

    // landmarks
    this.landmarks = buildLandmarks((obj, data) => {
      obj.userData.interactive = data;
      this.interactives.push(obj);
    });
    this.scene.add(this.landmarks.group);

    // living world
    this.living = buildLiving((obj, data) => {
      obj.userData.interactive = data;
      this.interactives.push(obj);
    });
    this.scene.add(this.living.group);

    // void plane far below the platform
    const abyss = new THREE.Mesh(
      new THREE.PlaneGeometry(14000, 14000),
      new THREE.MeshStandardMaterial({ color: 0x0a1028, roughness: 1 })
    );
    abyss.rotation.x = -Math.PI / 2;
    abyss.position.y = WORLD.voidY - 4;
    this.scene.add(abyss);

    // player avatar
    this.buildPlayer();

    this.minimap = minimapCanvas.getContext("2d");

    this.bindEvents();
    this.sky.setTarget("day");
    this.opts.callbacks.onHud({ timePhase: "day" });

    this.loop();
  }

  private buildPlayer() {
    // stylised avatar: glowing orb hovering inside a ring — reads as a "visitor"
    const g = new THREE.Group();
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(0.7, 16, 12),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xf43f5e,
        emissiveIntensity: 1.6,
        roughness: 0.2,
        metalness: 0.2,
      })
    );
    core.position.y = 1.1;
    core.castShadow = true;
    g.add(core);
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.0, 0.08, 8, 24),
      new THREE.MeshStandardMaterial({ color: 0x22d3ee, emissive: 0x22d3ee, emissiveIntensity: 1.8 })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.6;
    g.add(ring);
    const glow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowTexture("rgba(244,63,94,0.7)"),
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    glow.scale.set(4.5, 4.5, 1);
    g.add(glow);
    (g as any).userData.avatar = true;
    (g as any).userData.glow = glow;
    (g as any).userData.ring = ring;
    (g as any).userData.core = core;
    g.position.copy(this.player);
    this.scene.add(g);
    (this as any).avatar = g;
  }

  private bindEvents() {
    const canvas = this.renderer.domElement;

    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    canvas.addEventListener("pointerdown", this.onPointerDown);
    window.addEventListener("pointermove", this.onPointerMove);
    window.addEventListener("pointerup", this.onPointerUp);
    window.addEventListener("wheel", this.onWheel, { passive: false });
    window.addEventListener("resize", this.onResize);
  }

  private onKeyDown = (e: KeyboardEvent) => {
    const k = e.key.toLowerCase();
    if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(k)) {
      e.preventDefault();
      this.keys.add(k);
      this.moveTarget = null;
    }
  };
  private onKeyUp = (e: KeyboardEvent) => {
    this.keys.delete(e.key.toLowerCase());
  };

  private onPointerDown = (e: PointerEvent) => {
    this.downX = e.clientX;
    this.downY = e.clientY;
    this.dragging = false;
    this.moving = false;
  };

  private onPointerMove = (e: PointerEvent) => {
    if (e.buttons > 0) {
      const dx = e.clientX - this.downX;
      const dy = e.clientY - this.downY;
      if (Math.abs(dx) + Math.abs(dy) > 6) this.dragging = true;
      if (this.dragging) {
        this.camYaw -= dx * 0.005;
        this.camPitch = Math.max(0.08, Math.min(1.2, this.camPitch + dy * 0.004));
        this.downX = e.clientX;
        this.downY = e.clientY;
      }
    }
    this.updateHover(e);
  };

  private onPointerUp = (e: PointerEvent) => {
    if (!this.dragging) {
      this.handleClick(e);
    }
  };

  private onWheel = (e: WheelEvent) => {
    e.preventDefault();
    this.camDist = Math.max(8, Math.min(60, this.camDist + e.deltaY * 0.02));
  };

  private onResize = () => {
    const el = this.opts.container;
    const w = el.clientWidth || window.innerWidth;
    const h = el.clientHeight || window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  private setPointerFromEvent(e: MouseEvent | PointerEvent) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  }

  private findInteractive(obj: THREE.Object3D): InteractPayload | null {
    let o: THREE.Object3D | null = obj;
    while (o) {
      if (o.userData && (o.userData as any).interactive) return (o.userData as any).interactive as InteractPayload;
      o = o.parent;
    }
    return null;
  }

  private updateHover(e: PointerEvent) {
    if ((e.target as HTMLElement) !== this.renderer.domElement) return;
    this.setPointerFromEvent(e);
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hits = this.raycaster.intersectObjects(this.scene.children, true);
    let found: InteractPayload | null = null;
    for (const h of hits) {
      const iv = this.findInteractive(h.object);
      if (iv) {
        found = iv;
        break;
      }
    }
    if (found !== this.hoverData) {
      this.hoverData = found;
      this.opts.callbacks.onHud({
        hint: found ? "Press / click to interact" : null,
        interactable: !!found,
      });
    }
  }

  private handleClick(e: PointerEvent) {
    this.setPointerFromEvent(e);
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hits = this.raycaster.intersectObjects(this.scene.children, true);
    for (const h of hits) {
      const iv = this.findInteractive(h.object);
      if (iv) {
        this.hoverData = null;
        if (iv.openMap) {
          this.opts.callbacks.onHud({ mapOpen: true });
        } else if (iv.openHq) {
          this.opts.callbacks.onHud({ hqModalOpen: true });
        } else {
          this.opts.callbacks.onHud({ infoPanel: { title: iv.title, body: iv.body, accent: iv.accent } });
        }
        return;
      }
    }
    // click on ground → move toward it
    const groundHits = hits.filter((h) => h.point.y > -2 && h.point.y < 3);
    if (groundHits.length) {
      this.moveTarget = groundHits[0].point.clone();
      this.moveTarget.y = 0;
    }
  }

  setJoystick(x: number, y: number) {
    this.joystick.x = x;
    this.joystick.y = y;
    if (Math.abs(x) > 0.05 || Math.abs(y) > 0.05) this.moveTarget = null;
  }

  setPhase(phase: TimePhase) {
    this.sky.setTarget(phase);
    this.opts.callbacks.onHud({ timePhase: phase });
  }

  private getMoveInput(): [number, number] {
    let ix = this.joystick.x;
    let iy = this.joystick.y;
    if (this.keys.has("w") || this.keys.has("arrowup")) iy -= 1;
    if (this.keys.has("s") || this.keys.has("arrowdown")) iy += 1;
    if (this.keys.has("a") || this.keys.has("arrowleft")) ix -= 1;
    if (this.keys.has("d") || this.keys.has("arrowright")) ix += 1;
    const len = Math.hypot(ix, iy);
    if (len > 1) {
      ix /= len;
      iy /= len;
    }
    return [ix, iy];
  }

  private updatePlayer(dt: number) {
    const SPEED = 13;
    let dx = 0;
    let dz = 0;

    if (this.moveTarget) {
      const to = new THREE.Vector3().subVectors(this.moveTarget, this.player);
      to.y = 0;
      if (to.length() < 1) {
        this.moveTarget = null;
      } else {
        to.normalize();
        dx = to.x;
        dz = to.z;
      }
    }

    if (dx === 0 && dz === 0) {
      const [ix, iy] = this.getMoveInput();
      if (ix !== 0 || iy !== 0) {
        // rotate input by camera yaw so "forward" = camera forward
        const cos = Math.cos(this.camYaw);
        const sin = Math.sin(this.camYaw);
        dx = ix * cos + iy * sin;
        dz = -ix * sin + iy * cos;
      }
    }

    if (dx !== 0 || dz !== 0) {
      const len = Math.hypot(dx, dz);
      dx /= len;
      dz /= len;
      this.player.x += dx * SPEED * dt;
      this.player.z += dz * SPEED * dt;
      this.playerYaw = Math.atan2(dx, dz);
    }

    // keep within the world
    const r = Math.hypot(this.player.x, this.player.z);
    const maxR = WORLD.groundRadius - 8;
    if (r > maxR) {
      this.player.x = (this.player.x / r) * maxR;
      this.player.z = (this.player.z / r) * maxR;
    }

    // update avatar
    const avatar = (this as any).avatar as THREE.Group;
    avatar.position.copy(this.player);
    avatar.rotation.y = this.playerYaw;
    const glow = (avatar as any).userData.glow as THREE.Sprite;
    const core = (avatar as any).userData.core as THREE.Mesh;
    const ring = (avatar as any).userData.ring as THREE.Mesh;
    core.position.y = 1.1 + Math.sin(this.elapsed * 2) * 0.1;
    ring.position.y = 0.6 + Math.sin(this.elapsed * 2 + 1) * 0.06;
    ring.rotation.z = this.elapsed * 1.5;
    if (glow) glow.material.opacity = 0.4 + Math.sin(this.elapsed * 2.4) * 0.15;
  }

  private updateCamera(dt: number) {
    const dist = this.camDist;
    const targetX =
      this.player.x + Math.sin(this.camYaw) * Math.cos(this.camPitch) * dist;
    const targetY = this.player.y + Math.sin(this.camPitch) * dist + 3;
    const targetZ =
      this.player.z + Math.cos(this.camYaw) * Math.cos(this.camPitch) * dist;
    this.camera.position.x += (targetX - this.camera.position.x) * Math.min(1, dt * 6);
    this.camera.position.y += (targetY - this.camera.position.y) * Math.min(1, dt * 6);
    this.camera.position.z += (targetZ - this.camera.position.z) * Math.min(1, dt * 6);
    this.camera.lookAt(this.player.x, this.player.y + 1.5, this.player.z);
  }

  private updateDistrict() {
    let best = DISTRICTS[0];
    let bestDist = Infinity;
    for (const d of DISTRICTS) {
      const dd = Math.hypot(d.x - this.player.x, d.z - this.player.z);
      if (dd < bestDist) {
        bestDist = dd;
        best = d;
      }
    }
    for (const r of RESERVED) {
      const dd = Math.hypot(r.x - this.player.x, r.z - this.player.z);
      if (dd < bestDist) {
        bestDist = dd;
        best = { id: r.id, name: r.name, bn: r.bn, x: r.x, z: r.z, accent: r.accent };
      }
    }
    if (best.name !== this.currentDistrict) {
      this.currentDistrict = best.name;
      this.opts.callbacks.onHud({ district: best.name, districtBn: best.bn });
    }
  }

  private updateCollectibles() {
    for (const c of this.living.collectibles) {
      if (c.collected) continue;
      if (c.position.distanceTo(this.player) < 3.4) {
        c.collected = true;
        c.mesh.visible = false;
        const count = this.living.getCollectedCount();
        this.opts.callbacks.onHud({
          collectibles: { found: count, total: this.living.collectibles.length },
        });
        this.opts.callbacks.onCollect(count, this.living.collectibles.length, c.label);
      }
    }
  }

  private drawMinimap() {
    const ctx = this.minimap;
    if (!ctx) return;
    const cv = this.opts.minimapCanvas;
    const S = cv.width;
    const cx = S / 2;
    const cy = S / 2;
    const scale = S / (WORLD.groundRadius * 2.2);
    ctx.clearRect(0, 0, S, S);
    // transparent panel background
    ctx.fillStyle = "rgba(7,11,20,0.55)";
    ctx.beginPath();
    ctx.arc(cx, cy, S / 2 - 2, 0, Math.PI * 2);
    ctx.fill();

    const px = (x: number) => cx + x * scale;
    const pz = (z: number) => cy + z * scale;

    // ground boundary
    ctx.strokeStyle = "rgba(103,232,249,0.5)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, WORLD.groundRadius * scale, 0, Math.PI * 2);
    ctx.stroke();

    // roads: ring roads
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 1.5;
    for (const rr of [118, 235]) {
      ctx.beginPath();
      ctx.arc(cx, cy, rr * scale, 0, Math.PI * 2);
      ctx.stroke();
    }
    // radial roads
    for (let i = 0; i < 8; i++) {
      const a = (Math.PI / 4) * i;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * PLAZA.radius * scale, cy + Math.sin(a) * PLAZA.radius * scale);
      ctx.lineTo(cx + Math.cos(a) * WORLD.groundRadius * scale, cy + Math.sin(a) * WORLD.groundRadius * scale);
      ctx.stroke();
    }

    // plaza
    ctx.fillStyle = "rgba(244,63,94,0.85)";
    ctx.beginPath();
    ctx.arc(cx, cy, PLAZA.radius * scale, 0, Math.PI * 2);
    ctx.fill();

    // zones
    for (const r of RESERVED) {
      const col = "#" + r.accent.toString(16).padStart(6, "0");
      ctx.fillStyle = col;
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.arc(px(r.x), pz(r.z), 3.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // player
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#f43f5e";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(px(this.player.x), pz(this.player.z), 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // north
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.font = "10px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("N", cx, 12);
  }

  private loop = () => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.loop);
    const dt = Math.min(this.clock.getDelta(), 0.05);
    this.elapsed += dt;
    this.time = this.elapsed;

    this.updatePlayer(dt);
    this.updateCamera(dt);
    this.updateDistrict();
    this.updateCollectibles();

    const phase = this.sky.update(dt, this.time);
    this.landmarks.update(dt, this.time);
    this.living.update(dt, this.time, this.player);
    this.drawMinimap();

    // subtle avatar motion under any leftover state
    this.renderer.render(this.scene, this.camera);
    void phase;
  };

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    window.removeEventListener("pointermove", this.onPointerMove);
    window.removeEventListener("pointerup", this.onPointerUp);
    window.removeEventListener("wheel", this.onWheel);
    window.removeEventListener("resize", this.onResize);
    const canvas = this.renderer.domElement;
    if (canvas.parentElement) canvas.parentElement.removeChild(canvas);
    this.renderer.dispose();
  }
}
