import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PortfolioService } from '../../services/portfolio.service';
import { SectionHeading } from '../../shared/section-heading/section-heading';
import { RevealDirective } from '../../directives/reveal.directive';
import { LucideQuote } from '@lucide/angular';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeading, RevealDirective, LucideQuote],
  template: `
    <section id="testimonials" class="section-pad relative z-10 overflow-hidden">
      <div class="container-premium">
        <app-section-heading
          eyebrow="Social Proof"
          title="Testimonials"
          subtitle="Voices from collaborators across product and engineering."
        />
      </div>

      <div class="relative mt-2" appReveal>
        <div class="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-bg to-transparent md:w-28"></div>
        <div class="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-bg to-transparent md:w-28"></div>
        <div class="slider flex w-max gap-5 px-6">
          @for (item of doubled; track $index) {
            <article class="card-premium w-[min(86vw,380px)] shrink-0 p-6">
              <svg lucideQuote [size]="28" class="text-accent/70"></svg>
              <p class="mt-4 text-base leading-relaxed text-text-muted">"{{ item.quote }}"</p>
              <div class="mt-6 border-t border-border pt-4">
                <p class="font-display font-medium">{{ item.name }}</p>
                <p class="text-xs text-text-dim">{{ item.role }} · {{ item.company }}</p>
              </div>
            </article>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .slider {
      animation: slide 42s linear infinite;
    }
    .slider:hover {
      animation-play-state: paused;
    }
    @keyframes slide {
      from { transform: translateX(0); }
      to { transform: translateX(-50%); }
    }
    @media (prefers-reduced-motion: reduce) {
      .slider { animation: none; }
    }
  `,
})
export class Testimonials {
  private readonly portfolio = inject(PortfolioService);
  readonly items = () => this.portfolio.portfolio().testimonials;
  readonly doubled = [...this.portfolio.portfolio().testimonials, ...this.portfolio.portfolio().testimonials];
}
