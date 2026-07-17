import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnInit,
  inject,
  signal,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-reactive-stage',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
      [style.--mx]="mx() + '%'"
      [style.--my]="my() + '%'"
      [style.--scroll]="scroll()"
    >
      <div class="spot"></div>
      <div class="wave"></div>
      <div class="mesh"></div>
      <div class="particles">
        @for (p of particles; track p.id) {
          <span
            class="particle"
            [style.left.%]="p.x"
            [style.top.%]="p.y"
            [style.animation-duration]="p.dur + 's'"
            [style.animation-delay]="p.delay + 's'"
            [style.width.px]="p.size"
            [style.height.px]="p.size"
          ></span>
        }
      </div>
    </div>
  `,
  styles: `
    .spot {
      position: absolute;
      width: 55vmax;
      height: 55vmax;
      left: var(--mx);
      top: var(--my);
      transform: translate(-50%, -50%);
      background: radial-gradient(circle, rgba(124, 58, 237, 0.18), transparent 65%);
      transition: left 0.35s ease, top 0.35s ease;
      filter: blur(8px);
    }
    .wave {
      position: absolute;
      inset: -20%;
      background:
        radial-gradient(circle at 20% 80%, rgba(255, 77, 141, 0.12), transparent 40%),
        radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.12), transparent 42%),
        radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.08), transparent 50%);
      transform: translate3d(0, calc(var(--scroll) * -0.15px), 0);
      will-change: transform;
    }
    .mesh {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(124, 58, 237, 0.06) 1px, transparent 1px),
        linear-gradient(90deg, rgba(6, 182, 212, 0.05) 1px, transparent 1px);
      background-size: 72px 72px;
      mask-image: radial-gradient(ellipse at var(--mx) var(--my), black 10%, transparent 70%);
      transform: perspective(800px) rotateX(calc(var(--scroll) * 0.002deg));
    }
    .particle {
      position: absolute;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(168, 85, 247, 0.9), transparent 70%);
      box-shadow: 0 0 12px rgba(6, 182, 212, 0.45);
      animation: particleFloat ease-in-out infinite;
      opacity: 0.55;
    }
    @keyframes particleFloat {
      0%, 100% { transform: translate3d(0, 0, 0); opacity: 0.35; }
      50% { transform: translate3d(12px, -28px, 0); opacity: 0.85; }
    }
    @media (prefers-reduced-motion: reduce) {
      .particle { animation: none; }
    }
  `,
})
export class ReactiveStage implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  readonly mx = signal(50);
  readonly my = signal(40);
  readonly scroll = signal(0);
  private enabled = false;

  readonly particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: (i * 17 + 7) % 100,
    y: (i * 23 + 11) % 100,
    size: 2 + (i % 4),
    dur: 6 + (i % 5),
    delay: (i % 8) * 0.4,
  }));

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.enabled =
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
      !window.matchMedia('(pointer: coarse)').matches;
  }

  @HostListener('document:pointermove', ['$event'])
  onMove(e: PointerEvent): void {
    if (!this.enabled) return;
    this.mx.set((e.clientX / window.innerWidth) * 100);
    this.my.set((e.clientY / window.innerHeight) * 100);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (!this.enabled) return;
    this.scroll.set(window.scrollY);
  }
}
