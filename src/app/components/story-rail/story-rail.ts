import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AnimationService } from '../../services/animation.service';
import { LenisService } from '../../services/lenis.service';

@Component({
  selector: 'app-story-rail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside class="pointer-events-none fixed left-4 top-1/2 z-[62] hidden -translate-y-1/2 xl:block" aria-hidden="true">
      <div class="pointer-events-auto flex flex-col gap-3 rounded-2xl border border-border/70 glass-strong p-3">
        @for (chapter of chapters; track chapter.id) {
          <button
            type="button"
            class="group flex items-center gap-3 text-left"
            (click)="go(chapter.href)"
            [attr.aria-current]="active() === chapter.id ? 'true' : null"
          >
            <span
              class="h-2 w-2 rounded-full transition"
              [class.bg-accent]="active() === chapter.id"
              [class.shadow-[0_0_12px_rgba(34,211,238,0.8)]]="active() === chapter.id"
              [class.bg-text-dim]="active() !== chapter.id"
            ></span>
            <span class="max-w-0 overflow-hidden whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.16em] text-text-dim opacity-0 transition-all duration-300 group-hover:max-w-[140px] group-hover:opacity-100"
              [class.!max-w-[140px]]="active() === chapter.id"
              [class.!opacity-100]="active() === chapter.id"
              [class.text-accent]="active() === chapter.id"
            >
              {{ chapter.label }}
            </span>
          </button>
        }
      </div>
    </aside>
  `,
})
export class StoryRail {
  private readonly animation = inject(AnimationService);
  private readonly lenis = inject(LenisService);
  readonly active = this.animation.activeSection;

  readonly chapters = [
    { id: 'home', href: '#home', label: 'Welcome' },
    { id: 'about', href: '#about', label: 'Who I Am' },
    { id: 'experience', href: '#experience', label: 'My Journey' },
    { id: 'skills', href: '#skills', label: 'Skills Grow' },
    { id: 'projects', href: '#projects', label: 'Projects Alive' },
    { id: 'lab', href: '#lab', label: 'Impact Lab' },
    { id: 'services', href: '#services', label: 'Future Vision' },
    { id: 'contact', href: '#contact', label: "Let's Build" },
  ];

  go(href: string): void {
    this.lenis.scrollTo(href);
  }
}
