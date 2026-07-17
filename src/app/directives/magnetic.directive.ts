import { Directive, ElementRef, OnDestroy, OnInit, inject, PLATFORM_ID, input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appMagnetic]',
  standalone: true,
  host: {
    '(pointermove)': 'onMove($event)',
    '(pointerleave)': 'onLeave()',
  },
})
export class MagneticDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly platformId = inject(PLATFORM_ID);
  readonly strength = input(0.35);
  private reduced = false;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.el.nativeElement.style.willChange = 'transform';
  }

  onMove(event: PointerEvent): void {
    if (!isPlatformBrowser(this.platformId) || this.reduced) return;
    const node = this.el.nativeElement;
    const rect = node.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    const s = this.strength();
    node.style.transform = `translate3d(${x * s}px, ${y * s}px, 0)`;
    node.style.setProperty('--x', `${((event.clientX - rect.left) / rect.width) * 100}%`);
    node.style.setProperty('--y', `${((event.clientY - rect.top) / rect.height) * 100}%`);
  }

  onLeave(): void {
    const node = this.el.nativeElement;
    node.style.transform = 'translate3d(0,0,0)';
  }

  ngOnDestroy(): void {
    this.onLeave();
  }
}
