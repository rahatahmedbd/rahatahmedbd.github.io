import * as THREE from "three";
import { buildCity, buildGate, buildVehicle } from "./city";
import { DISTRICTS, ROAD_RADIUS, type DistrictId } from "./districts";

/**
 * The RahatVerse tour engine.
 *
 * The visitor never drives. The pod follows the ring road on its own, easing
 * to a stop at each district, where the interactive panel opens. Controls are
 * limited to pause / resume / skip — everything else is cinematic.
 */

export type TourPhase = "cruising" | "arriving" | "stopped" | "departing";

export interface TourState {
  /** Index into DISTRICTS. */
  index: number;
  districtId: DistrictId;
  phase: TourPhase;
  /** 0…1 around the loop. */
  progress: number;
  speed: number;
  paused: boolean;
}

export interface TourCallbacks {
  onState: (patch: Partial<TourState>) => void;
  /** Fired once when the pod finishes parking at a district. */
  onArrive: (districtId: DistrictId, index: number) => void;
  /** Fired when the pod pulls away. */
  onDepart: () => void;
  onReady: () => void;
}

interface Options {
  container: HTMLElement;
  callbacks: TourCallbacks;
  /** Start the tour parked at this district instead of the gate. */
  startAt?: DistrictId;
  /** Lower quality on small/low-power devices. */
  lowPower?: boolean;
}

/** Angle (radians) of each district's parking spot on the ring road. */
const STOP_ANGLES = DISTRICTS.map((d) => Math.atan2(d.parkZ, d.parkX));

const TWO_PI = Math.PI * 2;

function norm(a: number) {
  return ((a % TWO_PI) + TWO_PI) % TWO_PI;
}

/** Shortest forward distance from a to b along the loop. */
function forwardDelta(a: number, b: number) {
  return norm(b - a);
}

export class TourEngine {
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private clock = new THREE.Clock();
  private raf = 0;
  private disposed = false;

  private city!: ReturnType<typeof buildCity>;
  private vehicle!: ReturnType<typeof buildVehicle>;

  /** Current angular position of the pod on the ring. */
  private angle = 0;
  private speed = 0;
  private targetSpeed = 0;
  private phase: TourPhase = "cruising";
  private index = 0;
  private paused = false;
  private stopTimer = 0;
  private elapsed = 0;
  private cinematicIntro = 1;

  /** Camera rig — smoothed chase position. */
  private camPos = new THREE.Vector3();
  private camLook = new THREE.Vector3();
  private orbit = 0;
  private userOrbit = 0;
  private userPitch = 0;
  private dragging = false;
  private lastX = 0;
  private lastY = 0;

  private readonly CRUISE = 0.16; // radians / second
  private readonly APPROACH_ARC = 0.42;

  constructor(private opts: Options) {
    this.init();
  }

  /* ── setup ─────────────────────────────────────────────────────────── */

  private init() {
    const { container, lowPower } = this.opts;

    this.renderer = new THREE.WebGLRenderer({
      antialias: !lowPower,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowPower ? 1.2 : 1.75));
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.shadowMap.enabled = !lowPower;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x050914);
    this.scene.fog = new THREE.FogExp2(0x070d1c, 0.0016);

    this.camera = new THREE.PerspectiveCamera(
      58,
      container.clientWidth / container.clientHeight,
      0.5,
      3000
    );

    /* Lighting — a cool night city with warm brand rim light. */
    this.scene.add(new THREE.AmbientLight(0x6b8cc7, 0.55));

    const key = new THREE.DirectionalLight(0xdbeafe, 1.25);
    key.position.set(120, 220, 90);
    if (!lowPower) {
      key.castShadow = true;
      key.shadow.mapSize.set(1024, 1024);
      key.shadow.camera.near = 10;
      key.shadow.camera.far = 700;
      const c = key.shadow.camera as THREE.OrthographicCamera;
      c.left = -280;
      c.right = 280;
      c.top = 280;
      c.bottom = -280;
    }
    this.scene.add(key);

    const rim = new THREE.DirectionalLight(0xf43f5e, 0.65);
    rim.position.set(-150, 90, -120);
    this.scene.add(rim);

    const fillLight = new THREE.HemisphereLight(0x1e3a8a, 0x020617, 0.6);
    this.scene.add(fillLight);

    /* World */
    this.city = buildCity();
    this.scene.add(this.city.group);
    this.scene.add(buildGate());

    this.vehicle = buildVehicle();
    this.scene.add(this.vehicle.group);

