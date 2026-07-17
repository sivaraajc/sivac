import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PortfolioService } from '../../services/portfolio.service';
import { SectionHeading } from '../../shared/section-heading/section-heading';
import { RevealDirective } from '../../directives/reveal.directive';
import { TiltDirective } from '../../directives/tilt.directive';
import { scaleIn } from '../../animations/portfolio.animations';
import { LucideExternalLink, LucideX, LucideActivity } from '@lucide/angular';
import { SocialIcon } from '../../shared/social-icon/social-icon';

@Component({
  selector: 'app-projects',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeading, RevealDirective, TiltDirective, LucideExternalLink, LucideX, LucideActivity, SocialIcon],
  animations: [scaleIn],
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

      @if (portfolio.activeProject(); as project) {
        <div
          class="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-3 backdrop-blur-xl md:p-6"
          (click)="portfolio.closeProject()"
          @scaleIn
        >
          <div
            class="ide-window max-h-[92vh] w-full max-w-5xl overflow-y-auto"
            (click)="$event.stopPropagation()"
            role="dialog"
            aria-modal="true"
            [attr.aria-label]="project.title"
            data-lenis-prevent
          >
            <div class="ide-titlebar sticky top-0 z-10">
              <span class="ide-dot bg-[#ff5f56]"></span>
              <span class="ide-dot bg-[#ffbd2e]"></span>
              <span class="ide-dot bg-[#27c93f]"></span>
              <span class="ml-2 font-mono text-[11px] text-text-dim">product://{{ project.id }}</span>
              <button
                type="button"
                class="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-full border border-border"
                aria-label="Close project details"
                data-cursor="Close"
                (click)="portfolio.closeProject()"
              >
                <svg lucideX [size]="16"></svg>
              </button>
            </div>

            <div class="grid lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <div class="browser-chrome rounded-none border-x-0">
                  <span class="ide-dot bg-[#ff5f56]"></span>
                  <span class="ide-dot bg-[#ffbd2e]"></span>
                  <span class="ide-dot bg-[#27c93f]"></span>
                  <span class="ml-2 flex-1 truncate rounded-md bg-black/30 px-2 py-1 font-mono text-[10px] text-text-dim">
                    {{ project.link || 'internal.app/' + project.id }}
                  </span>
                </div>
                <img [src]="project.imgs[0]" [alt]="project.title" class="max-h-[360px] w-full object-cover" />
                @if (project.imgs.length > 1) {
                  <div class="grid grid-cols-3 gap-2 border-t border-border p-3">
                    @for (img of project.imgs.slice(0, 3); track img) {
                      <img [src]="img" [alt]="project.title + ' preview'" class="aspect-video rounded-lg object-cover" loading="lazy" />
                    }
                  </div>
                }
              </div>

              <div class="space-y-5 border-t border-border p-6 lg:border-l lg:border-t-0 lg:p-8">
                <div>
                  <p class="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">{{ project.category }} · {{ project.status }}</p>
                  <h3 class="mt-1 font-display text-3xl font-semibold">{{ project.title }}</h3>
                  <p class="mt-3 text-sm leading-relaxed text-text-muted">{{ project.description }}</p>
                </div>

                <div class="grid grid-cols-2 gap-2 font-mono text-[11px]">
                  <div class="rounded-xl border border-border bg-surface p-3">
                    <div class="text-text-dim">Lighthouse</div>
                    <div class="mt-1 text-xl text-accent">{{ project.lighthouse ?? '—' }}</div>
                  </div>
                  <div class="rounded-xl border border-border bg-surface p-3">
                    <div class="text-text-dim">Commits</div>
                    <div class="mt-1 text-xl text-accent-2">{{ project.commits ?? '—' }}</div>
                  </div>
                  <div class="rounded-xl border border-border bg-surface p-3">
                    <div class="text-text-dim">Latency</div>
                    <div class="mt-1 text-xl text-accent-3">{{ project.latency ?? 'n/a' }}</div>
                  </div>
                  <div class="rounded-xl border border-border bg-surface p-3">
                    <div class="text-text-dim">Stars</div>
                    <div class="mt-1 text-xl text-text">{{ project.stars ?? 0 }}</div>
                  </div>
                </div>

                @if (project.architecture) {
                  <div>
                    <p class="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-text-dim">Architecture</p>
                    <pre class="overflow-x-auto rounded-xl border border-border bg-black/35 p-3 font-mono text-xs text-accent">{{ project.architecture }}</pre>
                  </div>
                }

                <div>
                  <p class="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-text-dim">API flow</p>
                  <div class="flex flex-wrap items-center gap-2 font-mono text-[10px] text-text-muted">
                    <span class="rounded-md border border-border px-2 py-1">Client</span>
                    <span class="text-accent">→</span>
                    <span class="rounded-md border border-border px-2 py-1">API</span>
                    <span class="text-accent">→</span>
                    <span class="rounded-md border border-border px-2 py-1">DB</span>
                    <span class="text-accent">→</span>
                    <span class="rounded-md border border-accent/40 bg-accent/10 px-2 py-1 text-accent">200 OK</span>
                  </div>
                </div>

                <div class="flex flex-wrap gap-2">
                  @for (tech of project.technologies; track tech) {
                    <span class="rounded-full border border-border bg-surface px-3 py-1 font-mono text-[11px] text-text-dim">{{ tech }}</span>
                  }
                </div>

                <div class="flex flex-wrap gap-3 pt-1">
                  @if (project.link) {
                    <a class="magnetic-btn btn-primary text-sm" [href]="project.link" target="_blank" rel="noopener" data-cursor="Live">
                      <svg lucideExternalLink [size]="16"></svg>
                      Live Demo
                    </a>
                  }
                  @if (project.github) {
                    <a class="magnetic-btn btn-ghost text-sm" [href]="project.github" target="_blank" rel="noopener" data-cursor="Repo">
                      <app-social-icon name="github" [size]="16" />
                      GitHub
                    </a>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </section>
  `,
})
export class Projects {
  readonly portfolio = inject(PortfolioService);
  readonly p = () => this.portfolio.portfolio();
}
