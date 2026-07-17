import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PortfolioService } from '../../services/portfolio.service';
import { SectionHeading } from '../../shared/section-heading/section-heading';
import { RevealDirective } from '../../directives/reveal.directive';
import { TiltDirective } from '../../directives/tilt.directive';
import {
  LucideCode,
  LucideLayoutTemplate,
  LucideServer,
  LucideZap,
  LucideUsers,
  LucideShield,
} from '@lucide/angular';

@Component({
  selector: 'app-services',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SectionHeading,
    RevealDirective,
    TiltDirective,
    LucideCode,
    LucideLayoutTemplate,
    LucideServer,
    LucideZap,
    LucideUsers,
    LucideShield,
  ],
  template: `
    <section id="services" class="section-pad relative z-10">
      <div class="container-premium">
        <app-section-heading
          eyebrow="Offerings"
          title="Services"
          subtitle="High-impact engineering for products that need polish and performance."
        />

        <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          @for (service of p().services; track service.title) {
            <article class="card-premium group relative overflow-hidden p-6" appReveal appTilt [maxTilt]="8">
              <div class="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/10 blur-2xl transition group-hover:bg-accent/25"></div>
              <div class="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-surface text-accent transition group-hover:scale-110 group-hover:border-accent/40">
                @switch (service.icon) {
                  @case ('code') { <svg lucideCode [size]="22"></svg> }
                  @case ('layout') { <svg lucideLayoutTemplate [size]="22"></svg> }
                  @case ('server') { <svg lucideServer [size]="22"></svg> }
                  @case ('zap') { <svg lucideZap [size]="22"></svg> }
                  @case ('users') { <svg lucideUsers [size]="22"></svg> }
                  @case ('shield') { <svg lucideShield [size]="22"></svg> }
                }
              </div>
              <h3 class="font-display text-xl font-semibold">{{ service.title }}</h3>
              <p class="mt-3 text-sm leading-relaxed text-text-muted">{{ service.description }}</p>
            </article>
          }
        </div>
      </div>
    </section>
  `,
})
export class Services {
  private readonly portfolio = inject(PortfolioService);
  readonly p = () => this.portfolio.portfolio();
}
