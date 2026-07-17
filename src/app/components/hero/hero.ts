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
import { LucideArrowDown, LucideSparkles } from '@lucide/angular';

@Component({
  selector: 'app-hero',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MagneticDirective, LucideArrowDown, LucideSparkles],
  template: `
    <section id="home" class="relative z-10 flex min-h-[100svh] items-center pt-28 pb-16">
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(45,212,191,0.08),transparent_55%)]"></div>
      <div class="container-premium relative grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p data-hero="eyebrow" class="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-accent">
            <svg lucideSparkles [size]="14"></svg>
            Available for opportunities
          </p>
          <h1 data-hero="title" class="font-display text-[clamp(2.8rem,8vw,5.6rem)] font-semibold leading-[0.95] tracking-tight">
            <span class="block text-text-muted">Hello, I'm</span>
            <span class="text-gradient">{{ p().fullName }}</span>
          </h1>
          <p data-hero="subtitle" class="mt-5 max-w-xl text-lg text-text-muted md:text-xl">
            <span class="text-text">{{ p().title }}</span>
            — {{ typed() }}<span class="caret" aria-hidden="true"></span>
          </p>
          <p data-hero="subtitle" class="mt-4 max-w-xl text-base text-text-dim">{{ p().tagline }}</p>

          <div data-hero="cta" class="mt-8 flex flex-wrap gap-3">
            <a class="magnetic-btn btn-primary" href="#projects" appMagnetic (click)="go($event, '#projects')">View Projects</a>
            <a class="magnetic-btn btn-ghost" href="#contact" appMagnetic (click)="go($event, '#contact')">Let's Talk</a>
          </div>
        </div>

        <div data-hero="visual" class="relative mx-auto w-full max-w-md">
          <div class="absolute -inset-6 rounded-[32px] bg-gradient-to-br from-accent/25 via-transparent to-accent-2/20 blur-2xl"></div>
          <div class="card-premium relative overflow-hidden p-3" appMagnetic [strength]="0.08">
            <div class="relative aspect-square overflow-hidden rounded-[16px]">
              <img
                [src]="p().heroAvatarImage"
                [alt]="p().fullName"
                class="h-full w-full object-cover"
                width="640"
                height="640"
                fetchpriority="high"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-70"></div>
            </div>
            <div class="absolute bottom-6 left-6 right-6 rounded-2xl border border-border glass-strong p-4">
              <p class="text-xs uppercase tracking-[0.2em] text-text-dim">Based in</p>
              <p class="font-display text-lg font-medium">{{ p().location }}</p>
            </div>
          </div>
        </div>
      </div>

      <button
        data-hero="scroll"
        type="button"
        class="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-xs uppercase tracking-[0.28em] text-text-dim"
        (click)="go($event, '#about')"
      >
        Scroll
        <span class="flex h-10 w-6 items-start justify-center rounded-full border border-border p-1">
          <span class="scroll-dot h-1.5 w-1.5 rounded-full bg-accent"></span>
        </span>
        <svg lucideArrowDown [size]="14" class="opacity-60"></svg>
      </button>
    </section>
  `,
  styles: `
    .caret {
      display: inline-block;
      width: 2px;
      height: 1.1em;
      margin-left: 2px;
      vertical-align: -0.1em;
      background: #2dd4bf;
      animation: blink 1s step-end infinite;
    }
    .scroll-dot {
      animation: scrollPulse 1.6s ease-in-out infinite;
    }
    @keyframes blink {
      50% { opacity: 0; }
    }
    @keyframes scrollPulse {
      0% { transform: translateY(0); opacity: 1; }
      100% { transform: translateY(14px); opacity: 0; }
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
  private timer?: ReturnType<typeof setTimeout>;

  ngAfterViewInit(): void {
    this.animation.heroTimeline(this.host.nativeElement);
    this.typeLoop();
  }

  ngOnDestroy(): void {
    if (this.timer) clearTimeout(this.timer);
  }

  go(event: Event, href: string): void {
    event.preventDefault();
    this.lenis.scrollTo(href);
  }

  /** ~4s to type / delete a full role phrase */
  private stepDelay(text: string): number {
    return Math.max(10, Math.floor(1000 / Math.max(text.length, 1)));
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
        this.timer = setTimeout(() => this.typeLoop(), 1000);
      } else {
        this.timer = setTimeout(() => this.typeLoop(), delay);
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
        this.timer = setTimeout(() => this.typeLoop(), 400);
      } else {
        this.timer = setTimeout(() => this.typeLoop(), delay);
      }
    }
  }
}
