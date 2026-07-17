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
          title="Skills & Toolkit"
          subtitle="Interactive mastery across frontend, backend, and delivery systems."
        />

        <div class="mb-8 flex flex-wrap gap-2" appReveal>
          @for (cat of p().skills; track cat.category; let i = $index) {
            <button
              type="button"
              class="rounded-full border px-4 py-2 text-sm transition"
              [class.border-accent]="active() === i"
              [class.bg-accent/10]="active() === i"
              [class.text-accent]="active() === i"
              [class.border-border]="active() !== i"
              [class.text-text-muted]="active() !== i"
              (click)="active.set(i)"
            >
              {{ cat.category }}
            </button>
          }
        </div>

        <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          @for (skill of p().skills[active()].items; track skill.name) {
            <div class="card-premium group p-5" appReveal appTilt [maxTilt]="8">
              <div class="mb-5 flex items-center justify-between gap-3">
                <h3 class="font-display text-lg font-medium">{{ skill.name }}</h3>
                <div class="relative h-14 w-14">
                  <svg viewBox="0 0 36 36" class="h-14 w-14 -rotate-90">
                    <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="2.5" />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.5"
                      fill="none"
                      stroke="url(#skillGrad)"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      [attr.stroke-dasharray]="circumference"
                      [attr.stroke-dashoffset]="offset(skill.level)"
                      class="transition-[stroke-dashoffset] duration-1000 ease-out"
                    />
                    <defs>
                      <linearGradient id="skillGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stop-color="#2dd4bf" />
                        <stop offset="100%" stop-color="#38bdf8" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span class="absolute inset-0 flex items-center justify-center text-xs font-semibold">{{ skill.level }}%</span>
                </div>
              </div>
              <div class="h-1.5 overflow-hidden rounded-full bg-white/5">
                <div
                  class="h-full rounded-full bg-gradient-to-r from-accent to-accent-2 transition-all duration-1000"
                  [style.width.%]="skill.level"
                ></div>
              </div>
            </div>
          }
        </div>

        <div class="mt-10 overflow-hidden rounded-[20px] border border-border py-4" appReveal>
          <div class="marquee flex w-max gap-8 whitespace-nowrap">
            @for (tech of marquee; track tech) {
              <span class="font-display text-2xl font-medium text-text-dim/80">{{ tech }}</span>
              <span class="text-accent">◆</span>
            }
            @for (tech of marquee; track tech + '-2') {
              <span class="font-display text-2xl font-medium text-text-dim/80">{{ tech }}</span>
              <span class="text-accent">◆</span>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .marquee {
      animation: marquee 28s linear infinite;
    }
    @keyframes marquee {
      from { transform: translateX(0); }
      to { transform: translateX(-50%); }
    }
  `,
})
export class Skills {
  private readonly portfolio = inject(PortfolioService);
  readonly p = () => this.portfolio.portfolio();
  readonly active = signal(0);
  readonly circumference = 2 * Math.PI * 15.5;
  readonly marquee = [
    'Angular',
    'TypeScript',
    'Spring Boot',
    'FastAPI',
    'RxJS',
    'PostgreSQL',
    'MongoDB',
    'GSAP',
    'Three.js',
    'Docker',
    'WebSockets',
    'Tailwind',
  ];

  offset(level: number): number {
    return this.circumference - (level / 100) * this.circumference;
  }
}
