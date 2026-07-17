import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ExperienceModeService } from '../../services/experience-mode.service';

@Component({
  selector: 'app-cinematic-loader',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <div class="loader" [class.loader-exit]="exiting()" aria-live="polite" aria-label="Loading portfolio">
        <div class="loader-grid"></div>
        <div class="loader-core">
          <div class="logo-ring"></div>
          <p class="font-display text-4xl font-semibold tracking-tight md:text-6xl">
            <span class="text-gradient">{{ name }}</span><span class="text-accent">.</span>
          </p>
          <p class="mt-4 font-mono text-xs uppercase tracking-[0.35em] text-text-dim">{{ status() }}</p>
          <div class="mt-8 h-[2px] w-56 overflow-hidden rounded-full bg-white/10">
            <div class="h-full bg-gradient-to-r from-accent-2 via-accent to-neon transition-[width] duration-150" [style.width.%]="progress()"></div>
          </div>
          <p class="mt-3 font-mono text-[10px] text-accent-3">{{ progress() }}%</p>
        </div>
      </div>
    }
  `,
  styles: `
    .loader {
      position: fixed;
      inset: 0;
      z-index: 100;
      display: grid;
      place-items: center;
      background: #050816;
      transition: opacity 0.7s ease, visibility 0.7s ease;
    }
    .loader-exit {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }
    .loader-grid {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(124, 58, 237, 0.08) 1px, transparent 1px),
        linear-gradient(90deg, rgba(6, 182, 212, 0.06) 1px, transparent 1px);
      background-size: 48px 48px;
      mask-image: radial-gradient(circle at center, black, transparent 75%);
      animation: gridPulse 2.4s ease-in-out infinite;
    }
    .loader-core { position: relative; text-align: center; }
    .logo-ring {
      width: 120px;
      height: 120px;
      margin: 0 auto 1.5rem;
      border-radius: 50%;
      border: 1px solid rgba(168, 85, 247, 0.35);
      box-shadow: 0 0 60px rgba(124, 58, 237, 0.35), inset 0 0 30px rgba(6, 182, 212, 0.15);
      animation: spinRing 2.2s linear infinite;
      position: relative;
    }
    .logo-ring::after {
      content: '';
      position: absolute;
      inset: 18px;
      border-radius: 50%;
      border-top: 2px solid #7c3aed;
      border-right: 2px solid #06b6d4;
      animation: spinRing 1.1s linear infinite reverse;
    }
    @keyframes spinRing { to { transform: rotate(360deg); } }
    @keyframes gridPulse {
      0%, 100% { opacity: 0.45; }
      50% { opacity: 0.9; }
    }
  `,
})
export class CinematicLoader implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly mode = inject(ExperienceModeService);
  readonly visible = signal(true);
  readonly exiting = signal(false);
  readonly progress = signal(0);
  readonly status = signal('boot sequence');
  readonly name = 'Sivaraaj';

  private readonly stages = [
    { at: 12, text: 'mounting workspace' },
    { at: 28, text: 'compiling signals' },
    { at: 46, text: 'hydrating ui systems' },
    { at: 67, text: 'warming webgl' },
    { at: 84, text: 'syncing motion engine' },
    { at: 100, text: 'ready' },
  ];

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.finish();
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.finish();
      return;
    }

    let value = 0;
    const tick = () => {
      value = Math.min(100, value + (value < 70 ? 2.2 : 1.1));
      this.progress.set(Math.floor(value));
      const stage = [...this.stages].reverse().find((s) => value >= s.at);
      if (stage) this.status.set(stage.text);
      if (value >= 100) {
        setTimeout(() => this.finish(), 350);
        return;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  private finish(): void {
    this.exiting.set(true);
    this.mode.setLoaderDone();
    setTimeout(() => this.visible.set(false), 750);
  }
}
