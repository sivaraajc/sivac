import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { PortfolioService } from '../../services/portfolio.service';
import { LenisService } from '../../services/lenis.service';
import { ExperienceModeService } from '../../services/experience-mode.service';
import { LucideBot, LucideX, LucideSparkles } from '@lucide/angular';
import { fadeIn } from '../../animations/portfolio.animations';

interface ChatLine {
  from: 'ai' | 'user';
  text: string;
}

@Component({
  selector: 'app-ai-orb',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideBot, LucideX, LucideSparkles],
  animations: [fadeIn],
  template: `
    <div class="fixed bottom-6 left-6 z-[66]">
      <button
        type="button"
        class="orb"
        aria-label="Open AI assistant"
        data-cursor="Ask AI"
        (click)="open.set(!open())"
      >
        <span class="orb-glow"></span>
        <svg lucideBot [size]="20"></svg>
      </button>

      @if (open()) {
        <div class="ide-window absolute bottom-16 left-0 w-[min(92vw,360px)] overflow-hidden" @fadeIn>
          <div class="ide-titlebar">
            <svg lucideSparkles [size]="14" class="text-accent"></svg>
            <span class="font-mono text-[11px] text-text-dim">assistant.sivaraaj</span>
            <button type="button" class="ml-auto text-text-dim" aria-label="Close assistant" (click)="open.set(false)">
              <svg lucideX [size]="14"></svg>
            </button>
          </div>
          <div class="max-h-64 space-y-3 overflow-auto p-4" data-lenis-prevent>
            @for (line of lines(); track $index) {
              <div
                class="rounded-xl px-3 py-2 text-sm"
                [class.bg-accent/10]="line.from === 'ai'"
                [class.text-text]="line.from === 'ai'"
                [class.bg-accent-2/10]="line.from === 'user'"
                [class.ml-6]="line.from === 'user'"
                [class.mr-6]="line.from === 'ai'"
              >
                {{ line.text }}
              </div>
            }
          </div>
          <div class="flex flex-wrap gap-2 border-t border-border p-3">
            @for (q of quick; track q) {
              <button
                type="button"
                class="rounded-full border border-border bg-surface px-3 py-1 font-mono text-[10px] text-text-muted transition hover:border-accent/40 hover:text-accent"
                (click)="ask(q)"
              >
                {{ q }}
              </button>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    .orb {
      position: relative;
      display: grid;
      place-items: center;
      width: 54px;
      height: 54px;
      border-radius: 999px;
      border: 1px solid rgba(34, 211, 238, 0.35);
      background: linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(7, 9, 15, 0.95));
      color: #67e8f9;
      box-shadow: 0 10px 40px rgba(34, 211, 238, 0.25);
    }
    .orb-glow {
      position: absolute;
      inset: -8px;
      border-radius: 999px;
      background: radial-gradient(circle, rgba(34, 211, 238, 0.35), transparent 70%);
      animation: pulse 2.4s ease-in-out infinite;
      z-index: -1;
    }
    @keyframes pulse {
      0%, 100% { transform: scale(0.9); opacity: 0.55; }
      50% { transform: scale(1.15); opacity: 1; }
    }
  `,
})
export class AiOrb {
  private readonly portfolio = inject(PortfolioService);
  private readonly lenis = inject(LenisService);
  private readonly mode = inject(ExperienceModeService);

  readonly open = signal(false);
  readonly lines = signal<ChatLine[]>([
    {
      from: 'ai',
      text: `Hi — I'm Sivaraaj's portfolio assistant. Ask about projects, stack, or experience.`,
    },
  ]);

  readonly quick = ['Skills', 'Projects', 'Experience', 'Contact'];

  @HostListener('document:keydown', ['$event'])
  onKey(e: KeyboardEvent): void {
    // Konami handled in EasterEggs; keep orb shortcut free
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'j') {
      e.preventDefault();
      this.open.set(!this.open());
    }
  }

  ask(q: string): void {
    this.lines.update((l) => [...l, { from: 'user', text: q }]);
    const p = this.portfolio.portfolio();
    let reply = '';
    const key = q.toLowerCase();
    if (key.includes('skill')) {
      reply = `Core stack: Angular, TypeScript, Spring Boot, FastAPI, PostgreSQL, Docker. Strength is scalable Angular architecture + performance.`;
      this.lenis.scrollTo('#skills');
    } else if (key.includes('project')) {
      reply = `Featured systems include AI Avatar Assistant, Drilling AI, CO-OPTEX ERP, and Stella ecommerce — open Projects for metrics and live demos.`;
      this.lenis.scrollTo('#projects');
    } else if (key.includes('experience')) {
      reply = `${p.title} with ${p.widgets.years}+ years across oil & gas and enterprise ERP. Mentored teams and shipped 30% performance gains.`;
      this.lenis.scrollTo('#experience');
    } else if (key.includes('contact')) {
      reply = `Reach Sivaraaj at ${p.email} or use the contact form — replies are usually quick.`;
      this.lenis.scrollTo('#contact');
    } else if (key.includes('matrix')) {
      this.mode.toggleMatrix();
      reply = this.mode.matrixMode()
        ? 'Matrix mode enabled. Press the Konami code or ask again to toggle.'
        : 'Matrix mode disabled. Back to premium engineer mode.';
    } else {
      reply = `I'm a lightweight guide. Try Skills, Projects, Experience, Contact — or press Ctrl+K for the command palette.`;
    }
    setTimeout(() => this.lines.update((l) => [...l, { from: 'ai', text: reply }]), 350);
  }
}
