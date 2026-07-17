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
          eyebrow="Career"
          title="Experience"
          subtitle="Milestones across enterprise Angular platforms and full-stack delivery."
        />

        <div class="relative ml-3 border-l border-border pl-8 md:ml-4 md:pl-12">
          @for (job of p().experience.jobs; track job.tab; let i = $index) {
            <article class="relative mb-10 last:mb-0" [appReveal]="i % 2 === 0 ? 'left' : 'right'">
              <span class="absolute -left-[2.55rem] top-2 h-4 w-4 rounded-full border-2 border-accent bg-bg shadow-[0_0_20px_rgba(45,212,191,0.55)] md:-left-[3.55rem]"></span>
              <div class="card-premium p-6 md:p-8">
                <div class="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.22em] text-accent">{{ job.tab }}</p>
                    <h3 class="mt-2 font-display text-2xl font-semibold">{{ job.title }}</h3>
                    <p class="mt-1 text-sm text-text-muted">{{ job.company }}</p>
                  </div>
                  <span class="rounded-full border border-border bg-surface px-3 py-1 text-xs text-text-dim">{{ job.date }}</span>
                </div>
                <ul class="mt-5 space-y-3">
                  @for (item of job.description; track item) {
                    <li class="flex gap-3 text-sm leading-relaxed text-text-muted md:text-base">
                      <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-2"></span>
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
})
export class Experience {
  private readonly portfolio = inject(PortfolioService);
  readonly p = () => this.portfolio.portfolio();
}
