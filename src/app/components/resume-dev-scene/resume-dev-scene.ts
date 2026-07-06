import {
  Component,
  ElementRef,
  OnDestroy,
  AfterViewInit,
  viewChild,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const TECH_STACK = ['Angular', 'TypeScript', 'Spring Boot', 'FastAPI', 'Docker', 'PostgreSQL'];

@Component({
  selector: 'app-resume-dev-scene',
  template: `
    <div class="dev-scene-panel" (mousemove)="onPanelMove($event)">
      <div class="panel-glow"></div>
      <div class="panel-grid"></div>

      <div class="panel-header">
        <span class="live-dot"></span>
        <span>Developer Workspace</span>
      </div>

      <canvas #canvas class="dev-canvas"></canvas>

      <div class="panel-footer">
        @for (tech of techStack; track tech) {
          <span class="tech-chip">{{ tech }}</span>
        }
      </div>
    </div>
  `,
  styles: `
    :host { display: block; width: 100%; height: 100%; min-height: 480px; }

    .dev-scene-panel {
      position: relative;
      height: 100%;
      min-height: 480px;
      border: 1px solid rgba(34, 211, 238, 0.18);
      border-radius: 24px;
      background:
        radial-gradient(ellipse at 30% 20%, rgba(34, 211, 238, 0.08), transparent 50%),
        radial-gradient(ellipse at 80% 80%, rgba(99, 102, 241, 0.1), transparent 45%),
        linear-gradient(160deg, rgba(12, 12, 18, 0.95), rgba(6, 6, 10, 0.98));
      overflow: hidden;
    }

    .panel-glow {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 50% 60%, rgba(34, 211, 238, 0.06), transparent 55%);
      pointer-events: none;
      z-index: 1;
    }

    .panel-grid {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(34, 211, 238, 0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(34, 211, 238, 0.04) 1px, transparent 1px);
      background-size: 40px 40px;
      mask-image: radial-gradient(ellipse at center, black 30%, transparent 75%);
      pointer-events: none;
      z-index: 1;
    }

    .panel-header {
      position: absolute;
      top: 1rem;
      left: 1.25rem;
      z-index: 3;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.72rem;
      font-weight: 600;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--text-muted);
    }

    .live-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #22d3ee;
      box-shadow: 0 0 12px rgba(34, 211, 238, 0.9);
      animation: pulse 2s ease-in-out infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(0.85); }
    }

    .dev-canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
    }

    .panel-footer {
      position: absolute;
      bottom: 1.25rem;
      left: 1.25rem;
      right: 1.25rem;
      z-index: 3;
      display: flex;
      flex-wrap: wrap;
      gap: 0.45rem;
      justify-content: center;
    }

    .tech-chip {
      padding: 0.3rem 0.7rem;
      border-radius: 999px;
      font-size: 0.65rem;
      font-weight: 600;
      letter-spacing: 0.06em;
      color: var(--accent-cyan);
      background: rgba(34, 211, 238, 0.08);
      border: 1px solid rgba(34, 211, 238, 0.22);
      backdrop-filter: blur(8px);
    }
  `,
})
export class ResumeDevScene implements AfterViewInit, OnDestroy {
  readonly techStack = TECH_STACK;
  private readonly platformId = inject(PLATFORM_ID);
  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private animationId = 0;
  private clock = new THREE.Clock();
  private mouse = { x: 0, y: 0 };
  private codeLine = 0;
  private keyPulse = 0;

  private root = new THREE.Group();
  private orbitRing?: THREE.Mesh;
  private orbitRing2?: THREE.Mesh;
  private laptopScreen?: THREE.Mesh;
  private screenCanvas?: HTMLCanvasElement;
  private screenTexture?: THREE.CanvasTexture;
  private techOrbs: THREE.Mesh[] = [];
  private particles?: THREE.Points;
  private codeBlocks: THREE.Mesh[] = [];

  private readonly onResize = () => {
    const canvas = this.canvasRef().nativeElement;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h || !this.camera || !this.renderer) return;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.initScene();
    window.addEventListener('resize', this.onResize);
    this.animate();
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('resize', this.onResize);
    this.screenTexture?.dispose();
    this.renderer?.dispose();
  }

  onPanelMove(e: MouseEvent): void {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    this.mouse.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
  }

  private initScene(): void {
    const canvas = this.canvasRef().nativeElement;
    const w = canvas.clientWidth || 500;
    const h = canvas.clientHeight || 480;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 100);
    this.camera.position.set(2.8, 2.4, 3.8);
    this.camera.lookAt(0, 0.6, 0);

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setSize(w, h, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.035).texture;
    pmrem.dispose();

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.35));

    const key = new THREE.DirectionalLight(0xfff8f0, 1.1);
    key.position.set(3, 5, 4);
    this.scene.add(key);

    const cyan = new THREE.PointLight(0x22d3ee, 1.2, 12);
    cyan.position.set(-1, 2, 2);
    this.scene.add(cyan);

    const purple = new THREE.PointLight(0x6366f1, 0.6, 10);
    purple.position.set(2, 1, -2);
    this.scene.add(purple);

    this.buildFloor();
    this.buildDeskSetup();
    this.buildOrbitRings();
    this.buildFloatingCode();
    this.buildTechOrbs();
    this.buildParticles();

    this.scene.add(this.root);
  }

  private buildFloor(): void {
    const grid = new THREE.GridHelper(8, 24, 0x22d3ee, 0x1a3a44);
    grid.position.y = -0.01;
    (grid.material as THREE.Material).opacity = 0.25;
    (grid.material as THREE.Material).transparent = true;
    this.root.add(grid);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 8),
      new THREE.MeshStandardMaterial({
        color: 0x0a0a12,
        roughness: 0.9,
        metalness: 0.1,
        transparent: true,
        opacity: 0.6,
      }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.root.add(floor);
  }

  private buildDeskSetup(): void {
    const desk = new THREE.Group();

    const top = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.06, 1.2),
      new THREE.MeshStandardMaterial({ color: 0x1c1c26, roughness: 0.65, metalness: 0.15 }),
    );
    top.position.set(0, 0.55, 0);
    desk.add(top);

    const legGeo = new THREE.BoxGeometry(0.08, 0.55, 0.08);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x14141c, roughness: 0.8 });
    [[-1, -0.5], [1, -0.5], [-1, 0.5], [1, 0.5]].forEach(([x, z]) => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(x, 0.27, z);
      desk.add(leg);
    });

    const chair = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.05, 0.5),
      new THREE.MeshStandardMaterial({ color: 0x222230, roughness: 0.75 }),
    );
    chair.position.set(-0.9, 0.35, 0.1);
    desk.add(chair);

    const laptopBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.04, 0.48),
      new THREE.MeshStandardMaterial({ color: 0x2a2a36, roughness: 0.45, metalness: 0.35 }),
    );
    laptopBase.position.set(0.15, 0.6, 0.05);
    desk.add(laptopBase);

    this.screenCanvas = document.createElement('canvas');
    this.screenCanvas.width = 512;
    this.screenCanvas.height = 320;
    this.screenTexture = new THREE.CanvasTexture(this.screenCanvas);
    this.screenTexture.colorSpace = THREE.SRGBColorSpace;

    const screenMat = new THREE.MeshStandardMaterial({
      map: this.screenTexture,
      emissive: new THREE.Color(0x22d3ee),
      emissiveIntensity: 0.4,
      roughness: 0.25,
    });

    this.laptopScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.66, 0.4), screenMat);
    this.laptopScreen.position.set(0.15, 0.88, -0.12);
    this.laptopScreen.rotation.x = -0.62;
    desk.add(this.laptopScreen);

    const keyboard = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.02, 0.2),
      new THREE.MeshStandardMaterial({ color: 0x101018, roughness: 0.85 }),
    );
    keyboard.position.set(0.15, 0.62, 0.28);
    desk.add(keyboard);

    const mug = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.07, 0.12, 16),
      new THREE.MeshStandardMaterial({ color: 0x3a3a48, roughness: 0.55 }),
    );
    mug.position.set(-0.55, 0.64, 0.2);
    desk.add(mug);

    const monitor = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.55, 0.04),
      new THREE.MeshStandardMaterial({ color: 0x181820, roughness: 0.5, metalness: 0.3 }),
    );
    monitor.position.set(-0.5, 1.05, -0.35);
    desk.add(monitor);

    const monitorGlow = new THREE.Mesh(
      new THREE.PlaneGeometry(0.82, 0.46),
      new THREE.MeshStandardMaterial({
        color: 0x6366f1,
        emissive: new THREE.Color(0x6366f1),
        emissiveIntensity: 0.35,
        roughness: 0.3,
      }),
    );
    monitorGlow.position.set(-0.5, 1.05, -0.31);
    desk.add(monitorGlow);

    this.drawCodeScreen();
    this.root.add(desk);
  }

  private buildOrbitRings(): void {
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.15,
      wireframe: true,
    });

    this.orbitRing = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.012, 8, 80), ringMat);
    this.orbitRing.position.set(0, 1.1, 0);
    this.orbitRing.rotation.x = Math.PI / 2.5;
    this.root.add(this.orbitRing);

    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.12,
      wireframe: true,
    });
    this.orbitRing2 = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.01, 8, 80), ringMat2);
    this.orbitRing2.position.set(0, 0.8, 0);
    this.orbitRing2.rotation.x = Math.PI / 3;
    this.orbitRing2.rotation.z = 0.4;
    this.root.add(this.orbitRing2);
  }

  private buildFloatingCode(): void {
    const snippets = ['{ }', '</>', '=>', 'async', 'API', 'git'];
    const colors = [0x22d3ee, 0x7ee787, 0x6366f1, 0xfbbf24, 0xf472b6, 0x38bdf8];

    snippets.forEach((text, i) => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 64;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = 'rgba(0,0,0,0)';
      ctx.fillRect(0, 0, 128, 64);
      ctx.font = 'bold 28px monospace';
      ctx.fillStyle = `#${colors[i].toString(16).padStart(6, '0')}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 64, 32);

      const tex = new THREE.CanvasTexture(canvas);
      const mat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.45, 0.22), mat);
      const angle = (i / snippets.length) * Math.PI * 2;
      mesh.position.set(Math.cos(angle) * 1.8, 1.2 + i * 0.15, Math.sin(angle) * 1.8);
      mesh.userData['orbitAngle'] = angle;
      mesh.userData['orbitRadius'] = 1.8;
      mesh.userData['floatY'] = 1.2 + i * 0.15;
      this.codeBlocks.push(mesh);
      this.root.add(mesh);
    });
  }

  private buildTechOrbs(): void {
    TECH_STACK.forEach((_, i) => {
      const geo = new THREE.SphereGeometry(0.06, 16, 16);
      const mat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0x22d3ee : 0x6366f1,
        emissive: i % 2 === 0 ? 0x22d3ee : 0x6366f1,
        emissiveIntensity: 0.5,
        roughness: 0.3,
        metalness: 0.4,
      });
      const orb = new THREE.Mesh(geo, mat);
      const angle = (i / TECH_STACK.length) * Math.PI * 2;
      orb.position.set(Math.cos(angle) * 2.4, 0.9, Math.sin(angle) * 2.4);
      orb.userData['orbitAngle'] = angle;
      orb.userData['orbitRadius'] = 2.4;
      this.techOrbs.push(orb);
      this.root.add(orb);
    });
  }

  private buildParticles(): void {
    const count = 120;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 1] = Math.random() * 3;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: 0x22d3ee,
      size: 0.04,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    this.particles = new THREE.Points(geo, mat);
    this.root.add(this.particles);
  }

  private drawCodeScreen(): void {
    if (!this.screenCanvas) return;
    const ctx = this.screenCanvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, 512, 320);

    const lines = [
      '@Component({ ... })',
      'export class App {',
      '  deploy() {',
      '    return pipeline.run();',
      '  }',
      '}',
    ];

    ctx.font = '20px monospace';
    lines.forEach((line, i) => {
      const y = 48 + i * 40;
      const active = i === this.codeLine % lines.length;
      ctx.fillStyle = active ? '#22d3ee' : '#7ee787';
      ctx.fillText(line, 28, y);
      if (active) {
        ctx.fillStyle = '#22d3ee';
        ctx.fillRect(28 + ctx.measureText(line).width + 6, y - 16, 10, 22);
      }
    });

    this.screenTexture!.needsUpdate = true;
  }

  private animate(): void {
    this.animationId = requestAnimationFrame(() => this.animate());
    const t = this.clock.getElapsedTime();
    const delta = this.clock.getDelta();

    this.camera.position.x += (2.8 + this.mouse.x * 0.35 - this.camera.position.x) * 0.03;
    this.camera.position.y += (2.4 - this.mouse.y * 0.2 - this.camera.position.y) * 0.03;
    this.camera.lookAt(0, 0.65, 0);

    if (this.orbitRing) {
      this.orbitRing.rotation.z = t * 0.25;
    }
    if (this.orbitRing2) {
      this.orbitRing2.rotation.z = -t * 0.18;
    }

    this.codeBlocks.forEach((block, i) => {
      const angle = block.userData['orbitAngle'] + t * 0.3;
      const r = block.userData['orbitRadius'];
      block.position.x = Math.cos(angle) * r;
      block.position.z = Math.sin(angle) * r;
      block.position.y = block.userData['floatY'] + Math.sin(t * 1.5 + i) * 0.08;
      block.lookAt(this.camera.position);
    });

    this.techOrbs.forEach((orb, i) => {
      const angle = orb.userData['orbitAngle'] + t * 0.45;
      const r = orb.userData['orbitRadius'];
      orb.position.x = Math.cos(angle) * r;
      orb.position.z = Math.sin(angle) * r;
      orb.position.y = 0.7 + Math.sin(t * 2 + i * 0.8) * 0.12;
    });

    if (this.particles) {
      this.particles.rotation.y = t * 0.05;
    }

    this.keyPulse += delta;
    if (this.keyPulse > 0.5) {
      this.keyPulse = 0;
      this.codeLine++;
      this.drawCodeScreen();
    }

    if (this.laptopScreen) {
      const mat = this.laptopScreen.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.32 + Math.sin(t * 2) * 0.1;
    }

    this.renderer?.render(this.scene, this.camera);
  }
}
