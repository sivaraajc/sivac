import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter, take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ExperienceModeService } from '../../services/experience-mode.service';

const LOADER_SEEN_KEY = 'port-loader-seen';
const MIN_VISIBLE_MS = 350;
const MAX_VISIBLE_MS = 1400;

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
            <span class="text-gradient">{{ name }}</span>
          </p>
          <p class="mt-4 font-mono text-xs uppercase tracking-[0.35em] text-text-dim">{{ status() }}</p>
          <div class="mt-8 h-[2px] w-56 overflow-hidden rounded-full bg-white/10">
            <div
              class="h-full bg-gradient-to-r from-accent-2 via-accent to-neon transition-[width] duration-150"
              [style.width.%]="progress()"
            ></div>
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
      transition: opacity 0.45s ease, visibility 0.45s ease;
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
      border-top: 2px solid var(--day-accent-2);
      border-right: 2px solid var(--day-accent);
      animation: spinRing 1.1s linear infinite reverse;
    }
    @keyframes spinRing { to { transform: rotate(360deg); } }
    @keyframes gridPulse {
      0%, 100% { opacity: 0.45; }
      50% { opacity: 0.9; }
    }
  `,
})
export class CinematicLoader implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly mode = inject(ExperienceModeService);
  private readonly router = inject(Router);

  readonly visible = signal(true);
  readonly exiting = signal(false);
  readonly progress = signal(0);
  readonly status = signal('loading');
  readonly name = 'Sivaraaj C';

  private startedAt = 0;
  private routeReady = false;
  private windowReady = false;
  private finished = false;
  private rafId = 0;
  private navSub?: Subscription;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.finish();
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.finish();
      return;
    }

    try {
      if (sessionStorage.getItem(LOADER_SEEN_KEY) === '1') {
        this.finish();
        return;
      }
    } catch {
      /* private mode */
    }

    this.startedAt = performance.now();

    if (document.readyState === 'complete') {
      this.windowReady = true;
    } else {
      window.addEventListener('load', () => (this.windowReady = true), { once: true });
    }

    this.navSub = this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd), take(1))
      .subscribe(() => (this.routeReady = true));

    this.tick();
  }

  ngOnDestroy(): void {
    this.navSub?.unsubscribe();
    cancelAnimationFrame(this.rafId);
  }

  private tick = (): void => {
    const elapsed = performance.now() - this.startedAt;
    const ready = this.routeReady && this.windowReady;
    const canDismiss = elapsed >= MIN_VISIBLE_MS && (ready || elapsed >= MAX_VISIBLE_MS);

    const target = ready
      ? 100
      : Math.min(92, Math.floor((elapsed / MAX_VISIBLE_MS) * 92));
    this.progress.set(target);
    this.status.set(ready ? 'ready' : elapsed > 600 ? 'preparing experience' : 'loading');

    if (canDismiss) {
      this.progress.set(100);
      this.status.set('ready');
      setTimeout(() => this.finish(), 120);
      return;
    }

    this.rafId = requestAnimationFrame(this.tick);
  };

  private finish(): void {
    if (this.finished) return;
    this.finished = true;
    cancelAnimationFrame(this.rafId);

    try {
      sessionStorage.setItem(LOADER_SEEN_KEY, '1');
    } catch {
      /* ignore */
    }

    this.exiting.set(true);
    this.mode.setLoaderDone();
    setTimeout(() => this.visible.set(false), 480);
  }
}
