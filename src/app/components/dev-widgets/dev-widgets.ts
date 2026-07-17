import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { PortfolioService } from '../../services/portfolio.service';
import { SectionHeading } from '../../shared/section-heading/section-heading';
import { RevealDirective } from '../../directives/reveal.directive';
import { CountUpDirective } from '../../directives/count-up.directive';
import { LucideActivity, LucideCoffee, LucideClock, LucideGitCommitHorizontal } from '@lucide/angular';

@Component({
  selector: 'app-dev-widgets',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SectionHeading,
    RevealDirective,
    CountUpDirective,
    LucideActivity,
    LucideCoffee,
    LucideClock,
    LucideGitCommitHorizontal,
  ],
  template: `
    <section id="lab" class="section-pad relative z-10">
      <div class="container-premium">
        <app-section-heading
          eyebrow="Engineer Lab"
          title="Developer Widgets"
          subtitle="A GitHub-meets-dashboard snapshot of craft, consistency, and shipping velocity."
        />

        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          @for (card of cards; track card.label) {
            <article class="card-premium p-5" appReveal>
              <p class="font-mono text-[10px] uppercase tracking-[0.2em] text-text-dim">{{ card.label }}</p>
              <p class="mt-3 font-display text-3xl font-semibold text-accent">
                <span [appCountUp]="card.value" [suffix]="card.suffix">0</span>
              </p>
              <p class="mt-1 text-xs text-text-muted">{{ card.hint }}</p>
            </article>
          }
        </div>

        <div class="mt-5 grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
          <article class="card-premium p-5" appReveal>
            <div class="mb-4 flex items-center justify-between">
              <p class="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-accent">
                <svg lucideGitCommitHorizontal [size]="14"></svg>
                Contribution heatmap
              </p>
              <span class="font-mono text-[10px] text-text-dim">last 12 weeks</span>
            </div>
            <div class="flex flex-wrap gap-1">
              @for (cell of heatmap(); track $index) {
                <span
                  class="heatmap-cell"
                  [style.background]="heatColor(cell)"
                  [attr.title]="cell + ' contributions'"
                ></span>
              }
            </div>
            <div class="mt-4 flex items-center gap-2 font-mono text-[10px] text-text-dim">
              Less
              <span class="heatmap-cell bg-[#122033]"></span>
              <span class="heatmap-cell bg-[#134e4a]"></span>
              <span class="heatmap-cell bg-[#0f766e]"></span>
              <span class="heatmap-cell bg-[#22d3ee]"></span>
              More
            </div>
          </article>

          <article class="card-premium space-y-4 p-5" appReveal>
            <div class="flex items-center justify-between">
              <p class="flex items-center gap-2 font-mono text-xs text-accent">
                <svg lucideClock [size]="14"></svg>
                Local time
              </p>
              <span class="font-mono text-lg text-text">{{ time() }}</span>
            </div>
            <div class="flex items-center justify-between border-t border-border pt-4">
              <p class="flex items-center gap-2 font-mono text-xs text-accent-2">
                <svg lucideActivity [size]="14"></svg>
                Coding streak
              </p>
              <span class="font-display text-2xl text-text">{{ w().streak }} days</span>
            </div>
            <div class="flex items-center justify-between border-t border-border pt-4">
              <p class="flex items-center gap-2 font-mono text-xs text-accent-3">
                <svg lucideCoffee [size]="14"></svg>
                Coffee counter
              </p>
              <span class="font-display text-2xl text-text">{{ w().coffee }}</span>
            </div>
            <a
              class="mt-2 inline-flex rounded-xl border border-border bg-surface px-3 py-2 font-mono text-xs text-text-muted transition hover:border-accent/40 hover:text-accent"
              [href]="p().github"
              target="_blank"
              rel="noopener"
            >
              View GitHub activity →
            </a>
          </article>
        </div>
      </div>
    </section>
  `,
})
export class DevWidgets implements OnInit {
  private readonly portfolio = inject(PortfolioService);
  readonly p = () => this.portfolio.portfolio();
  readonly w = () => this.p().widgets;
  readonly time = signal('');
  readonly heatmap = signal<number[]>([]);

  readonly cards = [
    { label: 'years', value: this.w().years, suffix: '+', hint: 'Production engineering' },
    { label: 'projects', value: this.w().projects, suffix: '+', hint: 'Shipped systems' },
    { label: 'technologies', value: this.w().technologies, suffix: '', hint: 'Mastered tools' },
    { label: 'contributions', value: this.w().contributions, suffix: '+', hint: 'Git commits / PRs' },
  ];

  ngOnInit(): void {
    this.heatmap.set(Array.from({ length: 84 }, () => Math.floor(Math.random() * 5)));
    this.tick();
    setInterval(() => this.tick(), 1000);
  }

  heatColor(level: number): string {
    return ['#122033', '#134e4a', '#0f766e', '#14b8a6', '#22d3ee'][level] ?? '#122033';
  }

  private tick(): void {
    this.time.set(
      new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Asia/Kolkata',
      }),
    );
  }
}
