import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  inject,
  signal,
} from '@angular/core';
import { PortfolioService } from '../../services/portfolio.service';
import { AnimationService } from '../../services/animation.service';
import { LenisService } from '../../services/lenis.service';
import { MagneticDirective } from '../../directives/magnetic.directive';
import {
  LucideArrowDown,
  LucideDownload,
  LucideFolderGit2,
  LucideMail,
} from '@lucide/angular';

@Component({
  selector: 'app-hero',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MagneticDirective, LucideArrowDown, LucideDownload, LucideFolderGit2, LucideMail],
  template: `
    <section id="home" class="relative z-10 flex min-h-[100svh] items-center overflow-hidden pt-28 pb-20">
      <div
        class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_25%_15%,rgba(124,58,237,0.18),transparent_45%),radial-gradient(ellipse_at_80%_55%,rgba(6,182,212,0.12),transparent_50%),radial-gradient(ellipse_at_50%_90%,rgba(255,77,141,0.08),transparent_45%)]"
      ></div>

      <div class="container-premium relative grid items-center gap-12 xl:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p
            data-hero="eyebrow"
            class="mb-5 inline-flex items-center gap-2 rounded-full border border-accent-2/30 bg-accent-2/10 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-accent-3"
          >
            <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-neon"></span>
            Available for opportunities
          </p>

          <h1 data-hero="title" class="font-display text-[clamp(2.8rem,7.5vw,5.6rem)] font-semibold leading-[0.92] tracking-tight">
            <span class="block text-text-muted">Hello, I'm</span>
            <span class="text-gradient">{{ p().fullName }}</span>
          </h1>

          <p data-hero="subtitle" class="mt-6 max-w-xl text-lg md:text-xl">
            <span class="text-text-muted">I'm a </span>
            <span class="font-display font-semibold text-accent">{{ typed() }}</span>
            <span class="caret" aria-hidden="true"></span>
          </p>

          <p data-hero="subtitle" class="mt-4 max-w-xl text-base leading-relaxed text-text-dim">
            {{ p().tagline }}
          </p>

          <div data-hero="cta" class="mt-9 flex flex-wrap items-center gap-3">
            <a class="magnetic-btn btn-primary" href="#projects" appMagnetic (click)="go($event, '#projects')">
              <svg lucideFolderGit2 [size]="16"></svg>
              View Projects
            </a>
            <a
              class="magnetic-btn btn-ghost"
              [href]="p().cvPath"
              target="_blank"
              rel="noopener"
              appMagnetic
            >
              <svg lucideDownload [size]="16"></svg>
              Download Resume
            </a>
            <a class="magnetic-btn btn-neon" href="#contact" appMagnetic (click)="go($event, '#contact')">
              <svg lucideMail [size]="16"></svg>
              Contact Me
            </a>
          </div>
        </div>

        <div data-hero="visual" class="relative mx-auto flex w-full max-w-md items-center justify-center py-10">
          <div class="pointer-events-none absolute -inset-10 rounded-full bg-gradient-to-br from-accent-2/30 via-accent/15 to-neon/20 blur-3xl"></div>

          <!-- Orbital tech ring -->
          <div class="orbit-ring absolute inset-0" aria-hidden="true">
            @for (tech of p().identity.orbitTechs; track tech; let i = $index) {
              <span
                class="orbit-item"
                [style.animation-duration]="(22 + i * 1.5) + 's'"
                [style.animation-delay]="(-i * 1.4) + 's'"
                [style.--r.px]="orbitRadius(i)"
              >{{ tech }}</span>
            }
          </div>

          <!-- Glowing avatar frame -->
          <div class="avatar-frame relative z-10">
            <div class="avatar-ring"></div>
            <div class="avatar-ring avatar-ring-2"></div>
            <div class="avatar-core">
              <img
                [src]="p().heroAvatarImage"
                [alt]="p().fullName"
                class="h-full w-full object-cover"
                width="280"
                height="280"
              />
            </div>
            <div class="status-pill">
              <span class="pulse-dot"></span>
              {{ p().title }}
            </div>
          </div>
        </div>
      </div>

      <button
        data-hero="scroll"
        type="button"
        class="scroll-indicator absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 font-mono text-[10px] uppercase tracking-[0.32em] text-text-dim"
        (click)="go($event, '#about')"
        aria-label="Scroll to about"
      >
        Scroll
        <span class="scroll-mouse">
          <span class="scroll-wheel"></span>
        </span>
        <svg lucideArrowDown [size]="14" class="opacity-50"></svg>
      </button>
    </section>
  `,
  styles: `
    .caret {
      display: inline-block;
      width: 2px;
      height: 1.05em;
      margin-left: 3px;
      vertical-align: -0.12em;
      background: linear-gradient(#06b6d4, #a855f7);
      animation: blink 1s step-end infinite;
    }
    .avatar-frame {
      width: min(280px, 68vw);
      height: min(280px, 68vw);
    }
    .avatar-core {
      position: relative;
      z-index: 2;
      width: 100%;
      height: 100%;
      overflow: hidden;
      border-radius: 50%;
      border: 2px solid rgba(168, 85, 247, 0.45);
      box-shadow:
        0 0 0 8px rgba(124, 58, 237, 0.12),
        0 0 60px rgba(124, 58, 237, 0.45),
        0 0 100px rgba(6, 182, 212, 0.2);
    }
    .avatar-ring {
      position: absolute;
      inset: -14px;
      border-radius: 50%;
      border: 1px solid transparent;
      border-top-color: #7c3aed;
      border-right-color: #06b6d4;
      animation: spin 8s linear infinite;
    }
    .avatar-ring-2 {
      inset: -28px;
      border-top-color: #ff4d8d;
      border-right-color: #a855f7;
      animation-duration: 12s;
      animation-direction: reverse;
      opacity: 0.7;
    }
    .status-pill {
      position: absolute;
      bottom: -6px;
      left: 50%;
      z-index: 3;
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      transform: translateX(-50%);
      white-space: nowrap;
      border-radius: 999px;
      border: 1px solid rgba(168, 85, 247, 0.35);
      background: rgba(5, 8, 22, 0.88);
      backdrop-filter: blur(12px);
      padding: 0.45rem 0.9rem;
      font-family: var(--font-mono);
      font-size: 10px;
      letter-spacing: 0.06em;
      color: #94a3b8;
    }
    .pulse-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #06b6d4;
      box-shadow: 0 0 12px #06b6d4;
      animation: pulse 1.8s ease-in-out infinite;
    }
    .orbit-item {
      position: absolute;
      left: 50%;
      top: 50%;
      z-index: 1;
      border-radius: 999px;
      border: 1px solid rgba(168, 85, 247, 0.3);
      background: rgba(10, 15, 31, 0.92);
      padding: 0.35rem 0.7rem;
      font-family: var(--font-mono);
      font-size: 10px;
      color: #06b6d4;
      box-shadow: 0 0 24px rgba(124, 58, 237, 0.2);
      animation: orbit linear infinite;
      white-space: nowrap;
    }
    .scroll-mouse {
      display: flex;
      width: 22px;
      height: 34px;
      align-items: flex-start;
      justify-content: center;
      border-radius: 999px;
      border: 1px solid rgba(168, 85, 247, 0.4);
      padding-top: 6px;
    }
    .scroll-wheel {
      width: 3px;
      height: 7px;
      border-radius: 999px;
      background: #a855f7;
      animation: wheel 1.6s ease-in-out infinite;
    }
    @keyframes blink { 50% { opacity: 0; } }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(0.85); }
    }
    @keyframes orbit {
      from { transform: translate(-50%, -50%) rotate(0deg) translateX(var(--r, 170px)) rotate(0deg); }
      to { transform: translate(-50%, -50%) rotate(360deg) translateX(var(--r, 170px)) rotate(-360deg); }
    }
    @keyframes wheel {
      0% { opacity: 1; transform: translateY(0); }
      100% { opacity: 0; transform: translateY(10px); }
    }
    @media (prefers-reduced-motion: reduce) {
      .caret, .avatar-ring, .orbit-item, .scroll-wheel, .pulse-dot { animation: none; }
    }
  `,
})
export class Hero implements AfterViewInit, OnDestroy {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly portfolio = inject(PortfolioService);
  private readonly animation = inject(AnimationService);
  private readonly lenis = inject(LenisService);

