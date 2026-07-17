import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { AnimationService } from '../../services/animation.service';

@Component({
  selector: 'app-scroll-progress',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="pointer-events-none fixed left-0 top-0 z-[70] h-[2px] w-full"
      role="progressbar"
      [attr.aria-valuenow]="animation.scrollProgress()"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-label="Scroll progress"
    >
      <div
        class="h-full origin-left bg-gradient-to-r from-accent via-accent-2 to-accent-3 transition-[width] duration-150 ease-out"
        [style.width.%]="animation.scrollProgress()"
      ></div>
    </div>
  `,
})
export class ScrollProgress {
  readonly animation = inject(AnimationService);
}
