import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  FACTORY,
  FACTORY_PALETTE,
  ZONES,
  MACHINES,
  ZoneId,
  BUILD_OPTIONS,
} from "./factory-config";

export interface FactoryCallbacks {
  onHud: (patch: any) => void;
  onZoneEnter: (zone: string) => void;
  onMachineActivate: (machineId: string) => void;
  onBuildProgress: (progress: number) => void;
}

interface EngineOptions {
  container: HTMLElement;
  callbacks: FactoryCallbacks;
}

export class FactoryEngine {
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private clock = new THREE.Clock();
  private raf = 0;
  private disposed = false;

  private player = new THREE.Vector3(0, 8, -110);
  private keys = new Set<string>();
  private velocity = new THREE.Vector3();
  private onGround = true;

  private zones: Map<ZoneId, THREE.Group> = new Map();
  private machines: Map<string, THREE.Group> = new Map();
  private conveyorBelts: THREE.Group[] = [];
  private robots: THREE.Group[] = [];
  private holograms: THREE.Group[] = [];
  private buildModel: THREE.Group | null = null;

  private currentZone: string = "Entrance";
  private buildProgress = 0;
  private raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2();
  private interactables: Array<{ obj: THREE.Object3D; id: string; type: string }> = [];

  private callbacks: FactoryCallbacks;
  private buildSelections: Record<string, number> = {};

  constructor(private opts: EngineOptions) {
    this.callbacks = opts.callbacks;
    this.init();
  }

