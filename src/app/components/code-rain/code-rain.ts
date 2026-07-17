import { ChangeDetectionStrategy, Component, OnInit, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-code-rain',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-[0.12]" aria-hidden="true">
      @for (col of columns(); track col.id) {
        <div
          class="absolute top-[-20%] font-mono text-[11px] leading-4 text-accent"
          [style.left.%]="col.x"
          [style.animation]="'fall ' + col.duration + 's linear infinite'"
          [style.animation-delay]="col.delay + 's'"
        >
          @for (ch of col.chars; track $index) {
            <div [style.opacity]="1 - $index * 0.08">{{ ch }}</div>
          }
        </div>
      }

      @for (snip of snippets; track snip; let i = $index) {
        <div
          class="absolute hidden rounded-lg border border-border/60 bg-bg-elevated/40 px-3 py-2 font-mono text-[10px] text-text-dim backdrop-blur-sm md:block"
          [style.left.%]="12 + i * 18"
          [style.top.%]="18 + (i % 3) * 22"
          [style.animation]="'floatCode ' + (14 + i * 2) + 's ease-in-out infinite'"
          [style.animation-delay]="(-i * 2) + 's'"
        >
          {{ snip }}
        </div>
      }
    </div>
  `,
  styles: `
    @keyframes fall {
      0% { transform: translateY(0); opacity: 0; }
      10% { opacity: 0.7; }
      100% { transform: translateY(140vh); opacity: 0; }
    }
    @keyframes floatCode {
      0%, 100% { transform: translateY(0) rotate(-1deg); }
      50% { transform: translateY(-18px) rotate(1deg); }
    }
    @media (prefers-reduced-motion: reduce) {
      :host * { animation: none !important; }
    }
  `,
})
export class CodeRain implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  readonly columns = signal<Array<{ id: number; x: number; duration: number; delay: number; chars: string[] }>>([]);
  readonly snippets = [
    '{ "status": 200, "latency": "42ms" }',
    'ng serve --hmr',
    'git push origin main',
    'SELECT * FROM impact;',
    'Observable<Response>',
  ];

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth < 768) return;

    const glyphs = '01<>[]{};:=*/#@$ABCDEF';
    const cols = Array.from({ length: 14 }, (_, id) => ({
      id,
      x: (id / 14) * 100 + Math.random() * 3,
      duration: 10 + Math.random() * 10,
      delay: Math.random() * 8,
      chars: Array.from({ length: 18 }, () => glyphs[Math.floor(Math.random() * glyphs.length)] ?? '0'),
    }));
    this.columns.set(cols);
  }
}
