import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  viewChild,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';

@Component({
  selector: 'app-scene3d',
  template: `<canvas #canvas class="scene-canvas"></canvas>`,
  styles: `
    :host {
      position: fixed;
      inset: 0;
      z-index: 0;
      pointer-events: none;
    }
    .scene-canvas {
      width: 100%;
      height: 100%;
      display: block;
      opacity: 0.4;
    }
  `,
})
export class Scene3d implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private animationId = 0;
  private scrollY = 0;
  private particles!: THREE.Points;

  private readonly onScroll = () => {
    this.scrollY = window.scrollY;
  };

  private readonly onResize = () => {
    if (!this.camera || !this.renderer) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.initScene();
    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('resize', this.onResize);
    this.animate();
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onResize);
    this.renderer?.dispose();
  }

  private initScene(): void {
    const canvas = this.canvasRef().nativeElement;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);

    const count = 600;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 40;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.particles = new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        color: 0x22d3ee,
        size: 0.025,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    this.scene.add(this.particles);
  }

  private animate(): void {
    this.animationId = requestAnimationFrame(() => this.animate());
    const time = performance.now() * 0.001;
    const scrollFactor = this.scrollY * 0.0005;

    this.particles.rotation.y = time * 0.015 + scrollFactor;
    this.particles.position.y = -scrollFactor * 2;

    this.renderer.render(this.scene, this.camera);
  }
}
