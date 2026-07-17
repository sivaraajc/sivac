import { Component, ChangeDetectionStrategy, inject, signal, HostListener } from '@angular/core';
import { LenisService } from '../../services/lenis.service';
import { LucideArrowUp } from '@lucide/angular';

@Component({
  selector: 'app-back-to-top',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideArrowUp],
  template: `
    @if (visible()) {
      <button
        type="button"
        class="fixed bottom-24 right-6 z-[65] inline-flex h-12 w-12 items-center justify-center rounded-full border border-border glass-strong text-accent shadow-glow transition hover:scale-105"
        aria-label="Back to top"
        (click)="top()"
      >
        <svg lucideArrowUp [size]="18"></svg>
      </button>
    }
  `,
})
export class BackToTop {
  private readonly lenis = inject(LenisService);
  readonly visible = signal(false);

  @HostListener('window:scroll')
  onScroll(): void {
    this.visible.set(window.scrollY > 600);
  }

  top(): void {
    this.lenis.scrollTo(0);
  }
}
