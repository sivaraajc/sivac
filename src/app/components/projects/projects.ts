import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PortfolioService } from '../../services/portfolio.service';
import { SectionHeading } from '../../shared/section-heading/section-heading';
import { RevealDirective } from '../../directives/reveal.directive';
import { TiltDirective } from '../../directives/tilt.directive';
import { LucideActivity } from '@lucide/angular';

@Component({
  selector: 'app-projects',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeading, RevealDirective, TiltDirective, LucideActivity],
  template: `
    <section id="projects" class="section-pad relative z-10">
      <div class="container-premium">
        <app-section-heading
          eyebrow="Product Systems"
          [title]="p().projects.title"
          subtitle="Shipped like production software — browser previews, stack maps, and engineering metrics."
        />

        <div class="mb-8 flex flex-wrap gap-2" appReveal>
          @for (cat of portfolio.categories(); track cat) {
            <button
              type="button"
              class="rounded-full border px-4 py-2 font-mono text-xs transition"
              [class.border-accent]="portfolio.filter() === cat"
              [class.bg-accent/10]="portfolio.filter() === cat"
              [class.text-accent]="portfolio.filter() === cat"
              [class.border-border]="portfolio.filter() !== cat"
              [class.text-text-muted]="portfolio.filter() !== cat"
              (click)="portfolio.setFilter(cat)"
            >
              {{ cat }}
            </button>
          }
        </div>

        <div class="grid gap-5 md:grid-cols-2">
          @for (project of portfolio.filteredProjects(); track project.id) {
            <article class="card-premium gradient-border group overflow-hidden" appReveal appTilt [maxTilt]="6">
              <button type="button" class="block w-full text-left" (click)="portfolio.openProject(project)">
                <div class="browser-chrome">
                  <span class="ide-dot bg-[#ff5f56]"></span>
                  <span class="ide-dot bg-[#ffbd2e]"></span>
                  <span class="ide-dot bg-[#27c93f]"></span>
                  <span class="ml-2 flex-1 truncate rounded-md bg-black/30 px-2 py-1 font-mono text-[10px] text-text-dim">
                    {{ project.link || 'app.internal/' + project.id }}
                  </span>
                  @if (project.status) {
                    <span class="rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[10px] text-accent">{{ project.status }}</span>
                  }
                </div>
                <div class="relative overflow-hidden border-x border-border">
                  <img
                    [src]="project.imgs[0]"
                    [alt]="project.title"
                    class="aspect-[16/10] w-full object-cover transition duration-700 group-hover:scale-105"
                    loading="lazy"
                    width="640"
                    height="400"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-70"></div>
                </div>
                <div class="space-y-3 border border-t-0 border-border p-5">
                  <div class="flex items-start justify-between gap-3">
                    <div>
                      <p class="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">{{ project.category }}</p>
                      <h3 class="mt-1 font-display text-xl font-semibold">{{ project.title }}</h3>
                    </div>
                    <svg lucideActivity [size]="16" class="mt-1 text-accent-2 opacity-70"></svg>
                  </div>
                  <p class="line-clamp-2 text-sm text-text-muted">{{ project.description }}</p>
                  <div class="grid grid-cols-3 gap-2 font-mono text-[10px] text-text-dim">
                    <div class="rounded-lg border border-border bg-surface px-2 py-1.5">
                      <div class="text-text-dim">Lighthouse</div>
                      <div class="text-accent">{{ project.lighthouse ?? '—' }}</div>
                    </div>
                    <div class="rounded-lg border border-border bg-surface px-2 py-1.5">
                      <div class="text-text-dim">Commits</div>
                      <div class="text-accent-2">{{ project.commits ?? '—' }}</div>
                    </div>
                    <div class="rounded-lg border border-border bg-surface px-2 py-1.5">
                      <div class="text-text-dim">Latency</div>
                      <div class="text-accent-3">{{ project.latency ?? 'n/a' }}</div>
                    </div>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    @for (tech of project.technologies.slice(0, 4); track tech) {
                      <span class="rounded-full border border-border bg-surface px-2.5 py-1 font-mono text-[10px] text-text-dim">{{ tech }}</span>
                    }
                  </div>
                </div>
              </button>
            </article>
          }
        </div>
      </div>
    </section>
  `,
})
export class Projects {
  readonly portfolio = inject(PortfolioService);
  readonly p = () => this.portfolio.portfolio();
}
