import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PortfolioService } from '../../services/portfolio.service';
import { SectionHeading } from '../../shared/section-heading/section-heading';
import { RevealDirective } from '../../directives/reveal.directive';
import { CountUpDirective } from '../../directives/count-up.directive';

@Component({
  selector: 'app-about',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeading, RevealDirective, CountUpDirective],
  template: `
    <section id="about" class="section-pad relative z-10">
      <div class="container-premium">
        <app-section-heading
          eyebrow="Introduction"
          title="About Me"
          subtitle="Craft, systems thinking, and a career aimed at shipping exceptional software."
        />

        <div class="grid items-start gap-6 lg:grid-cols-2">
          <div class="space-y-5" appReveal="left">
            @for (para of p().about.paragraphs; track $index) {
              <p class="text-base leading-relaxed text-text-muted md:text-lg" [innerHTML]="safe(para)"></p>
            }
          </div>

          <div class="grid gap-4 sm:grid-cols-2" appReveal="right">
            <article class="card-premium gradient-border p-5 sm:col-span-2">
              <p class="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-accent">Experience</p>
              <p class="font-display text-xl font-semibold">{{ p().title }}</p>
              <p class="mt-1 text-sm text-text-muted">{{ p().experience.jobs[0].company }}</p>
              <p class="mt-2 text-xs text-text-dim">{{ p().experience.jobs[0].date }} · {{ p().location }}</p>
            </article>

            <article class="card-premium gradient-border p-5">
              <p class="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-accent-3">Education</p>
              <p class="font-display text-base font-medium leading-snug">{{ p().education.degree }}</p>
              <p class="mt-2 text-xs text-text-muted">{{ p().education.school }}</p>
              <p class="mt-1 text-xs text-text-dim">{{ p().education.gpa }}</p>
            </article>

            <article class="card-premium gradient-border p-5">
              <p class="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-neon">Career Goals</p>
              <p class="text-sm leading-relaxed text-text-muted">
                Lead high-impact frontend architecture, mentor engineers, and build AI-augmented products that feel cinematic and ship reliably.
              </p>
            </article>
          </div>
        </div>

        <div class="mt-10 grid grid-cols-2 gap-4 md:grid-cols-5" appReveal>
          @for (stat of p().stats; track stat.label) {
            <div class="card-premium gradient-border p-4 text-center">
              <p class="font-display text-3xl font-semibold text-gradient md:text-4xl">
                <span [appCountUp]="stat.value" [suffix]="stat.suffix">0</span>
              </p>
              <p class="mt-2 text-[10px] uppercase tracking-[0.14em] text-text-dim">{{ stat.label }}</p>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class About {
  private readonly portfolio = inject(PortfolioService);
  private readonly sanitizer = inject(DomSanitizer);
  readonly p = () => this.portfolio.portfolio();

  safe(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
