import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { PortfolioService } from '../../services/portfolio.service';
import { SectionHeading } from '../../shared/section-heading/section-heading';
import { RevealDirective } from '../../directives/reveal.directive';
import { TiltDirective } from '../../directives/tilt.directive';

@Component({
  selector: 'app-skills',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeading, RevealDirective, TiltDirective],
  template: `
    <section id="skills" class="section-pad relative z-10">
      <div class="container-premium">
        <app-section-heading
          eyebrow="Capabilities"
          title="Skills & Stack"
          subtitle="Premium skill cards with animated progress rings — organized by the systems I ship every day."
        />

        <div class="mb-8 flex flex-wrap gap-2" appReveal>
          @for (cat of p().skills; track cat.category; let i = $index) {
            <button
              type="button"
              class="rounded-full border px-4 py-2 font-mono text-xs transition"
              [class.border-accent-2]="active() === i"
              [class.bg-accent-2/15]="active() === i"
              [class.text-accent-3]="active() === i"
              [class.border-border]="active() !== i"
              [class.text-text-muted]="active() !== i"
              (click)="active.set(i)"
            >
              {{ cat.category }}
            </button>
          }
        </div>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          @for (skill of p().skills[active()].items; track skill.name; let i = $index) {
            <article
              class="skill-card card-premium gradient-border group relative overflow-hidden p-5"
              appReveal
              appTilt
              [maxTilt]="8"
              [style.animation-delay]="i * 60 + 'ms'"
            >
              <div class="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-accent-2/20 blur-2xl transition group-hover:bg-accent/25"></div>
              <div class="relative flex items-center gap-4">
                <div class="ring-wrap">
                  <svg viewBox="0 0 72 72" class="h-[72px] w-[72px] -rotate-90">
                    <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="5" />
                    <circle
                      cx="36"
                      cy="36"
                      r="30"
                      fill="none"
                      [attr.stroke]="'url(#skillGrad' + i + ')'"
                      stroke-width="5"
                      stroke-linecap="round"
                      [attr.stroke-dasharray]="circumference"
                      [attr.stroke-dashoffset]="offset(skill.level)"
                      class="ring-progress"
                    />
                    <defs>
                      <linearGradient [attr.id]="'skillGrad' + i" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#7c3aed" />
                        <stop offset="50%" stop-color="#06b6d4" />
                        <stop offset="100%" stop-color="#ff4d8d" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span class="ring-label">{{ skill.level }}%</span>
                </div>
                <div>
                  <p class="font-mono text-[10px] uppercase tracking-[0.18em] text-text-dim">{{ p().skills[active()].category }}</p>
                  <h3 class="mt-1 font-display text-lg font-semibold">{{ skill.name }}</h3>
                  <p class="mt-1 text-xs text-text-muted">Mastery · production-ready</p>
                </div>
              </div>
            </article>
          }
        </div>

        <div class="mt-10 overflow-hidden rounded-[22px] border border-border py-5" appReveal>
          <div class="marquee flex w-max gap-8 whitespace-nowrap">
            @for (tech of marquee; track tech) {
              <span class="font-mono text-xl text-text-dim/80">{{ tech }}</span>
              <span class="text-accent-3">◈</span>
            }
            @for (tech of marquee; track tech + '-2') {
              <span class="font-mono text-xl text-text-dim/80">{{ tech }}</span>
              <span class="text-neon">◈</span>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .skill-card {
      animation: floatCard 6s ease-in-out infinite;
    }
    .skill-card:nth-child(2n) { animation-delay: -2s; }
    .skill-card:nth-child(3n) { animation-delay: -3.5s; }
    .ring-wrap {
      position: relative;
      flex-shrink: 0;
    }
    .ring-label {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      font-family: var(--font-mono);
      font-size: 12px;
      color: #06b6d4;
    }
    .ring-progress {
      transition: stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1);
      filter: drop-shadow(0 0 8px rgba(124, 58, 237, 0.55));
    }
    .marquee { animation: marquee 32s linear infinite; }
    @keyframes marquee {
      from { transform: translateX(0); }
      to { transform: translateX(-50%); }
    }
    @keyframes floatCard {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-6px); }
    }
    @media (prefers-reduced-motion: reduce) {
      .skill-card, .marquee { animation: none; }
    }
  `,
})
export class Skills {
  private readonly portfolio = inject(PortfolioService);
  readonly p = () => this.portfolio.portfolio();
  readonly active = signal(0);
  readonly circumference = 2 * Math.PI * 30;
  readonly marquee = [
    'Angular', 'TypeScript', 'Spring Boot', 'FastAPI', 'RxJS', 'PostgreSQL',
    'MongoDB', 'Docker', 'AWS', 'TensorFlow', 'Firebase', 'GSAP', 'Three.js', 'Git',
  ];

  offset(level: number): number {
    return this.circumference * (1 - level / 100);
  }
}
