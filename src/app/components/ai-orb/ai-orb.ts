import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';
import { LenisService } from '../../services/lenis.service';
import { ExperienceModeService } from '../../services/experience-mode.service';
import {
  LucideBot,
  LucideX,
  LucideSparkles,
  LucideVolume2,
  LucideVolumeX,
} from '@lucide/angular';
import { fadeIn, scaleIn } from '../../animations/portfolio.animations';

interface ChatLine {
  from: 'ai' | 'user';
  text: string;
}

@Component({
  selector: 'app-ai-orb',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideBot, LucideX, LucideSparkles, LucideVolume2, LucideVolumeX],
  animations: [fadeIn, scaleIn],
  template: `
    <div class="fixed bottom-6 right-6 z-[66]">
      <button
        type="button"
        class="orb"
        [class.orb-open]="open()"
        [class.orb-speaking]="speaking()"
        aria-label="Open 3D AI assistant"
        data-cursor="Ask AI"
        (click)="toggle()"
      >
        <span class="orb-aura"></span>
        <span class="orb-ring"></span>
        <span class="orb-core">
          <svg lucideBot [size]="20"></svg>
        </span>
        @if (speaking()) {
          <span class="voice-bars" aria-hidden="true">
            @for (b of bars; track b) {
              <i [style.animation-delay]="b + 'ms'"></i>
            }
          </span>
        }
      </button>

      @if (open()) {
        <div class="panel absolute bottom-20 right-0 w-[min(94vw,400px)] overflow-hidden" @scaleIn>
          <div class="panel-glow" aria-hidden="true"></div>

          <div class="ide-titlebar relative z-10">
            <svg lucideSparkles [size]="14" class="text-accent-3"></svg>
            <span class="font-mono text-[11px] text-text-dim">assistant.sivaraaj · live</span>
            <button
              type="button"
              class="ml-auto text-text-dim transition hover:text-accent"
              [attr.aria-label]="muted() ? 'Unmute voice' : 'Mute voice'"
              (click)="toggleMute()"
            >
              @if (muted()) {
                <svg lucideVolumeX [size]="14"></svg>
              } @else {
                <svg lucideVolume2 [size]="14"></svg>
              }
            </button>
            <button
              type="button"
              class="text-text-dim transition hover:text-neon"
              aria-label="Close assistant"
              (click)="close()"
            >
              <svg lucideX [size]="14"></svg>
            </button>
          </div>

          <div class="relative z-10 px-4 pb-2 pt-3">
            <div class="stage">
              <div class="stage-sphere" [class.stage-speaking]="speaking()">
                <span class="sphere-shine"></span>
                <span class="sphere-orbit"></span>
                <span class="sphere-orbit sphere-orbit-2"></span>
                <div class="sphere-face">
                  <svg lucideBot [size]="28" class="text-white/90"></svg>
                </div>
              </div>
              <div class="stage-copy">
                <p class="font-display text-sm font-semibold text-text">3D Guide</p>
                <p class="mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-accent-3">
                  {{ speaking() ? 'speaking…' : 'online · ready' }}
                </p>
              </div>
            </div>
          </div>

          <div class="relative z-10 max-h-56 space-y-3 overflow-auto px-4 pb-3" data-lenis-prevent>
            @for (line of lines(); track $index) {
              <div
                class="bubble"
                [class.bubble-ai]="line.from === 'ai'"
                [class.bubble-user]="line.from === 'user'"
              >
                {{ line.text }}
              </div>
            }
          </div>

          <div class="relative z-10 flex flex-wrap gap-2 border-t border-border/80 bg-black/20 p-3">
            @for (q of quick; track q) {
              <button type="button" class="chip" (click)="ask(q)">{{ q }}</button>
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
      width: 58px;
      height: 58px;
      border-radius: 999px;
      border: 1px solid rgba(168, 85, 247, 0.45);
      background:
        radial-gradient(circle at 30% 25%, rgba(168, 85, 247, 0.55), transparent 45%),
        linear-gradient(145deg, #151b33, #070a14);
      color: #e9d5ff;
      box-shadow:
        0 12px 40px rgba(124, 58, 237, 0.35),
        0 0 0 1px rgba(6, 182, 212, 0.12);
      transition: transform 0.35s ease, box-shadow 0.35s ease;
    }
    .orb:hover { transform: scale(1.06); }
    .orb-open {
      border-color: rgba(6, 182, 212, 0.55);
      box-shadow: 0 14px 48px rgba(6, 182, 212, 0.35);
    }
    .orb-speaking {
      animation: orbPulse 1.1s ease-in-out infinite;
    }
    .orb-aura {
      position: absolute;
      inset: -10px;
      border-radius: 999px;
      background: radial-gradient(circle, rgba(124, 58, 237, 0.4), transparent 68%);
      animation: pulse 2.4s ease-in-out infinite;
      z-index: -1;
    }
    .orb-ring {
      position: absolute;
      inset: -3px;
      border-radius: 999px;
      border: 1px dashed rgba(6, 182, 212, 0.35);
      animation: spinSlow 10s linear infinite;
    }
    .orb-core {
      position: relative;
      z-index: 1;
      display: grid;
      place-items: center;
    }
    .voice-bars {
      position: absolute;
      bottom: -2px;
      display: flex;
      gap: 2px;
      align-items: flex-end;
      height: 12px;
    }
    .voice-bars i {
      display: block;
      width: 2px;
      height: 6px;
      border-radius: 2px;
      background: linear-gradient(#06b6d4, #a855f7);
      animation: bar 0.7s ease-in-out infinite;
    }
    .panel {
      border-radius: 22px;
      border: 1px solid rgba(168, 85, 247, 0.28);
      background:
        linear-gradient(160deg, rgba(18, 24, 48, 0.96), rgba(7, 10, 22, 0.94));
      backdrop-filter: blur(28px);
      box-shadow:
        0 28px 80px rgba(0, 0, 0, 0.55),
        0 0 60px rgba(124, 58, 237, 0.18),
        inset 0 1px 0 rgba(255, 255, 255, 0.06);
    }
    .panel-glow {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse at 80% 0%, rgba(124, 58, 237, 0.22), transparent 45%),
        radial-gradient(ellipse at 10% 90%, rgba(6, 182, 212, 0.12), transparent 40%);
      pointer-events: none;
    }
    .stage {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 12px;
      border-radius: 18px;
      border: 1px solid rgba(255, 255, 255, 0.06);
      background:
        linear-gradient(135deg, rgba(124, 58, 237, 0.12), rgba(6, 182, 212, 0.06));
    }
    .stage-sphere {
      position: relative;
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background:
        radial-gradient(circle at 32% 28%, #c4b5fd, #7c3aed 42%, #1e1b4b 78%);
      box-shadow:
        0 10px 30px rgba(124, 58, 237, 0.45),
        inset -8px -10px 20px rgba(0, 0, 0, 0.35),
        inset 6px 8px 16px rgba(255, 255, 255, 0.2);
      flex-shrink: 0;
    }
    .stage-speaking {
      animation: sphereTalk 0.9s ease-in-out infinite;
    }
    .sphere-shine {
      position: absolute;
      inset: 10% 18% auto 18%;
      height: 28%;
      border-radius: 50%;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.55), transparent);
      filter: blur(1px);
    }
    .sphere-orbit,
    .sphere-orbit-2 {
      position: absolute;
      inset: -8px;
      border-radius: 50%;
      border: 1px solid transparent;
      border-top-color: rgba(6, 182, 212, 0.7);
      border-right-color: rgba(255, 77, 141, 0.35);
      animation: spinSlow 4s linear infinite;
    }
    .sphere-orbit-2 {
      inset: -14px;
      border-top-color: rgba(168, 85, 247, 0.55);
      animation-duration: 7s;
      animation-direction: reverse;
    }
    .sphere-face {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
    }
    .bubble {
      border-radius: 16px;
      padding: 0.65rem 0.85rem;
      font-size: 0.875rem;
      line-height: 1.45;
    }
    .bubble-ai {
      margin-right: 1.25rem;
      background: linear-gradient(135deg, rgba(6, 182, 212, 0.14), rgba(124, 58, 237, 0.12));
      border: 1px solid rgba(6, 182, 212, 0.18);
      color: #f8fafc;
    }
    .bubble-user {
      margin-left: 1.25rem;
      background: rgba(255, 77, 141, 0.1);
      border: 1px solid rgba(255, 77, 141, 0.2);
      color: #fce7f3;
    }
    .chip {
      border-radius: 999px;
      border: 1px solid rgba(168, 85, 247, 0.25);
      background: rgba(255, 255, 255, 0.03);
      padding: 0.3rem 0.75rem;
      font-family: var(--font-mono);
      font-size: 10px;
      color: #94a3b8;
      transition: border-color 0.2s, color 0.2s, background 0.2s;
    }
    .chip:hover {
      border-color: rgba(6, 182, 212, 0.45);
      color: #67e8f9;
      background: rgba(6, 182, 212, 0.08);
    }
    @keyframes pulse {
      0%, 100% { transform: scale(0.9); opacity: 0.5; }
      50% { transform: scale(1.18); opacity: 1; }
    }
    @keyframes orbPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.08); }
    }
    @keyframes sphereTalk {
      0%, 100% { transform: scale(1) translateY(0); }
      50% { transform: scale(1.05) translateY(-2px); }
    }
    @keyframes spinSlow { to { transform: rotate(360deg); } }
    @keyframes bar {
      0%, 100% { height: 4px; opacity: 0.5; }
      50% { height: 12px; opacity: 1; }
    }
    @media (prefers-reduced-motion: reduce) {
      .orb-aura, .orb-ring, .orb-speaking, .stage-speaking,
      .sphere-orbit, .sphere-orbit-2, .voice-bars i { animation: none; }
    }
  `,
})
export class AiOrb {
  private readonly portfolio = inject(PortfolioService);
  private readonly lenis = inject(LenisService);
  private readonly mode = inject(ExperienceModeService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly open = signal(false);
  readonly speaking = signal(false);
  readonly muted = signal(false);
  readonly bars = [0, 80, 160, 40, 120];
  readonly lines = signal<ChatLine[]>([
    {
      from: 'ai',
      text: `Hello — I'm Sivaraaj's 3D portfolio guide. Ask about skills, projects, experience, or design.`,
    },
  ]);

  readonly quick = [
    'Who are you?',
    'Skills',
    'Projects',
    'Experience',
    'Services',
    'Lab',
    'Contact',
    'Aesthetic',
  ];

  private greeted = false;
  private utterance?: SpeechSynthesisUtterance;

  @HostListener('document:keydown', ['$event'])
  onKey(e: KeyboardEvent): void {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'j') {
      e.preventDefault();
      this.toggle();
    }
  }

