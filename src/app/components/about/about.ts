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
          subtitle="Senior Software Engineer crafting scalable Angular systems with premium craft."
        />

        <div class="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div class="card-premium relative overflow-hidden p-3" appReveal="left">
            <img
              [src]="p().avatarImage"
              [alt]="p().fullName"
              class="aspect-[4/5] w-full rounded-[16px] object-cover"
              loading="lazy"
              width="520"
              height="650"
            />
            <div class="absolute bottom-6 left-6 right-6 rounded-2xl border border-border glass-strong p-4">
              <p class="font-display text-lg">{{ p().title }}</p>
              <p class="text-sm text-text-muted">{{ p().location }}</p>
            </div>
          </div>

          <div class="space-y-5" appReveal="right">
            @for (para of p().about.paragraphs; track $index) {
              <p class="text-base leading-relaxed text-text-muted md:text-lg" [innerHTML]="safe(para)"></p>
            }

            <div class="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              @for (stat of p().stats; track stat.label) {
                <div class="card-premium p-4 text-center">
                  <p class="font-display text-3xl font-semibold text-accent">
                    <span [appCountUp]="stat.value" [suffix]="stat.suffix">0</span>
                  </p>
                  <p class="mt-1 text-xs uppercase tracking-[0.16em] text-text-dim">{{ stat.label }}</p>
                </div>
              }
            </div>

            <div class="card-premium mt-6 p-5" appReveal>
              <p class="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-accent">Education</p>
              <p class="font-display text-lg font-medium">{{ p().education.degree }}</p>
              <p class="text-sm text-text-muted">{{ p().education.school }}</p>
              <p class="mt-1 text-xs text-text-dim">{{ p().education.date }} · {{ p().education.gpa }}</p>
            </div>
          </div>
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
