import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';
import { ScrollProgress } from '../../components/scroll-progress/scroll-progress';
import { AuroraBg } from '../../components/aurora-bg/aurora-bg';
import { Scene3d } from '../../components/scene3d/scene3d';
import { CursorGlow } from '../../components/cursor-glow/cursor-glow';
import { BackToTop } from '../../components/back-to-top/back-to-top';
import { CodeRain } from '../../components/code-rain/code-rain';
import { CommandPalette } from '../../components/command-palette/command-palette';
import { CinematicLoader } from '../../components/cinematic-loader/cinematic-loader';
import { StoryRail } from '../../components/story-rail/story-rail';
import { PremiumCursor } from '../../components/premium-cursor/premium-cursor';
import { AiOrb } from '../../components/ai-orb/ai-orb';
import { ReactiveStage } from '../../components/reactive-stage/reactive-stage';
import { EasterEggsDirective } from '../../directives/easter-eggs.directive';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    Navbar,
    Footer,
    ScrollProgress,
    AuroraBg,
    Scene3d,
    CursorGlow,
    BackToTop,
    CodeRain,
    CommandPalette,
    CinematicLoader,
    StoryRail,
    PremiumCursor,
    AiOrb,
    ReactiveStage,
  ],
  hostDirectives: [EasterEggsDirective],
  template: `
    <app-cinematic-loader />
    <div class="noise-overlay" aria-hidden="true"></div>
    <app-reactive-stage />
    <app-aurora-bg />
    <app-code-rain />
    <app-scene3d />
    <app-cursor-glow />
    <app-premium-cursor />
    <app-scroll-progress />
    <app-story-rail />
    <app-navbar />
    <app-command-palette />
    <app-ai-orb />
    <main class="relative z-10">
      <router-outlet />
    </main>
    <app-footer />
    <app-back-to-top />
  `,
})
export class MainLayout {}