  toggle(): void {
    if (this.open()) {
      this.close();
      return;
    }
    this.open.set(true);
    if (!this.greeted) {
      this.greeted = true;
      this.speak("Hello, I am a software developer. Welcome to Sivaraaj's portfolio.");
      this.lines.update((l) => [
        ...l,
        {
          from: 'ai',
          text: 'Hello, I am a software developer — I build scalable Angular systems, APIs, and cinematic product experiences.',
        },
      ]);
    }
  }

  close(): void {
    this.open.set(false);
    this.stopSpeak();
  }

  toggleMute(): void {
    this.muted.update((v) => !v);
    if (this.muted()) this.stopSpeak();
  }

  ask(q: string): void {
    this.lines.update((l) => [...l, { from: 'user', text: q }]);
    const p = this.portfolio.portfolio();
    let reply = '';
    const key = q.toLowerCase();

    if (key.includes('who')) {
      reply = `I'm ${p.fullName}, ${p.title} based in ${p.location}. I craft premium full-stack products with Angular, TypeScript, and modern backends.`;
      this.speak(reply);
    } else if (key.includes('skill')) {
      reply = `Core stack: Angular, TypeScript, Spring Boot, FastAPI, PostgreSQL, Docker. Strength is scalable Angular architecture + performance.`;
      this.lenis.scrollTo('#skills');
      this.speak('Here are my core engineering skills.');
    } else if (key.includes('project')) {
      reply = `Featured systems include AI Avatar Assistant, Drilling AI, CO-OPTEX ERP, and Stella ecommerce — open Projects for metrics and live demos.`;
      this.lenis.scrollTo('#projects');
      this.speak('Exploring featured projects now.');
    } else if (key.includes('experience')) {
      reply = `${p.title} with ${p.widgets.years}+ years across oil & gas and enterprise ERP. Mentored teams and shipped 30% performance gains.`;
      this.lenis.scrollTo('#experience');
      this.speak(reply);
    } else if (key.includes('service')) {
      reply = `I offer UI architecture, Angular systems, API design, performance audits, and AI-assisted product experiences.`;
      this.lenis.scrollTo('#services');
      this.speak('Here are the services I offer.');
    } else if (key.includes('lab')) {
      reply = `The Lab hosts experiments — motion studies, 3D scenes, and interaction prototypes that later become production patterns.`;
      this.lenis.scrollTo('#lab');
      this.speak('Opening the creative lab.');
    } else if (key.includes('contact')) {
      reply = `Reach Sivaraaj at ${p.email} or use the contact form — replies are usually quick.`;
      this.lenis.scrollTo('#contact');
      this.speak('Happy to connect. Scroll to contact.');
    } else if (key.includes('aesthetic') || key.includes('design') || key.includes('color')) {
      reply = `Design system: deep night #050816, violet #7C3AED, cyan #06B6D4, neon pink #FF4D8D — glass, aurora, soft glow, Space Grotesk + Sora.`;
      this.speak('The palette blends violet, cyan, and neon pink on a deep night canvas.');
    } else if (key.includes('matrix')) {
      this.mode.toggleMatrix();
      reply = this.mode.matrixMode()
        ? 'Matrix mode enabled. Ask again to toggle.'
        : 'Matrix mode disabled. Back to premium engineer mode.';
      this.speak(reply);
    } else {
      reply = `I'm a lightweight guide. Try Who are you, Skills, Projects, Experience, Aesthetic — or press Ctrl+K for the command palette.`;
      this.speak('Try one of the quick prompts below.');
    }

    setTimeout(() => this.lines.update((l) => [...l, { from: 'ai', text: reply }]), 320);
  }

