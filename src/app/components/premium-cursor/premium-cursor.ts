import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnInit,
  inject,
  signal,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-premium-cursor',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (enabled()) {
      <div class="pointer-events-none fixed inset-0 z-[95] hidden md:block" aria-hidden="true">
        <div
          class="cursor-dot"
          [style.transform]="'translate3d(' + x() + 'px,' + y() + 'px,0) scale(' + scale() + ')'"
          [class.cursor-hover]="hovering()"
        ></div>
        <div
          class="cursor-ring"
          [style.transform]="'translate3d(' + rx() + 'px,' + ry() + 'px,0) scale(' + (hovering() ? 1.55 : 1) + ')'"
        ></div>
        @if (label()) {
          <div
            class="cursor-label"
            [style.transform]="'translate3d(' + (x() + 18) + 'px,' + (y() + 18) + 'px,0)'"
          >
            {{ label() }}
          </div>
        }
      </div>
    }
  `,
  styles: `
    .cursor-dot,
    .cursor-ring,
    .cursor-label {
      position: fixed;
      top: 0;
      left: 0;
      will-change: transform;
    }
    .cursor-dot {
      width: 8px;
      height: 8px;
      margin: -4px 0 0 -4px;
      border-radius: 999px;
      background: #22d3ee;
      box-shadow: 0 0 18px rgba(34, 211, 238, 0.8);
      transition: transform 0.12s ease, background 0.2s ease;
    }
    .cursor-hover {
      background: #a78bfa;
    }
    .cursor-ring {
      width: 36px;
      height: 36px;
      margin: -18px 0 0 -18px;
      border-radius: 999px;
      border: 1px solid rgba(129, 140, 248, 0.55);
      transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .cursor-label {
      padding: 0.25rem 0.5rem;
      border-radius: 999px;
      border: 1px solid rgba(34, 211, 238, 0.35);
      background: rgba(7, 9, 15, 0.85);
      color: #67e8f9;
      font-family: var(--font-mono);
      font-size: 10px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      backdrop-filter: blur(8px);
    }
  `,
})
export class PremiumCursor implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  readonly enabled = signal(false);
  readonly x = signal(0);
  readonly y = signal(0);
  readonly rx = signal(0);
  readonly ry = signal(0);
  readonly scale = signal(1);
  readonly hovering = signal(false);
  readonly label = signal('');

  private raf = 0;
  private tx = 0;
  private ty = 0;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.enabled.set(fine && !reduce);
    if (this.enabled()) {
      document.documentElement.classList.add('premium-cursor');
      this.loop();
    }
  }

  @HostListener('document:pointermove', ['$event'])
  onMove(e: PointerEvent): void {
    if (!this.enabled()) return;
    this.tx = e.clientX;
    this.ty = e.clientY;
    this.x.set(e.clientX);
    this.y.set(e.clientY);

    const target = (e.target as HTMLElement | null)?.closest('a, button, [data-cursor]') as HTMLElement | null;
    this.hovering.set(!!target);
    this.scale.set(target ? 0.5 : 1);
    this.label.set(target?.getAttribute('data-cursor') || '');
  }

  @HostListener('document:mousedown')
  onDown(): void {
    if (!this.enabled()) return;
    this.scale.set(0.35);
  }

  @HostListener('document:mouseup')
  onUp(): void {
    if (!this.enabled()) return;
    this.scale.set(this.hovering() ? 0.5 : 1);
  }

  private loop = (): void => {
    this.rx.set(this.rx() + (this.tx - this.rx()) * 0.18);
    this.ry.set(this.ry() + (this.ty - this.ry()) * 0.18);
    this.raf = requestAnimationFrame(this.loop);
  };
}
