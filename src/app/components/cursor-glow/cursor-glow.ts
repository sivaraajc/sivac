import { Component, ChangeDetectionStrategy, HostListener, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-cursor-glow',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (enabled()) {
      <div
        class="pointer-events-none fixed z-[60] hidden h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full md:block"
        [style.left.px]="x()"
        [style.top.px]="y()"
        style="background: radial-gradient(circle, rgba(45,212,191,0.16), transparent 70%); mix-blend-mode: screen;"
        aria-hidden="true"
      ></div>
    }
  `,
})
export class CursorGlow {
  private readonly platformId = inject(PLATFORM_ID);
  readonly x = signal(0);
  readonly y = signal(0);
  readonly enabled = signal(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.enabled.set(!window.matchMedia('(pointer: coarse)').matches);
    }
  }

  @HostListener('document:pointermove', ['$event'])
  onMove(event: PointerEvent): void {
    if (!this.enabled()) return;
    this.x.set(event.clientX);
    this.y.set(event.clientY);
  }
}
