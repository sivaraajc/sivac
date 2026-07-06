import {
  Component,
  ElementRef,
  OnDestroy,
  AfterViewInit,
  viewChild,
  inject,
  Injector,
  PLATFORM_ID,
  signal,
  afterNextRender,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { PORTFOLIO } from '../../data/portfolio.data';

const SKILLS = [
  { short: 'HTML', color: '#e34f26', glow: '#ff6b4a' },
  { short: 'CSS', color: '#264de4', glow: '#5b7cfa' },
  { short: 'TS', color: '#8b5cf6', glow: '#a78bfa' },
  { short: 'SB', color: '#6db33f', glow: '#84cc16' },
  { short: 'Java', color: '#f89820', glow: '#ffb84d' },
  { short: 'Jenkins', color: '#d33833', glow: '#ef5350' },
  { short: 'Docker', color: '#2496ed', glow: '#4dabf7' },
  { short: 'Python', color: '#3776ab', glow: '#ffd43b' },
];

/** Human male avatars only — Ready Player Me or your own avatar.glb. No robot/soldier models. */
const HUMAN_AVATAR_URLS = [
  PORTFOLIO.avatarModel,
  'https://models.readyplayer.me/6185a4acfb622cf1cdc49348.glb?quality=medium&pose=standing',
  'https://avatars.readyplayer.me/6185a4acfb622cf1cdc49348.glb?quality=medium&pose=standing',
];

type CenterMode = 'video' | 'photo' | 'portrait3d' | 'human3d' | 'initials';

@Component({
  selector: 'app-hero-avatar',
  template: `
    <div class="orbit-wrap" (mousemove)="onMove($event)">
      <div class="orbit-glow"></div>

      <div class="orbit-stage" [style.--mx]="mouseX" [style.--my]="mouseY">
        <div class="skill-ring">
          @for (skill of skills; track skill.short; let i = $index) {
            <div
              class="skill-orb"
              [style.--i]="i"
              [style.--total]="skills.length"
              [style.--c]="skill.color"
              [style.--g]="skill.glow"
            >
              <span>{{ skill.short }}</span>
            </div>
          }
        </div>

        <div class="center-stage">
          @switch (centerMode()) {
            @case ('video') {
              <video
                class="hero-media"
                [src]="data.heroVideo"
                autoplay
                muted
                loop
                playsinline
                (error)="onVideoError()"
              ></video>
            }
            @case ('photo') {
              <div class="hero-photo-wrap" [style.transform]="photoTilt()">
                <img
                  class="hero-avatar"
                  [src]="data.heroAvatarImage"
                  [alt]="data.name"
                  (load)="onAvatarLoad()"
                  (error)="onPhotoError()"
                />
              </div>
            }
            @case ('portrait3d') {
              <canvas #canvas class="hero-media hero-canvas"></canvas>
            }
            @case ('human3d') {
              <canvas #canvas class="hero-media hero-canvas"></canvas>
            }
            @case ('initials') {
              <div class="hero-initials" [style.transform]="photoTilt()">
                <span>{{ initials }}</span>
              </div>
            }
          }
          <div class="center-ring"></div>
        </div>
      </div>

      @if (loading()) {
        <div class="orbit-loader">
          <div class="loader-ring"></div>
        </div>
      }
    </div>
  `,
  styles: `
    :host { display: block; width: 100%; height: 100%; }

    .orbit-wrap {
      position: relative;
      width: min(480px, 92vw);
      height: min(520px, 70vh);
      margin: 0 auto;
    }

    .orbit-glow {
      position: absolute;
      inset: 8% 4%;
      border-radius: 50%;
      background: radial-gradient(ellipse, rgba(99, 102, 241, 0.22), rgba(34, 211, 238, 0.06) 50%, transparent 72%);
      filter: blur(36px);
      pointer-events: none;
      animation: glow-pulse 5s ease-in-out infinite;
    }
    @keyframes glow-pulse {
      0%, 100% { opacity: 0.8; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.04); }
    }

    .orbit-stage {
      position: relative;
      width: 100%;
      height: 100%;
      min-height: 460px;
      display: flex;
      align-items: center;
      justify-content: center;
      transform: rotateX(calc(var(--my) * 4deg)) rotateY(calc(var(--mx) * 6deg));
      transition: transform 0.2s ease-out;
      transform-style: preserve-3d;
    }

    .skill-ring {
      position: absolute;
      width: 100%;
      height: 100%;
      animation: ring-spin 28s linear infinite;
    }
    @keyframes ring-spin { to { transform: rotate(360deg); } }

    .skill-orb {
      --angle: calc((360deg / var(--total)) * var(--i));
      position: absolute;
      top: 50%;
      left: 50%;
      width: 54px;
      height: 54px;
      margin: -27px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle at 35% 30%, var(--g), #14141c 75%);
      border: 2px solid var(--c);
      box-shadow: 0 0 18px color-mix(in srgb, var(--c) 55%, transparent);
      transform: rotate(var(--angle)) translateY(-175px) rotate(calc(-1 * var(--angle)));
      animation: orb-float 3s ease-in-out infinite;
      animation-delay: calc(var(--i) * -0.45s);
    }
    .skill-orb span {
      font-size: 0.62rem;
      font-weight: 800;
      color: #fff;
      letter-spacing: 0.04em;
      text-shadow: 0 1px 4px rgba(0,0,0,0.5);
      animation: counter-spin 28s linear infinite;
    }
    @keyframes counter-spin { to { transform: rotate(-360deg); } }
    @keyframes orb-float {
      0%, 100% { margin-top: -27px; }
      50% { margin-top: -33px; }
    }

    .center-stage {
      position: relative;
      z-index: 2;
      width: 220px;
      height: 220px;
      border-radius: 50%;
      overflow: hidden;
      isolation: isolate;
      perspective: 600px;
      background: radial-gradient(circle at 50% 35%, #2a2a38, #101018);
      box-shadow:
        0 0 0 3px rgba(129, 140, 248, 0.45),
        0 0 40px rgba(99, 102, 241, 0.25),
        0 20px 50px rgba(0, 0, 0, 0.5);
      animation: portrait-float 5s ease-in-out infinite;
    }
    @keyframes portrait-float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-6px); }
    }

    .center-ring {
      position: absolute;
      inset: -6px;
      border-radius: 50%;
      border: 2px solid rgba(34, 211, 238, 0.35);
      pointer-events: none;
      animation: ring-pulse 3s ease-in-out infinite;
    }
    @keyframes ring-pulse {
      0%, 100% { opacity: 0.5; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.02); }
    }

    .hero-media {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
      object-position: center center;
    }

    .hero-photo-wrap {
      width: 100%;
      height: 100%;
      transition: transform 0.2s ease-out;
      transform-style: preserve-3d;
      filter: drop-shadow(0 8px 20px rgba(0, 0, 0, 0.45));
    }

    .hero-avatar {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
      object-position: center center;
      pointer-events: none;
      user-select: none;
    }

    .hero-canvas { object-position: center center; }

    .hero-initials {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle at 50% 35%, #2a2a38, #101018);
      transition: transform 0.2s ease-out;
    }
    .hero-initials span {
      font-family: var(--font-display);
      font-size: 4.5rem;
      font-weight: 800;
      color: #fff;
      letter-spacing: 0.04em;
      text-shadow: 0 4px 24px rgba(99, 102, 241, 0.45);
    }

    .orbit-loader {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 5;
    }
    .loader-ring {
      width: 44px;
      height: 44px;
      border: 2px solid rgba(99, 102, 241, 0.2);
      border-top-color: #818cf8;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    @media (max-width: 1024px) {
      .skill-orb { transform: rotate(var(--angle)) translateY(-150px) rotate(calc(-1 * var(--angle))); }
    }
  `,
})
export class HeroAvatar implements AfterViewInit, OnDestroy {
  readonly data = PORTFOLIO;
  readonly skills = SKILLS;
  readonly initials = PORTFOLIO.name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  private readonly platformId = inject(PLATFORM_ID);
  private readonly injector = inject(Injector);
  private readonly canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('canvas');

  readonly loading = signal(true);
  readonly centerMode = signal<CenterMode>('photo');

  mouseX = 0;
  mouseY = 0;

  private renderer?: THREE.WebGLRenderer;
  private scene?: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;
  private mixer?: THREE.AnimationMixer;
  private character?: THREE.Group;
  private portraitGroup?: THREE.Group;
  private portraitTexture?: THREE.Texture;
  private animationId = 0;
  private clock = new THREE.Clock();

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.pickCenterMode();
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    cancelAnimationFrame(this.animationId);
    this.mixer?.stopAllAction();
    this.portraitTexture?.dispose();
    this.renderer?.dispose();
  }

  onMove(e: MouseEvent): void {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    this.mouseX = (e.clientX - rect.left) / rect.width - 0.5;
    this.mouseY = (e.clientY - rect.top) / rect.height - 0.5;
  }

  photoTilt(): string {
    return `rotateX(${-this.mouseY * 4}deg) rotateY(${this.mouseX * 6}deg)`;
  }

  onVideoError(): void {
    this.tryPhotoThenHuman3d();
  }

  onPhotoError(): void {
    this.startHuman3d();
  }

  onAvatarLoad(): void {
    this.loading.set(false);
  }

  onPortrait3dError(): void {
    cancelAnimationFrame(this.animationId);
    this.animationId = 0;
    this.portraitGroup = undefined;
    this.portraitTexture?.dispose();
    this.portraitTexture = undefined;
    this.renderer?.dispose();
    this.renderer = undefined;
    this.scene = undefined;
    this.camera = undefined;
    this.centerMode.set('photo');
    this.loading.set(false);
  }

  private async pickCenterMode(): Promise<void> {
    if (await this.assetExists(this.data.heroVideo)) {
      this.centerMode.set('video');
      this.loading.set(false);
      return;
    }
    await this.tryPhotoThenHuman3d();
  }

  private async tryPhotoThenHuman3d(): Promise<void> {
    if (await this.assetExists(this.data.heroAvatarImage)) {
      this.centerMode.set('photo');
      this.loading.set(false);
      return;
    }
    this.startHuman3d();
  }

  private startHuman3d(): void {
    this.centerMode.set('human3d');
    afterNextRender(() => this.initHumanGlb(), { injector: this.injector });
  }

  private showInitialsFallback(): void {
    cancelAnimationFrame(this.animationId);
    this.animationId = 0;
    this.mixer?.stopAllAction();
    this.mixer = undefined;
    this.character = undefined;
    this.portraitGroup = undefined;
    this.portraitTexture?.dispose();
    this.portraitTexture = undefined;
    this.renderer?.dispose();
    this.renderer = undefined;
    this.scene = undefined;
    this.camera = undefined;
    this.centerMode.set('initials');
    this.loading.set(false);
  }

  private async assetExists(url: string): Promise<boolean> {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      return res.ok;
    } catch {
      return false;
    }
  }

  private initPortrait3d(): void {
    const canvas = this.canvasRef()?.nativeElement;
    if (!canvas) {
      this.onPortrait3dError();
      return;
    }

    const size = 220;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x101018);

    this.camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
    this.camera.position.set(0, 0, 3.2);

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    this.renderer.setSize(size, size, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const key = new THREE.DirectionalLight(0xfff5ee, 1.1);
    key.position.set(1.5, 1.8, 2.5);
    this.scene.add(key);
    const rim = new THREE.DirectionalLight(0x818cf8, 0.65);
    rim.position.set(-2, 0.5, -1);
    this.scene.add(rim);
    const fill = new THREE.DirectionalLight(0x22d3ee, 0.25);
    fill.position.set(0, -1, 2);
    this.scene.add(fill);

    const loader = new THREE.TextureLoader();
    loader.load(
      this.data.heroPortraitImage,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = this.renderer!.capabilities.getMaxAnisotropy();
        this.portraitTexture = texture;

        this.portraitGroup = new THREE.Group();

        const depth = new THREE.Mesh(
          new THREE.SphereGeometry(1.12, 48, 48),
          new THREE.MeshStandardMaterial({
            color: 0x14141e,
            roughness: 0.85,
            metalness: 0.05,
          }),
        );
        depth.position.z = -0.08;
        this.portraitGroup.add(depth);

        const disc = new THREE.Mesh(
          new THREE.CircleGeometry(1.05, 64),
          new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 0.38,
            metalness: 0.06,
          }),
        );
        disc.position.z = 0.02;
        this.portraitGroup.add(disc);

        const glow = new THREE.Mesh(
          new THREE.RingGeometry(1.02, 1.14, 64),
          new THREE.MeshBasicMaterial({
            color: 0x6366f1,
            transparent: true,
            opacity: 0.18,
            side: THREE.DoubleSide,
          }),
        );
        glow.position.z = 0.01;
        this.portraitGroup.add(glow);

        this.scene!.add(this.portraitGroup);
        this.loading.set(false);
      },
      undefined,
      () => this.onPortrait3dError(),
    );

    this.animate();
  }

  private initHumanGlb(): void {
    const canvas = this.canvasRef()?.nativeElement;
    if (!canvas) {
      this.showInitialsFallback();
      return;
    }

    const size = 220;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    this.camera.position.set(0, 0.15, 2.8);
    this.camera.lookAt(0, 0.1, 0);

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setSize(size, size, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const key = new THREE.DirectionalLight(0xfff8f0, 1.2);
    key.position.set(1, 2, 3);
    this.scene.add(key);

    this.loadHuman(0);
    this.animate();
  }

  private loadHuman(index: number): void {
    if (!this.scene || index >= HUMAN_AVATAR_URLS.length) {
      this.showInitialsFallback();
      return;
    }

    const url = HUMAN_AVATAR_URLS[index];
    const loader = new GLTFLoader();
    let settled = false;

    const finish = (next: () => void) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      next();
    };

    const timer = window.setTimeout(() => finish(() => this.loadHuman(index + 1)), 12_000);

    loader.load(
      url,
      (gltf) =>
        finish(() => {
          if (this.character) this.scene!.remove(this.character);

          this.character = gltf.scene;
          this.character.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              (child as THREE.Mesh).castShadow = true;
            }
          });

          const box = new THREE.Box3().setFromObject(this.character);
          const size = box.getSize(new THREE.Vector3());
          const scale = 1.75 / Math.max(size.y, 0.01);
          this.character.scale.setScalar(scale);
          const center = box.getCenter(new THREE.Vector3());
          this.character.position.sub(center.multiplyScalar(scale));
          this.character.position.y = -0.85;

          this.scene!.add(this.character);
          this.playIdle(gltf.animations);
          this.loading.set(false);
        }),
      undefined,
      () => finish(() => this.loadHuman(index + 1)),
    );
  }

  private playIdle(clips: THREE.AnimationClip[]): void {
    if (!this.character || !clips.length) return;

    this.mixer = new THREE.AnimationMixer(this.character);
    const idle =
      clips.find((c) => /^idle$/i.test(c.name)) ??
      clips.find((c) => /idle|stand|breath/i.test(c.name) && !/walk|run|dance/i.test(c.name));

    if (!idle) return;
    const action = this.mixer.clipAction(idle);
    action.setLoop(THREE.LoopRepeat, Infinity);
    action.timeScale = 0.65;
    action.play();
  }

  private animate(): void {
    this.animationId = requestAnimationFrame(() => this.animate());
    this.mixer?.update(this.clock.getDelta());

    if (this.character) {
      this.character.rotation.y = this.mouseX * 0.4;
    }

    if (this.portraitGroup) {
      this.portraitGroup.rotation.y = this.mouseX * 0.45;
      this.portraitGroup.rotation.x = -this.mouseY * 0.25;
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}
