import {
  Component,
  ElementRef,
  OnDestroy,
  AfterViewInit,
  viewChild,
  inject,
  PLATFORM_ID,
  ChangeDetectionStrategy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';

@Component({
  selector: 'app-scene3d',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<canvas #canvas class="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-50"></canvas>`,
})
export class Scene3d implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  private renderer?: THREE.WebGLRenderer;
  private scene?: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;
  private points?: THREE.Points;
  private mesh?: THREE.Mesh;
  private animationId = 0;
  private mouseX = 0;
  private mouseY = 0;
  private reduced = false;

  private readonly onPointer = (e: PointerEvent) => {
    this.mouseX = (e.clientX / window.innerWidth - 0.5) * 0.6;
    this.mouseY = (e.clientY / window.innerHeight - 0.5) * 0.4;
  };

  private readonly onResize = () => {
    if (!this.camera || !this.renderer) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  };

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (this.reduced || window.innerWidth < 768) return;
    this.initScene();
    window.addEventListener('pointermove', this.onPointer, { passive: true });
    window.addEventListener('resize', this.onResize);
    this.animate();
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('pointermove', this.onPointer);
    window.removeEventListener('resize', this.onResize);
    this.points?.geometry.dispose();
    (this.points?.material as THREE.Material | undefined)?.dispose();
    this.mesh?.geometry.dispose();
    (this.mesh?.material as THREE.Material | undefined)?.dispose();
    this.renderer?.dispose();
  }

  private initScene(): void {
    const canvas = this.canvasRef().nativeElement;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.z = 6;

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    this.renderer.setClearColor(0x000000, 0);

    const count = 900;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: 0x2dd4bf,
      size: 0.025,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
    });
    this.points = new THREE.Points(geometry, material);
    this.scene.add(this.points);

    const torus = new THREE.TorusKnotGeometry(1.1, 0.28, 160, 24);
    const torusMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    this.mesh = new THREE.Mesh(torus, torusMat);
    this.mesh.position.set(2.2, 0.4, -1);
    this.scene.add(this.mesh);
  }

  private animate = (): void => {
    this.animationId = requestAnimationFrame(this.animate);
    if (!this.renderer || !this.scene || !this.camera) return;

    if (this.points) {
      this.points.rotation.y += 0.0008;
      this.points.rotation.x += 0.0003;
    }
    if (this.mesh) {
      this.mesh.rotation.x += 0.002;
      this.mesh.rotation.y += 0.003;
    }

    this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.04;
    this.camera.position.y += (-this.mouseY - this.camera.position.y) * 0.04;
    this.camera.lookAt(0, 0, 0);
    this.renderer.render(this.scene, this.camera);
  };
}
