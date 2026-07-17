import { Directive, ElementRef, inject, PLATFORM_ID, input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appTilt]',
  standalone: true,
  host: {
    '(pointermove)': 'onMove($event)',
    '(pointerleave)': 'onLeave()',
  },
})
export class TiltDirective {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly platformId = inject(PLATFORM_ID);
  readonly maxTilt = input(10);

  onMove(event: PointerEvent): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const node = this.el.nativeElement;
    const rect = node.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    const max = this.maxTilt();
    const rotateY = (px - 0.5) * max * 2;
    const rotateX = (0.5 - py) * max * 2;
    node.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;
    node.style.transition = 'transform 0.08s linear';
  }

  onLeave(): void {
    const node = this.el.nativeElement;
    node.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
    node.style.transform = 'perspective(900px) rotateX(0) rotateY(0) scale3d(1,1,1)';
  }
}
