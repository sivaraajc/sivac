import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PortfolioService } from '../../services/portfolio.service';
import { SectionHeading } from '../../shared/section-heading/section-heading';
import { RevealDirective } from '../../directives/reveal.directive';
import { TiltDirective } from '../../directives/tilt.directive';
import { scaleIn } from '../../animations/portfolio.animations';
import { LucideExternalLink, LucideX } from '@lucide/angular';
import { SocialIcon } from '../../shared/social-icon/social-icon';

@Component({
  selector: 'app-projects',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeading, RevealDirective, TiltDirective, LucideExternalLink, LucideX, SocialIcon],
  animations: [scaleIn],
  template: `
    <section id="projects" class="section-pad relative z-10">
      <div class="container-premium">
        <app-section-heading
          eyebrow="Portfolio"
          [title]="p().projects.title"
          subtitle="Selected products spanning AI, enterprise, and commerce."
        />

        <div class="mb-8 flex flex-wrap gap-2" appReveal>
          @for (cat of portfolio.categories(); track cat) {
            <button
              type="button"
              class="rounded-full border px-4 py-2 text-sm transition"
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

        <div class="columns-1 gap-5 md:columns-2 xl:columns-3">
          @for (project of portfolio.filteredProjects(); track project.id) {
            <article
              class="card-premium group mb-5 break-inside-avoid overflow-hidden"
              appReveal
              appTilt
              [maxTilt]="7"
            >
              <button type="button" class="block w-full text-left" (click)="portfolio.openProject(project)">
                <div class="relative overflow-hidden">
                  <img
                    [src]="project.imgs[0]"
                    [alt]="project.title"
                    class="aspect-[16/10] w-full object-cover transition duration-700 group-hover:scale-110"
                    loading="lazy"
                    width="640"
                    height="400"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent opacity-80 transition group-hover:opacity-95"></div>
                  <div class="absolute inset-0 flex items-end p-5">
                    <div>
                      <p class="text-xs uppercase tracking-[0.2em] text-accent">{{ project.category }}</p>
                      <h3 class="mt-1 font-display text-xl font-semibold">{{ project.title }}</h3>
                    </div>
                  </div>
                </div>
                <div class="space-y-4 p-5">
                  <p class="line-clamp-3 text-sm text-text-muted">{{ project.description }}</p>
                  <div class="flex flex-wrap gap-2">
                    @for (tech of project.technologies.slice(0, 4); track tech) {
                      <span class="rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] text-text-dim">{{ tech }}</span>
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
          class="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
          (click)="portfolio.closeProject()"
          @scaleIn
        >
          <div
            class="card-premium max-h-[90vh] w-full max-w-3xl overflow-y-auto p-0"
            (click)="$event.stopPropagation()"
            role="dialog"
            aria-modal="true"
            [attr.aria-label]="project.title"
          >
            <div class="relative">
              <img [src]="project.imgs[0]" [alt]="project.title" class="max-h-72 w-full object-cover" />
              <button
                type="button"
                class="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border glass-strong"
                aria-label="Close project details"
                (click)="portfolio.closeProject()"
              >
                <svg lucideX [size]="18"></svg>
              </button>
            </div>
            <div class="space-y-4 p-6 md:p-8">
              <div>
                <p class="text-xs uppercase tracking-[0.2em] text-accent">{{ project.category }}</p>
                <h3 class="mt-1 font-display text-3xl font-semibold">{{ project.title }}</h3>
              </div>
              <p class="text-text-muted">{{ project.description }}</p>
              <div class="flex flex-wrap gap-2">
                @for (tech of project.technologies; track tech) {
                  <span class="rounded-full border border-border bg-surface px-3 py-1 text-xs text-text-dim">{{ tech }}</span>
                }
              </div>
              <div class="flex flex-wrap gap-3 pt-2">
                @if (project.link) {
                  <a class="magnetic-btn btn-primary text-sm" [href]="project.link" target="_blank" rel="noopener">
                    <svg lucideExternalLink [size]="16"></svg>
                    Live Demo
                  </a>
                }
                @if (project.github) {
                  <a class="magnetic-btn btn-ghost text-sm" [href]="project.github" target="_blank" rel="noopener">
                    <app-social-icon name="github" [size]="16" />
                    GitHub
                  </a>
                }
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
