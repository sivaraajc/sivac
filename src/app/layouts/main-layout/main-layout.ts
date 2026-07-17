import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';
import { ScrollProgress } from '../../components/scroll-progress/scroll-progress';
import { AuroraBg } from '../../components/aurora-bg/aurora-bg';
import { Scene3d } from '../../components/scene3d/scene3d';
import { CursorGlow } from '../../components/cursor-glow/cursor-glow';
import { BackToTop } from '../../components/back-to-top/back-to-top';

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
  ],
  template: `
    <div class="noise-overlay" aria-hidden="true"></div>
    <app-aurora-bg />
    <app-scene3d />
    <app-cursor-glow />
    <app-scroll-progress />
    <app-navbar />
    <main class="relative z-10">
      <router-outlet />
    </main>
    <app-footer />
    <app-back-to-top />
  `,
})
export class MainLayout {}