  readonly p = () => this.portfolio.portfolio();
  readonly typed = signal('');

  private roleIndex = 0;
  private charIndex = 0;
  private deleting = false;
  private timers: ReturnType<typeof setTimeout>[] = [];

  ngAfterViewInit(): void {
    this.animation.heroTimeline(this.host.nativeElement);
    this.typeLoop();
  }

  ngOnDestroy(): void {
    this.timers.forEach(clearTimeout);
  }

  go(event: Event, href: string): void {
    event.preventDefault();
    this.lenis.scrollTo(href);
  }

  orbitRadius(i: number): number {
    return 155 + (i % 4) * 22;
  }

  private later(fn: () => void, ms: number): void {
    this.timers.push(setTimeout(fn, ms));
  }

  private stepDelay(text: string): number {
    return Math.max(80, Math.floor(2800 / Math.max(text.length, 1)));
  }

  private typeLoop(): void {
    const roles = this.p().roles;
    const current = roles[this.roleIndex] ?? '';
    const delay = this.stepDelay(current);

    if (!this.deleting && this.charIndex <= current.length) {
      this.typed.set(current.slice(0, this.charIndex));
      this.charIndex++;
      if (this.charIndex > current.length) {
        this.deleting = true;
        this.later(() => this.typeLoop(), 2200);
      } else {
        this.later(() => this.typeLoop(), delay);
      }
      return;
    }

    if (this.deleting && this.charIndex >= 0) {
      this.typed.set(current.slice(0, this.charIndex));
      this.charIndex--;
      if (this.charIndex < 0) {
        this.deleting = false;
        this.roleIndex = (this.roleIndex + 1) % roles.length;
        this.charIndex = 0;
        this.later(() => this.typeLoop(), 400);
      } else {
        this.later(() => this.typeLoop(), Math.max(40, delay * 0.45));
      }
    }
  }
}
