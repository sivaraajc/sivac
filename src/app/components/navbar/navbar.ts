import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  HostListener,
} from '@angular/core';
import { PortfolioService } from '../../services/portfolio.service';
import { AnimationService } from '../../services/animation.service';
import { LenisService } from '../../services/lenis.service';
import { MagneticDirective } from '../../directives/magnetic.directive';
import { LucideMenu, LucideX, LucideDownload } from '@lucide/angular';
import { fadeIn } from '../../animations/portfolio.animations';

@Component({
  selector: 'app-navbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MagneticDirective, LucideMenu, LucideX, LucideDownload],
  animations: [fadeIn],
  template: `
    <header
      class="fixed inset-x-0 top-0 z-[65] transition-all duration-500"
      [class.py-4]="!scrolled()"
      [class.py-2]="scrolled()"
    >
      <div
        class="container-premium flex items-center justify-between rounded-[20px] px-4 py-3 transition-all duration-500 md:px-6"
        [class.glass-strong]="scrolled()"
        [class.border]="scrolled()"
        [class.border-border]="scrolled()"
      >
        <a
          href="#home"
          class="font-display text-lg font-semibold tracking-tight md:text-xl"
          (click)="go($event, '#home')"
        >
          <span class="text-gradient">{{ portfolio.portfolio().name }}</span><span class="text-accent">.</span>
        </a>

        <nav class="hidden items-center gap-1 lg:flex" aria-label="Primary">
          @for (item of portfolio.portfolio().nav; track item.id) {
            <a
              [href]="item.href"
              class="relative px-3 py-2 text-sm text-text-muted transition-colors hover:text-text"
              [class.!text-text]="animation.activeSection() === item.id"
              (click)="go($event, item.href)"
            >
              {{ item.label }}
              <span
                class="absolute inset-x-3 -bottom-0.5 h-px origin-left bg-gradient-to-r from-accent to-accent-2 transition-transform duration-300"
                [class.scale-x-100]="animation.activeSection() === item.id"
                [class.scale-x-0]="animation.activeSection() !== item.id"
              ></span>
            </a>
          }
        </nav>

        <div class="flex items-center gap-2">
          <a
            class="magnetic-btn btn-primary hidden text-sm sm:inline-flex"
            [href]="portfolio.portfolio().cvPath"
            target="_blank"
            rel="noopener"
            appMagnetic
          >
            <svg lucideDownload [size]="16"></svg>
            Resume
          </a>
          <button
            type="button"
            class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-text lg:hidden"
            [attr.aria-expanded]="open()"
            aria-controls="mobile-nav"
            aria-label="Toggle menu"
            (click)="open.set(!open())"
          >
            @if (open()) {
              <svg lucideX [size]="20"></svg>
            } @else {
              <svg lucideMenu [size]="20"></svg>
            }
          </button>
        </div>
      </div>

      @if (open()) {
        <div
          id="mobile-nav"
          class="container-premium mt-2 rounded-[20px] border border-border glass-strong p-4 lg:hidden"
          @fadeIn
        >
          <div class="flex flex-col gap-1">
            @for (item of portfolio.portfolio().nav; track item.id) {
              <a
                [href]="item.href"
                class="rounded-xl px-4 py-3 text-base text-text-muted transition hover:bg-surface-hover hover:text-text"
                (click)="go($event, item.href); open.set(false)"
              >
                {{ item.label }}
              </a>
            }
            <a
              class="magnetic-btn btn-primary mt-2 text-sm"
              [href]="portfolio.portfolio().cvPath"
              target="_blank"
              rel="noopener"
            >
              Download Resume
            </a>
          </div>
        </div>
      }
    </header>
  `,
})
export class Navbar {
  readonly portfolio = inject(PortfolioService);
  readonly animation = inject(AnimationService);
  private readonly lenis = inject(LenisService);

  readonly scrolled = signal(false);
  readonly open = signal(false);

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 24);
  }

  go(event: Event, href: string): void {
    event.preventDefault();
    this.lenis.scrollTo(href);
  }
}
