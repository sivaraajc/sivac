import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PortfolioService } from '../../services/portfolio.service';
import { SectionHeading } from '../../shared/section-heading/section-heading';
import { RevealDirective } from '../../directives/reveal.directive';

@Component({
  selector: 'app-experience',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeading, RevealDirective],
  template: `
    <section id="experience" class="section-pad relative z-10">
      <div class="container-premium">
        <app-section-heading
          eyebrow="Career Timeline"
          title="Experience"
          subtitle="A glowing vertical timeline of production impact — architecture, performance, and leadership."
        />

        <div class="timeline relative ml-3 pl-8 md:ml-4 md:pl-12">
          <div class="timeline-line" aria-hidden="true"></div>
          @for (job of p().experience.jobs; track job.tab; let i = $index) {
            <article class="relative mb-10 last:mb-0" [appReveal]="i % 2 === 0 ? 'left' : 'right'">
              <span class="timeline-dot"></span>
              <div class="card-premium gradient-border p-6 md:p-8">
                <div class="mb-3 font-mono text-[10px] text-accent">
                  {{ i === 0 ? '● LIVE · CURRENT ROLE' : '● SHIPPED MILESTONE' }}
                </div>
                <div class="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p class="font-mono text-xs uppercase tracking-[0.22em] text-accent-3">{{ job.tab }}</p>
                    <h3 class="mt-2 font-display text-2xl font-semibold">{{ job.title }}</h3>
                    <p class="mt-1 text-sm text-text-muted">{{ job.company }}</p>
                  </div>
                  <span class="rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-text-dim">{{ job.date }}</span>
                </div>
                <ul class="mt-5 space-y-3">
                  @for (item of job.description; track item) {
                    <li class="flex gap-3 text-sm leading-relaxed text-text-muted md:text-base">
                      <span class="mt-1 shrink-0 font-mono text-[10px] text-accent-2">▸</span>
                      <span>{{ item }}</span>
                    </li>
                  }
                </ul>
              </div>
            </article>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .timeline-line {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 2px;
      background: linear-gradient(180deg, #7c3aed, #06b6d4, #ff4d8d);
      box-shadow: 0 0 18px rgba(124, 58, 237, 0.55);
      border-radius: 999px;
    }
    .timeline-dot {
      position: absolute;
      left: -2.55rem;
      top: 1.4rem;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      border: 2px solid #a855f7;
      background: #050816;
      box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.2), 0 0 24px rgba(6, 182, 212, 0.55);
      animation: floatDot 3s ease-in-out infinite;
    }
    @media (min-width: 768px) {
      .timeline-dot { left: -3.55rem; }
    }
    @keyframes floatDot {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-4px); }
    }
  `,
})
export class Experience {
  private readonly portfolio = inject(PortfolioService);
  readonly p = () => this.portfolio.portfolio();
}