  private speak(text: string): void {
    if (!isPlatformBrowser(this.platformId) || this.muted()) return;
    if (!('speechSynthesis' in window)) return;

    this.stopSpeak();

    let started = false;
    const run = () => {
      if (started || this.muted()) return;
      started = true;
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 1;
      u.pitch = 0.88;
      u.volume = 1;
      u.onstart = () => this.speaking.set(true);
      u.onend = () => this.speaking.set(false);
      u.onerror = () => this.speaking.set(false);

      const voices = window.speechSynthesis.getVoices();
      const preferred =
        voices.find((v) => /en-(US|GB)/i.test(v.lang) && /male|david|mark|daniel|alex|george/i.test(v.name)) ||
        voices.find((v) => /^en/i.test(v.lang) && /male|david|mark|daniel|alex|george/i.test(v.name)) ||
        voices.find((v) => v.lang.startsWith('en'));
      if (preferred) u.voice = preferred;

      this.utterance = u;
      window.speechSynthesis.speak(u);
    };

    if (window.speechSynthesis.getVoices().length) {
      run();
    } else {
      window.speechSynthesis.addEventListener('voiceschanged', run, { once: true });
      setTimeout(run, 300);
    }
  }

  private stopSpeak(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    this.speaking.set(false);
  }
}