    /* Start position: at the gate (angle of +Z axis), heading toward stop 1. */
    const startId = this.opts.startAt;
    if (startId) {
      const i = DISTRICTS.findIndex((d) => d.id === startId);
      this.index = Math.max(0, i);
      this.angle = STOP_ANGLES[this.index];
      this.phase = "stopped";
      this.stopTimer = 0;
    } else {
      this.angle = Math.PI / 2; // gate sits at +Z
      this.index = 0;
      this.phase = "cruising";
    }
    this.targetSpeed = this.phase === "stopped" ? 0 : this.CRUISE;

    this.placeVehicle();
    this.camPos.copy(this.desiredCamPos(1));
    this.camLook.copy(this.vehicle.group.position);

    this.bind();
    this.opts.callbacks.onReady();
    this.emit();

    if (this.phase === "stopped") {
      this.opts.callbacks.onArrive(DISTRICTS[this.index].id, this.index);
    }

    this.loop();
  }

  private bind() {
    window.addEventListener("resize", this.onResize);
    const el = this.renderer.domElement;
    el.addEventListener("pointerdown", this.onPointerDown);
    window.addEventListener("pointermove", this.onPointerMove);
    window.addEventListener("pointerup", this.onPointerUp);
    el.addEventListener("wheel", this.onWheel, { passive: false });
  }

  private onResize = () => {
    const el = this.opts.container;
    const w = el.clientWidth || window.innerWidth;
    const h = el.clientHeight || window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  private onPointerDown = (e: PointerEvent) => {
    this.dragging = true;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
  };

  private onPointerMove = (e: PointerEvent) => {
    if (!this.dragging) return;
    // Look around freely — but never steer. The pod keeps its own course.
    this.userOrbit -= (e.clientX - this.lastX) * 0.005;
    this.userPitch = THREE.MathUtils.clamp(
      this.userPitch + (e.clientY - this.lastY) * 0.003,
      -0.35,
      0.75
    );
    this.lastX = e.clientX;
    this.lastY = e.clientY;
  };

  private onPointerUp = () => {
    this.dragging = false;
  };

  private camDist = 34;
  private onWheel = (e: WheelEvent) => {
    e.preventDefault();
    this.camDist = THREE.MathUtils.clamp(this.camDist + e.deltaY * 0.03, 16, 80);
  };

  /* ── movement ──────────────────────────────────────────────────────── */

  private placeVehicle() {
    const x = Math.cos(this.angle) * ROAD_RADIUS;
    const z = Math.sin(this.angle) * ROAD_RADIUS;
    this.vehicle.group.position.set(x, 0, z);
    // Heading is the tangent (counter-clockwise travel).
    const heading = this.angle + Math.PI / 2;
    this.vehicle.group.rotation.y = -heading + Math.PI / 2;
    // Bank into the curve slightly.
    this.vehicle.group.rotation.z = THREE.MathUtils.lerp(
      this.vehicle.group.rotation.z,
      -this.speed * 0.9,
      0.06
    );
  }

  private desiredCamPos(intro: number) {
    const heading = this.angle + Math.PI / 2;
    // Behind the pod, on the outside of the curve, lifted.
    const back = heading + Math.PI + this.userOrbit;
    const dist = this.camDist * (1 + intro * 2.2);
    const height = 13 + intro * 60 + this.userPitch * 26;
    return new THREE.Vector3(
      Math.cos(this.angle) * ROAD_RADIUS + Math.cos(back) * dist,
      height,
      Math.sin(this.angle) * ROAD_RADIUS + Math.sin(back) * dist
    );
  }

  private emit() {
    this.opts.callbacks.onState({
      index: this.index,
      districtId: DISTRICTS[this.index].id,
      phase: this.phase,
      progress: norm(this.angle) / TWO_PI,
      speed: this.speed / this.CRUISE,
      paused: this.paused,
    });
  }

  private step(dt: number) {
    const target = DISTRICTS[this.index];
    const stopAngle = STOP_ANGLES[this.index];
    const dist = forwardDelta(this.angle, stopAngle);

    if (this.phase === "cruising" || this.phase === "arriving") {
      if (dist < this.APPROACH_ARC && this.phase === "cruising") {
        this.phase = "arriving";
        this.emit();
      }

      if (this.phase === "arriving") {
        // Ease down to zero across the remaining arc.
        const ratio = THREE.MathUtils.clamp(dist / this.APPROACH_ARC, 0, 1);
        this.targetSpeed = this.CRUISE * Math.max(0.06, ratio * ratio);
        if (dist < 0.012 || dist > Math.PI) {
          this.angle = stopAngle;
          this.speed = 0;
          this.targetSpeed = 0;
          this.phase = "stopped";
          this.stopTimer = 0;
          this.emit();
          this.opts.callbacks.onArrive(target.id, this.index);
        }
      } else {
        this.targetSpeed = this.CRUISE;
      }
    }

    if (this.phase === "departing") {
      this.targetSpeed = this.CRUISE;
      if (forwardDelta(stopAngle, this.angle) > 0.25) {
        this.phase = "cruising";
        this.emit();
      }
    }

    // Smooth acceleration.
    const accel = this.targetSpeed > this.speed ? 0.9 : 1.8;
    this.speed += (this.targetSpeed - this.speed) * Math.min(1, accel * dt);
    if (this.speed < 0.0006) this.speed = 0;

    if (!this.paused && this.phase !== "stopped") {
      this.angle = norm(this.angle + this.speed * dt);
    }

    this.placeVehicle();
  }

  private loop = () => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.loop);

    const dt = Math.min(this.clock.getDelta(), 0.05);
    this.elapsed += dt;

    // Cinematic fly-in on first load.
    if (this.cinematicIntro > 0) {
      this.cinematicIntro = Math.max(0, this.cinematicIntro - dt * 0.42);
    }

    if (!this.paused) this.step(dt);
    else this.placeVehicle();

    this.city.update(this.elapsed, this.phase === "stopped" ? this.index : -1);
    this.vehicle.update(this.elapsed, this.speed / this.CRUISE);

    // Camera: chase while moving, slow orbit toward the building while parked.
    if (this.phase === "stopped") {
      this.orbit += dt * 0.12;
    } else {
      this.orbit *= 0.96;
    }

    const desired = this.desiredCamPos(this.cinematicIntro);
    if (this.phase === "stopped") {
      // Swing around to show the landmark the pod parked at.
      const d = DISTRICTS[this.index];
      const toBuilding = new THREE.Vector3(d.x, 0, d.z)
        .sub(this.vehicle.group.position)
        .normalize();
      const side = new THREE.Vector3(-toBuilding.z, 0, toBuilding.x);
      desired.copy(this.vehicle.group.position)
        .addScaledVector(toBuilding, -this.camDist * 0.75)
        .addScaledVector(side, Math.sin(this.orbit) * 16)
        .setY(16 + this.userPitch * 24 + Math.sin(this.orbit * 0.8) * 3);
    }

    this.camPos.lerp(desired, 1 - Math.pow(0.0025, dt));
    this.camera.position.copy(this.camPos);

    const lookTarget =
      this.phase === "stopped"
        ? new THREE.Vector3(
            DISTRICTS[this.index].x,
            DISTRICTS[this.index].height * 0.4,
            DISTRICTS[this.index].z
          )
        : this.vehicle.group.position
            .clone()
            .add(
              new THREE.Vector3(
                Math.cos(this.angle + Math.PI / 2) * 26,
                6,
                Math.sin(this.angle + Math.PI / 2) * 26
              )
            );
    this.camLook.lerp(lookTarget, 1 - Math.pow(0.004, dt));
    this.camera.lookAt(this.camLook);

    this.renderer.render(this.scene, this.camera);
  };

  /* ── public controls ───────────────────────────────────────────────── */

  /** Leave the current stop and drive to the next district. */
  next() {
    this.index = (this.index + 1) % DISTRICTS.length;
    this.phase = "departing";
    this.paused = false;
    this.opts.callbacks.onDepart();
    this.emit();
  }

  /** Drive to a specific district (used by the city map). */
  goTo(id: DistrictId) {
    const i = DISTRICTS.findIndex((d) => d.id === id);
    if (i < 0) return;
    if (i === this.index && this.phase === "stopped") {
      this.opts.callbacks.onArrive(id, i);
      return;
    }
    this.index = i;
    this.phase = "departing";
    this.paused = false;
    this.opts.callbacks.onDepart();
    this.emit();
  }

  /** Skip ahead without the drive (accessibility / impatience). */
  jumpTo(id: DistrictId) {
    const i = DISTRICTS.findIndex((d) => d.id === id);
    if (i < 0) return;
    this.index = i;
    this.angle = STOP_ANGLES[i];
    this.speed = 0;
    this.targetSpeed = 0;
    this.phase = "stopped";
    this.placeVehicle();
    this.emit();
    this.opts.callbacks.onArrive(id, i);
  }

  setPaused(v: boolean) {
    this.paused = v;
    this.emit();
  }

  togglePaused() {
    this.setPaused(!this.paused);
  }

  get isPaused() {
    return this.paused;
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("pointermove", this.onPointerMove);
    window.removeEventListener("pointerup", this.onPointerUp);
    const el = this.renderer.domElement;
    el.removeEventListener("pointerdown", this.onPointerDown);
    el.removeEventListener("wheel", this.onWheel);

    this.city.dispose();
    this.scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.geometry) mesh.geometry.dispose?.();
      const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((m) => m.dispose?.());
      else mat?.dispose?.();
    });
    this.renderer.dispose();
    el.remove();
  }
}
