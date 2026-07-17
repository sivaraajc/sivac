import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  inject,
  signal,
} from '@angular/core';
import { PortfolioService } from '../../services/portfolio.service';
import { LenisService } from '../../services/lenis.service';
import { LucideSearch, LucideCommand } from '@lucide/angular';
import { fadeIn } from '../../animations/portfolio.animations';

interface CommandItem {
  id: string;
  label: string;
  hint: string;
  href?: string;
  action?: () => void;
}

@Component({
  selector: 'app-command-palette',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideSearch, LucideCommand],
  animations: [fadeIn],
  template: `
    @if (open()) {
      <div class="fixed inset-0 z-[90] flex items-start justify-center bg-black/70 p-4 pt-[12vh] backdrop-blur-md" (click)="close()" @fadeIn>
        <div
          class="ide-window w-full max-w-xl overflow-hidden"
          (click)="$event.stopPropagation()"
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          <div class="flex items-center gap-3 border-b border-border px-4 py-3">
            <svg lucideSearch [size]="16" class="text-text-dim"></svg>
            <input
              #queryInput
              class="w-full bg-transparent font-mono text-sm text-text outline-none placeholder:text-text-dim"
              placeholder="Search sections, actions…"
              [value]="query()"
              (input)="query.set(($any($event.target)).value)"
              (keydown)="onKey($event)"
            />
            <span class="kbd">esc</span>
          </div>
          <ul class="max-h-80 overflow-auto p-2">
            @for (item of filtered(); track item.id; let i = $index) {
              <li>
                <button
                  type="button"
                  class="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition"
                  [class.bg-accent/10]="i === active()"
                  [class.text-accent]="i === active()"
                  (mouseenter)="active.set(i)"
                  (click)="run(item)"
                >
                  <span class="font-mono text-sm">{{ item.label }}</span>
                  <span class="text-xs text-text-dim">{{ item.hint }}</span>
                </button>
              </li>
            } @empty {
              <li class="px-3 py-6 text-center font-mono text-sm text-text-dim">No matches</li>
            }
          </ul>
          <div class="flex items-center gap-2 border-t border-border px-4 py-2 font-mono text-[11px] text-text-dim">
            <svg lucideCommand [size]="12"></svg>
            Navigate with ↑ ↓ · Enter to run · Esc to close
          </div>
        </div>
      </div>
    }
  `,
})
export class CommandPalette {
  private readonly portfolio = inject(PortfolioService);
  private readonly lenis = inject(LenisService);

  readonly open = signal(false);
  readonly query = signal('');
  readonly active = signal(0);

  readonly commands = computed<CommandItem[]>(() => {
    const nav = this.portfolio.portfolio().nav.map((n) => ({
      id: n.id,
      label: `Go to ${n.label}`,
      hint: n.href,
      href: n.href,
    }));
    return [
      { id: 'home', label: 'Go to Home', hint: '#home', href: '#home' },
      ...nav,
      {
        id: 'resume',
        label: 'Open Resume PDF',
        hint: 'cv',
        action: () => window.open(this.portfolio.portfolio().cvPath, '_blank'),
      },
      {
        id: 'github',
        label: 'Open GitHub',
        hint: 'external',
        action: () => window.open(this.portfolio.portfolio().github, '_blank'),
      },
      {
        id: 'email',
        label: 'Compose Email',
        hint: 'mailto',
        action: () => (window.location.href = `mailto:${this.portfolio.portfolio().email}`),
      },
    ];
  });

  readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return this.commands();
    return this.commands().filter((c) => c.label.toLowerCase().includes(q) || c.hint.toLowerCase().includes(q));
  });

  @HostListener('document:keydown', ['$event'])
  onGlobalKey(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.open.set(!this.open());
      this.query.set('');
      this.active.set(0);
    } else if (event.key === 'Escape' && this.open()) {
      this.close();
    }
  }

  onKey(event: KeyboardEvent): void {
    const list = this.filtered();
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.active.set((this.active() + 1) % Math.max(list.length, 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.active.set((this.active() - 1 + list.length) % Math.max(list.length, 1));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const item = list[this.active()];
      if (item) this.run(item);
    }
  }

  run(item: CommandItem): void {
    if (item.action) item.action();
    if (item.href) this.lenis.scrollTo(item.href);
    this.close();
  }

  close(): void {
    this.open.set(false);
  }
}
