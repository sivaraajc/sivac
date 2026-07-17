import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PortfolioService } from '../../services/portfolio.service';
import { LenisService } from '../../services/lenis.service';
import { LucideMail } from '@lucide/angular';
import { SocialIcon } from '../../shared/social-icon/social-icon';

@Component({
  selector: 'app-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideMail, SocialIcon],
  template: `
    <footer class="relative z-10 border-t border-border pb-10 pt-16">
      <div class="mx-auto mb-10 h-px w-[min(1180px,calc(100%-2.5rem))] bg-gradient-to-r from-transparent via-accent/50 to-transparent"></div>
      <div class="container-premium grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p class="font-display text-2xl font-semibold">
            <span class="text-gradient">{{ p().name }}</span><span class="text-accent">.</span>
          </p>
          <p class="mt-3 max-w-md text-sm text-text-muted">{{ p().tagline }}</p>
        </div>
        <div>
          <p class="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-text-dim">Navigate</p>
          <div class="flex flex-col gap-2">
            @for (item of p().nav; track item.id) {
              <a
                [href]="item.href"
                class="text-sm text-text-muted transition hover:text-accent"
                (click)="go($event, item.href)"
              >
                {{ item.label }}
              </a>
            }
          </div>
        </div>
        <div>
          <p class="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-text-dim">Connect</p>
          <div class="flex gap-3">
            <a [href]="p().github" target="_blank" rel="noopener" class="social" aria-label="GitHub">
              <app-social-icon name="github" />
            </a>
            <a [href]="p().linkedin" target="_blank" rel="noopener" class="social" aria-label="LinkedIn">
              <app-social-icon name="linkedin" />
            </a>
            <a [href]="'mailto:' + p().email" class="social" aria-label="Email">
              <svg lucideMail [size]="18"></svg>
            </a>
          </div>
        </div>
      </div>
      <p class="container-premium mt-12 text-xs text-text-dim">
        © {{ year }} {{ p().fullName }}. Crafted with Angular, GSAP & Three.js.
      </p>
    </footer>
  `,
  styles: `
    .social {
      display: inline-flex;
      height: 42px;
      width: 42px;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      border: 1px solid var(--color-border);
      background: rgba(255, 255, 255, 0.03);
      transition: border-color 0.3s ease, transform 0.3s ease, color 0.3s ease;
    }
    .social:hover {
      border-color: rgba(45, 212, 191, 0.45);
      color: #2dd4bf;
      transform: translateY(-2px);
    }
  `,
})
export class Footer {
  private readonly portfolio = inject(PortfolioService);
  private readonly lenis = inject(LenisService);
  readonly year = new Date().getFullYear();
  readonly p = () => this.portfolio.portfolio();

  go(event: Event, href: string): void {
    event.preventDefault();
    this.lenis.scrollTo(href);
  }
}