  private init() {
    const { container } = this.opts;

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
      alpha: true,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.9));
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x05070f, 90, 420);

    this.camera = new THREE.PerspectiveCamera(
      68,
      container.clientWidth / container.clientHeight,
      0.8,
      900
    );
    this.camera.position.set(0, 34, -80);

    // Controls (free roam + first-person style)
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.target.set(0, 18, -20);
    this.controls.maxPolarAngle = Math.PI * 0.92;
    this.controls.minDistance = 8;
    this.controls.maxDistance = 185;

    // Lighting
    this.setupLighting();

    // Build the entire factory
    this.buildFactoryStructure();
    this.buildEntrance();
    this.buildZones();
    this.buildConveyors();
    this.buildRobots();
    this.buildMachines();
    this.buildHolographicDisplays();
    this.buildBuildSimulatorPlatform();

    // Add interactive AI Guide robot
    this.spawnAIGuide();

    // Event listeners
    this.setupControls();
    this.setupInteractions();

    // Resize
    const onResize = () => {
      this.camera.aspect = container.clientWidth / container.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", onResize);

    this.animate();
  }

  private setupLighting() {
    const hemi = new THREE.HemisphereLight(0x9fb1d4, 0x0c1324, 0.6);
    this.scene.add(hemi);

    const dir = new THREE.DirectionalLight(0xffffff, 0.75);
    dir.position.set(60, 120, -90);
    dir.castShadow = true;
    dir.shadow.mapSize.width = 2048;
    dir.shadow.mapSize.height = 2048;
    dir.shadow.camera.near = 20;
    dir.shadow.camera.far = 380;
    dir.shadow.camera.left = -240;
    dir.shadow.camera.right = 240;
    dir.shadow.camera.top = 120;
    dir.shadow.camera.bottom = -140;
    this.scene.add(dir);

    // Accent lights per zone
    const accentColors = [
      FACTORY_PALETTE.accentCyan,
      FACTORY_PALETTE.accentPink,
      FACTORY_PALETTE.accentViolet,
      FACTORY_PALETTE.accentGold,
    ];

    for (let i = 0; i < 6; i++) {
      const point = new THREE.PointLight(accentColors[i % 4], 1.6, 180);
      point.position.set(
        (i - 2.5) * 68,
        36,
        -60 + (i % 3) * 70
      );
      this.scene.add(point);
    }
  }

  private buildFactoryStructure() {
    // Massive industrial floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(FACTORY.width + 40, FACTORY.length + 40),
      new THREE.MeshStandardMaterial({
        color: FACTORY_PALETTE.floor,
        roughness: 0.75,
        metalness: 0.35,
      })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Grid lines on floor
    const grid = new THREE.GridHelper(FACTORY.width + 20, 48, 0x1e2637, 0x1e2637);
    grid.position.y = 0.08;
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.4;
    this.scene.add(grid);

    // Ceiling structure
    const ceiling = new THREE.Mesh(
      new THREE.PlaneGeometry(FACTORY.width + 40, FACTORY.length + 40),
      new THREE.MeshStandardMaterial({
        color: 0x0f141f,
        roughness: 0.9,
        metalness: 0.1,
      })
    );
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = FACTORY.ceilingY;
    this.scene.add(ceiling);

    // Structural pillars
    const pillarMat = new THREE.MeshStandardMaterial({
      color: FACTORY_PALETTE.metal,
      metalness: 0.8,
      roughness: 0.3,
    });

    for (let x = -160; x <= 160; x += 92) {
      for (let z = -130; z <= 170; z += 95) {
        const pillar = new THREE.Mesh(
          new THREE.CylinderGeometry(2.8, 2.8, FACTORY.ceilingY, 5),
          pillarMat
        );
        pillar.position.set(x, FACTORY.ceilingY / 2, z);
        pillar.castShadow = true;
        this.scene.add(pillar);
      }
    }

    // Industrial roof trusses
    const trussMat = new THREE.MeshStandardMaterial({ color: FACTORY_PALETTE.metalDark });
    for (let i = -3; i <= 3; i++) {
      const truss = new THREE.Mesh(
        new THREE.BoxGeometry(FACTORY.width - 30, 1.6, 4.5),
        trussMat
      );
      truss.position.set(0, FACTORY.ceilingY - 6, i * 48);
      this.scene.add(truss);
    }
  }

  private buildEntrance() {
    const entranceGroup = new THREE.Group();
    entranceGroup.position.set(0, 0, -152);

    // Massive factory gate
    const gateFrame = new THREE.Mesh(
      new THREE.BoxGeometry(82, 52, 7),
      new THREE.MeshStandardMaterial({ color: FACTORY_PALETTE.metal, metalness: 0.85 })
    );
    gateFrame.position.y = 26;
    entranceGroup.add(gateFrame);

    // Animated sliding doors (left + right)
    const doorMat = new THREE.MeshStandardMaterial({
      color: 0x1c2637,
      metalness: 0.95,
      roughness: 0.15,
    });

    const leftDoor = new THREE.Mesh(new THREE.BoxGeometry(39, 48, 3), doorMat);
    leftDoor.position.set(-20, 24, 0);
    entranceGroup.add(leftDoor);

    const rightDoor = leftDoor.clone();
    rightDoor.position.set(20, 24, 0);
    entranceGroup.add(rightDoor);

    // Store doors for animation
    (entranceGroup as any).leftDoor = leftDoor;
    (entranceGroup as any).rightDoor = rightDoor;

    // Digital scanner arch
    const scanner = new THREE.Mesh(
      new THREE.TorusGeometry(32, 2.4, 14, 48),
      new THREE.MeshStandardMaterial({
        color: FACTORY_PALETTE.accentCyan,
        emissive: FACTORY_PALETTE.accentCyan,
        emissiveIntensity: 1.2,
      })
    );
    scanner.rotation.x = Math.PI / 2;
    scanner.position.y = 26;
    entranceGroup.add(scanner);

    // Holographic Welcome Sign
    const welcomeCanvas = document.createElement("canvas");
    welcomeCanvas.width = 1024;
    welcomeCanvas.height = 256;
    const ctx = welcomeCanvas.getContext("2d")!;
    ctx.fillStyle = "#0a0f1c";
    ctx.fillRect(0, 0, 1024, 256);
    ctx.fillStyle = "#67e8f9";
    ctx.font = "bold 92px Inter, system-ui";
    ctx.fillText("WEBSITE FACTORY", 120, 108);
    ctx.font = "500 42px Inter, system-ui";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("CHAPTER 6 — RAHATVERSE", 120, 168);
    ctx.fillStyle = "#f43f5e";
    ctx.fillText("PRODUCTION IN PROGRESS", 120, 216);

    const welcomeTex = new THREE.CanvasTexture(welcomeCanvas);
    const welcomePlane = new THREE.Mesh(
      new THREE.PlaneGeometry(64, 16),
      new THREE.MeshStandardMaterial({
        map: welcomeTex,
        emissive: 0x334155,
        emissiveIntensity: 0.6,
        side: THREE.DoubleSide,
      })
    );
    welcomePlane.position.set(0, 46, -4);
    entranceGroup.add(welcomePlane);

    // Security scanner beams
    const beam = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 0.8, 48, 3),
      new THREE.MeshBasicMaterial({
        color: FACTORY_PALETTE.accentCyan,
        transparent: true,
        opacity: 0.35,
      })
    );
    beam.rotation.z = Math.PI / 2;
    beam.position.set(0, 24, 4);
    entranceGroup.add(beam);

    this.scene.add(entranceGroup);
    this.zones.set("entrance", entranceGroup);

    // Register interactive scanner
    this.interactables.push({ obj: scanner, id: "entrance", type: "scanner" });
  }

  private buildZones() {
    ZONES.forEach((zone) => {
      if (zone.id === "entrance") return;

      const zoneGroup = new THREE.Group();
      zoneGroup.position.set(zone.x, 1.2, zone.z);

      // Zone floor pad
      const floorPad = new THREE.Mesh(
        new THREE.PlaneGeometry(zone.width, zone.length),
        new THREE.MeshStandardMaterial({
          color: FACTORY_PALETTE.floorAccent,
          roughness: 0.6,
          metalness: 0.15,
        })
      );
      floorPad.rotation.x = -Math.PI / 2;
      zoneGroup.add(floorPad);

      // Zone walls (glass / metal panels)
      const wallMat = new THREE.MeshStandardMaterial({
        color: FACTORY_PALETTE.metalLight,
        metalness: 0.6,
        roughness: 0.25,
        transparent: true,
        opacity: 0.15,
      });

      // Left wall
      const leftWall = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 44, zone.length),
        wallMat
      );
      leftWall.position.set(-zone.width / 2, 22, 0);
      zoneGroup.add(leftWall);

      // Right wall
      const rightWall = leftWall.clone();
      rightWall.position.x = zone.width / 2;
      zoneGroup.add(rightWall);

      // Back wall
      const backWall = new THREE.Mesh(
        new THREE.BoxGeometry(zone.width, 44, 1.8),
        wallMat
      );
      backWall.position.set(0, 22, -zone.length / 2);
      zoneGroup.add(backWall);

      // Zone holographic label
      const labelCanvas = document.createElement("canvas");
      labelCanvas.width = 512;
      labelCanvas.height = 128;
      const ctx = labelCanvas.getContext("2d")!;
      ctx.fillStyle = "#05070f";
      ctx.fillRect(0, 0, 512, 128);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 38px Inter, system-ui";
      ctx.fillText(zone.name.split("—")[1] || zone.name, 26, 52);
      ctx.font = "500 24px Inter, system-ui";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText(zone.description, 26, 86);

      const labelTex = new THREE.CanvasTexture(labelCanvas);
      const label = new THREE.Mesh(
        new THREE.PlaneGeometry(36, 9),
        new THREE.MeshStandardMaterial({
          map: labelTex,
          emissive: zone.accent,
          emissiveIntensity: 0.25,
          side: THREE.DoubleSide,
        })
      );
      label.position.set(0, 48, -zone.length / 2 - 1);
      zoneGroup.add(label);

      // Zone accent ring
      const accentRing = new THREE.Mesh(
        new THREE.TorusGeometry(zone.width / 2.1, 0.8, 8, 42),
        new THREE.MeshStandardMaterial({
          color: zone.accent,
          emissive: zone.accent,
          emissiveIntensity: 0.8,
        })
      );
      accentRing.rotation.x = Math.PI / 2;
      accentRing.position.y = 2;
      zoneGroup.add(accentRing);

      this.scene.add(zoneGroup);
      this.zones.set(zone.id, zoneGroup);
    });
  }

  private buildConveyors() {
    const conveyorMat = new THREE.MeshStandardMaterial({
      color: FACTORY_PALETTE.conveyor,
      metalness: 0.65,
      roughness: 0.4,
    });

    // Main central conveyor
    const mainConv = new THREE.Mesh(
      new THREE.BoxGeometry(18, 1.4, 290),
      conveyorMat
    );
    mainConv.position.set(0, 2.8, 15);
    this.scene.add(mainConv);
    this.conveyorBelts.push(mainConv);

    // Side conveyors connecting zones
    const sideConv = new THREE.Mesh(
      new THREE.BoxGeometry(290, 1.4, 16),
      conveyorMat
    );
    sideConv.position.set(0, 2.8, 50);
    this.scene.add(sideConv);
    this.conveyorBelts.push(sideConv);

    // Add animated rollers
    for (let i = -120; i < 140; i += 26) {
      const roller = new THREE.Mesh(
        new THREE.CylinderGeometry(0.9, 0.9, 18.5, 12),
        new THREE.MeshStandardMaterial({ color: 0x334155 })
      );
      roller.rotation.z = Math.PI / 2;
      roller.position.set(i, 3.1, 15);
      this.scene.add(roller);
      this.conveyorBelts.push(roller);
    }
  }

  private buildRobots() {
    const createRobot = (x: number, z: number, color: number) => {
      const robot = new THREE.Group();

      // Base
      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(4.2, 4.8, 3, 6),
        new THREE.MeshStandardMaterial({ color: FACTORY_PALETTE.metalDark })
      );
      base.position.y = 1.5;
      robot.add(base);

      // Torso
      const torso = new THREE.Mesh(
        new THREE.CylinderGeometry(3.6, 3.6, 9, 6),
        new THREE.MeshStandardMaterial({ color })
      );
      torso.position.y = 7.5;
      robot.add(torso);

      // Head
      const head = new THREE.Mesh(
        new THREE.SphereGeometry(3.2, 18, 14),
        new THREE.MeshStandardMaterial({ color: 0x475569 })
      );
      head.position.y = 13.5;
      robot.add(head);

      // Eye screen
      const eye = new THREE.Mesh(
        new THREE.PlaneGeometry(4.4, 2.6),
        new THREE.MeshStandardMaterial({
          color: FACTORY_PALETTE.accentCyan,
          emissive: FACTORY_PALETTE.accentCyan,
          emissiveIntensity: 1.1,
        })
      );
      eye.position.set(0, 13.5, 3.6);
      robot.add(eye);

      // Arms
      const armMat = new THREE.MeshStandardMaterial({ color: FACTORY_PALETTE.metal });
      const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 7, 5), armMat);
      leftArm.position.set(-5.4, 7.5, 0);
      leftArm.rotation.z = 1.1;
      robot.add(leftArm);

      const rightArm = leftArm.clone();
      rightArm.position.x = 5.4;
      rightArm.rotation.z = -1.1;
      robot.add(rightArm);

      robot.position.set(x, 0, z);
      this.scene.add(robot);
      this.robots.push(robot);

      return robot;
    };

    // Multiple AI robots across the factory
    createRobot(-75, -40, FACTORY_PALETTE.accentPink);
    createRobot(82, -42, FACTORY_PALETTE.accentCyan);
    createRobot(-70, 92, FACTORY_PALETTE.accentLime);
    createRobot(76, 95, FACTORY_PALETTE.accentViolet);
    createRobot(8, 135, FACTORY_PALETTE.accentGold);
  }

  private buildMachines() {
    MACHINES.forEach((machine) => {
      const mGroup = new THREE.Group();
      mGroup.position.set(machine.x, 4, machine.z);

      // Machine base
      const base = new THREE.Mesh(
        new THREE.BoxGeometry(18, 6, 18),
        new THREE.MeshStandardMaterial({
          color: FACTORY_PALETTE.metalDark,
          metalness: 0.9,
        })
      );
      mGroup.add(base);

      // Top display
      const display = new THREE.Mesh(
        new THREE.BoxGeometry(14, 12, 3),
        new THREE.MeshStandardMaterial({
          color: machine.accent,
          emissive: machine.accent,
          emissiveIntensity: 0.6,
        })
      );
      display.position.y = 10;
      mGroup.add(display);

      // Status light
      const status = new THREE.Mesh(
        new THREE.SphereGeometry(1.8, 12, 10),
        new THREE.MeshBasicMaterial({ color: machine.accent })
      );
      status.position.set(0, 17, 0);
      mGroup.add(status);

      this.scene.add(mGroup);
      this.machines.set(machine.id, mGroup);

      // Register interaction
      this.interactables.push({ obj: mGroup, id: machine.id, type: "machine" });
    });
  }

  private buildHolographicDisplays() {
    // Floating holographic screens in each zone
    ZONES.slice(1).forEach((zone, index) => {
      if (!this.zones.has(zone.id)) return;

      const zoneGroup = this.zones.get(zone.id)!;
      const holo = new THREE.Group();

      const panel = new THREE.Mesh(
        new THREE.PlaneGeometry(26, 18),
        new THREE.MeshStandardMaterial({
          color: 0x0a0f1c,
          transparent: true,
          opacity: 0.9,
          emissive: zone.accent,
          emissiveIntensity: 0.3,
          side: THREE.DoubleSide,
        })
      );
      panel.position.y = 32;
      panel.rotation.y = (index % 2 === 0) ? 0.4 : -0.4;
      holo.add(panel);

      // Add animated data bars to panel
      const bars = new THREE.Group();
      for (let b = 0; b < 5; b++) {
        const bar = new THREE.Mesh(
          new THREE.BoxGeometry(2.4, 3 + Math.random() * 9, 1),
          new THREE.MeshBasicMaterial({ color: zone.accent })
        );
        bar.position.set(-9 + b * 5, 18 + (b % 2) * 2, 0.6);
        bars.add(bar);
      }
      panel.add(bars);

      zoneGroup.add(holo);
      this.holograms.push(holo);
    });
  }

  private buildBuildSimulatorPlatform() {
    const platform = new THREE.Group();
    platform.position.set(0, 2.4, 92);

    // Central circular platform
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(32, 34, 3.6, 48),
      new THREE.MeshStandardMaterial({
        color: 0x11151f,
        metalness: 0.7,
        roughness: 0.4,
      })
    );
    platform.add(base);

    // Holographic ring
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(30, 1.1, 10, 64),
      new THREE.MeshStandardMaterial({
        color: FACTORY_PALETTE.accentCyan,
        emissive: FACTORY_PALETTE.accentCyan,
        emissiveIntensity: 0.9,
      })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 4;
    platform.add(ring);

    // Floating build area label
    const labelCanvas = document.createElement("canvas");
    labelCanvas.width = 512;
    labelCanvas.height = 64;
    const ctx = labelCanvas.getContext("2d")!;
    ctx.fillStyle = "#05070f";
    ctx.fillRect(0, 0, 512, 64);
    ctx.fillStyle = "#67e8f9";
    ctx.font = "bold 28px Inter, system-ui";
    ctx.fillText("3D BUILD SIMULATOR", 62, 42);

    const tex = new THREE.CanvasTexture(labelCanvas);
    const label = new THREE.Mesh(
      new THREE.PlaneGeometry(38, 4.8),
      new THREE.MeshStandardMaterial({ map: tex, transparent: true, side: THREE.DoubleSide })
    );
    label.position.y = 28;
    label.rotation.x = -0.4;
    platform.add(label);

    this.scene.add(platform);

    // Create initial empty build model
    this.buildModel = new THREE.Group();
    this.buildModel.position.set(0, 5, 92);
    this.scene.add(this.buildModel);
  }

  private spawnAIGuide() {
    const guide = new THREE.Group();

    // Body
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(3, 3.5, 10, 5),
      new THREE.MeshStandardMaterial({ color: 0x334155 })
    );
    body.position.y = 5;
    guide.add(body);

    // Head with friendly screen
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(4, 20, 16),
      new THREE.MeshStandardMaterial({ color: 0x475569 })
    );
    head.position.y = 13;
    guide.add(head);

    const face = new THREE.Mesh(
      new THREE.PlaneGeometry(5.4, 3.6),
      new THREE.MeshStandardMaterial({
        color: FACTORY_PALETTE.accentCyan,
        emissive: FACTORY_PALETTE.accentCyan,
        emissiveIntensity: 0.85,
      })
    );
    face.position.set(0, 13, 4);
    guide.add(face);

    // Friendly name tag
    const tag = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 3),
      new THREE.MeshStandardMaterial({
        color: 0x0a0f1c,
        emissive: FACTORY_PALETTE.accentLime,
        emissiveIntensity: 0.4,
      })
    );
    tag.position.set(0, 19, 4.6);
    guide.add(tag);

    guide.position.set(-26, 0, -68);
    this.scene.add(guide);
    this.robots.push(guide);

    // Make the AI guide move along a simple path
    (guide as any).pathTime = 0;
    (guide as any).update = (t: number) => {
      const gt = t * 0.4;
      guide.position.x = -26 + Math.sin(gt) * 18;
      guide.position.z = -68 + Math.cos(gt * 0.7) * 22;
      guide.lookAt(this.camera.position);
    };
  }

  private setupControls() {
    const container = this.opts.container;

    window.addEventListener("keydown", (e) => {
      this.keys.add(e.key.toLowerCase());
      if (e.key.toLowerCase() === "e") {
        this.tryInteract();
      }
      if (e.key === " ") {
        e.preventDefault();
        this.velocity.y = 18;
      }
    });

    window.addEventListener("keyup", (e) => {
      this.keys.delete(e.key.toLowerCase());
    });

    container.addEventListener("click", () => {
      container.requestPointerLock?.();
    });

    // Pointer lock camera control
    let yaw = 0;
    let pitch = 0.3;

    document.addEventListener("mousemove", (e) => {
      if (document.pointerLockElement === container) {
        yaw -= e.movementX * 0.0022;
        pitch = Math.max(-1.35, Math.min(1.35, pitch - e.movementY * 0.0019));

        this.camera.rotation.order = "YXZ";
        this.camera.rotation.y = yaw;
        this.camera.rotation.x = pitch;
      }
    });

    // Store initial rotation for first person
    this.camera.rotation.order = "YXZ";
    this.camera.rotation.y = yaw;
    this.camera.rotation.x = pitch;
  }

  private setupInteractions() {
    const container = this.opts.container;

    container.addEventListener("click", (e) => {
      const rect = container.getBoundingClientRect();
      this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.pointer, this.camera);
      const hits = this.raycaster.intersectObjects(this.scene.children, true);

      for (const hit of hits) {
        const obj = hit.object;
        const found = this.interactables.find((i) => i.obj === obj || i.obj.children.includes(obj));
        if (found) {
          this.activateInteractive(found);
          break;
        }
      }
    });
  }

  private tryInteract() {
    this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
    const hits = this.raycaster.intersectObjects(this.scene.children, true);

    for (const hit of hits) {
      const found = this.interactables.find((i) => i.obj === hit.object || i.obj.children.includes(hit.object));
      if (found) {
        this.activateInteractive(found);
        return;
      }
    }
  }

  private activateInteractive(item: { obj: THREE.Object3D; id: string; type: string }) {
    if (item.type === "machine") {
      this.callbacks.onMachineActivate(item.id);

      // Animate the machine
      const machineGroup = this.machines.get(item.id);
      if (machineGroup) {
        const origY = machineGroup.position.y;
        machineGroup.position.y = origY + 3.5;

        setTimeout(() => {
          if (machineGroup) machineGroup.position.y = origY;
        }, 650);
      }

      // Special actions
      if (item.id === "deploy") {
        this.callbacks.onBuildProgress(100);
      }
    } else if (item.type === "scanner") {
      // Trigger entrance animation
      const entrance = this.zones.get("entrance");
      if (entrance) {
        const left = (entrance as any).leftDoor;
        const right = (entrance as any).rightDoor;
        if (left && right) {
          left.position.x = -38;
          right.position.x = 38;
          setTimeout(() => {
            if (left && right) {
              left.position.x = -20;
              right.position.x = 20;
            }
          }, 1600);
        }
      }
    }
  }

  public updateBuildModel(selections: Record<string, number>) {
    this.buildSelections = selections;

    if (!this.buildModel) return;

    // Clear previous model
    while (this.buildModel.children.length) {
      this.buildModel.remove(this.buildModel.children[0]);
    }

    const businessIdx = selections.business || 0;
    const styleIdx = selections.style || 1;
    const featureCount = [5, 8, 12, 16, 22][selections.features || 2];
    const pageCount = [4, 7, 10, 14, 20][selections.pages || 2];

    // Create a beautiful 3D website model that grows based on selections
    const model = this.buildModel;

    // Base frame
    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(26, 1.8, 18),
      new THREE.MeshStandardMaterial({ color: 0x1e2937, metalness: 0.6 })
    );
    model.add(frame);

    // Screen / content area
    const screenHeight = 14 + Math.min(pageCount * 0.35, 9);
    const screen = new THREE.Mesh(
      new THREE.BoxGeometry(23, screenHeight, 0.8),
      new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        emissive: 0x1e3a8a,
        emissiveIntensity: 0.15,
      })
    );
    screen.position.y = screenHeight / 2 + 1;
    model.add(screen);

    // Dynamic UI elements
    const accent = [FACTORY_PALETTE.accentCyan, FACTORY_PALETTE.accentPink, FACTORY_PALETTE.accentViolet, FACTORY_PALETTE.accentGold][styleIdx % 4];

    // Navbar
    const nav = new THREE.Mesh(
      new THREE.BoxGeometry(23, 2.4, 0.6),
      new THREE.MeshStandardMaterial({ color: accent })
    );
    nav.position.y = screenHeight + 1.8;
    model.add(nav);

    // Feature blocks
    const blockWidth = 5.2;
    for (let i = 0; i < Math.min(featureCount / 2, 7); i++) {
      const block = new THREE.Mesh(
        new THREE.BoxGeometry(blockWidth, 3.2 + (i % 2), 0.6),
        new THREE.MeshStandardMaterial({ color: 0x334155 })
      );
      block.position.set(-9 + i * 4.6, 7, 1.8);
      model.add(block);
    }

    // Hero image placeholder
    const hero = new THREE.Mesh(
      new THREE.BoxGeometry(15, 8, 0.5),
      new THREE.MeshStandardMaterial({
        color: accent,
        transparent: true,
        opacity: 0.75,
      })
    );
    hero.position.set(0, 9, 2.8);
    model.add(hero);

    // Floating stats or cards
    if (selections.ai && selections.ai > 1) {
      const aiCard = new THREE.Mesh(
        new THREE.BoxGeometry(8, 4, 0.6),
        new THREE.MeshStandardMaterial({ color: FACTORY_PALETTE.accentLime })
      );
      aiCard.position.set(12, 12, 3.8);
      model.add(aiCard);
    }

    // Progress indicator on model
    const progressBar = new THREE.Mesh(
      new THREE.BoxGeometry(22, 0.9, 0.4),
      new THREE.MeshBasicMaterial({ color: FACTORY_PALETTE.accentCyan })
    );
    progressBar.position.set(0, 2.6, 9.5);
    progressBar.scale.x = Math.max(0.15, this.buildProgress / 100);
    model.add(progressBar);

    this.callbacks.onBuildProgress(Math.min(100, this.buildProgress + 12));
  }

  public triggerFullBuild(selections: Record<string, number>) {
    this.buildSelections = selections;
    this.buildProgress = 0;

    if (!this.buildModel) return;

    const interval = setInterval(() => {
      this.buildProgress = Math.min(100, this.buildProgress + 18);
      this.callbacks.onBuildProgress(this.buildProgress);

      if (this.buildModel) {
        this.updateBuildModel(selections);
      }

      if (this.buildProgress >= 100) {
        clearInterval(interval);

        // Celebration animation
        if (this.buildModel) {
          const origY = this.buildModel.position.y;
          this.buildModel.position.y = origY + 6;

          setTimeout(() => {
            if (this.buildModel) this.buildModel.position.y = origY;
          }, 700);
        }

        // Show success message in HUD
        this.callbacks.onHud({
          toast: {
            id: Date.now(),
            title: "Website Assembled!",
            sub: "Ready for deployment",
          },
        });
      }
    }, 120);
  }

  private updatePlayerMovement(dt: number) {
    const speed = 42;
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.camera.quaternion);

    forward.y = 0;
    right.y = 0;
    forward.normalize();
    right.normalize();

    const move = new THREE.Vector3();

    if (this.keys.has("w") || this.keys.has("arrowup")) move.add(forward);
    if (this.keys.has("s") || this.keys.has("arrowdown")) move.sub(forward);
    if (this.keys.has("a") || this.keys.has("arrowleft")) move.sub(right);
    if (this.keys.has("d") || this.keys.has("arrowright")) move.add(right);

    if (move.lengthSq() > 0.001) {
      move.normalize().multiplyScalar(speed * dt);
      this.player.add(move);
    }

    // Gravity & jumping
    this.velocity.y -= 58 * dt;
    this.player.y += this.velocity.y * dt;

    if (this.player.y < 8) {
      this.player.y = 8;
      this.velocity.y = 0;
      this.onGround = true;
    }

    // Clamp player inside factory
    this.player.x = Math.max(-195, Math.min(195, this.player.x));
    this.player.z = Math.max(-175, Math.min(195, this.player.z));

    // Update camera follow
    const camTarget = this.player.clone();
    camTarget.y += 14;
    this.camera.position.lerp(camTarget, 0.08);
  }

  private updateZoneDetection() {
    let closestZone = "Entrance";
    let minDist = Infinity;

    ZONES.forEach((zone) => {
      const dx = this.player.x - zone.x;
      const dz = this.player.z - zone.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < minDist && dist < 65) {
        minDist = dist;
        closestZone = zone.name;
      }
    });

    if (closestZone !== this.currentZone) {
      this.currentZone = closestZone;
      this.callbacks.onZoneEnter(closestZone);
    }
  }

  private updateAnimations(t: number) {
    // Animate conveyor belts
    this.conveyorBelts.forEach((belt, i) => {
      if (belt instanceof THREE.Mesh && belt.geometry instanceof THREE.BoxGeometry) {
        belt.position.z = ((belt.position.z + 0.8) % 290) - 145;
      }
    });

    // Animate robots
    this.robots.forEach((robot, idx) => {
      if ((robot as any).update) {
        (robot as any).update(t);
      } else {
        robot.rotation.y = Math.sin(t * 0.6 + idx) * 0.45;
        robot.position.y = 1 + Math.sin(t * 1.6 + idx * 1.4) * 0.5;
      }
    });

    // Animate holograms
    this.holograms.forEach((holo, i) => {
      holo.rotation.y = Math.sin(t * 0.4 + i) * 0.08;
    });

    // Animate AI guide if exists
    this.robots.forEach((r) => {
      if ((r as any).update) (r as any).update(t);
    });

    // Entrance doors idle animation
    const entrance = this.zones.get("entrance");
    if (entrance) {
      const left = (entrance as any).leftDoor;
      const right = (entrance as any).rightDoor;
      if (left && right) {
        const pulse = Math.sin(t * 1.8) * 0.3 + 0.4;
        left.position.x = -20 + pulse;
        right.position.x = 20 - pulse;
      }
    }

    // Update build model if exists
    if (this.buildModel && Object.keys(this.buildSelections).length > 0) {
      this.buildModel.rotation.y = Math.sin(t * 0.35) * 0.08;
    }
  }

  private animate = () => {
    if (this.disposed) return;

    const dt = this.clock.getDelta();
    const t = this.clock.getElapsedTime();

    this.updatePlayerMovement(dt);
    this.updateZoneDetection();
    this.updateAnimations(t);

    // Update controls
    this.controls.update();

    // Camera follow player
    this.camera.position.x = this.player.x + Math.sin(this.camera.rotation.y) * -28;
    this.camera.position.z = this.player.z + Math.cos(this.camera.rotation.y) * -28;
    this.camera.lookAt(this.player.x, this.player.y + 18, this.player.z);

    this.renderer.render(this.scene, this.camera);
    this.raf = requestAnimationFrame(this.animate);
  };

  public dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.renderer.dispose();
    this.controls.dispose();
  }

  public updateBuildProgress(p: number) {
    this.buildProgress = p;
    if (this.buildModel) {
      this.updateBuildModel(this.buildSelections);
    }
  }
}
