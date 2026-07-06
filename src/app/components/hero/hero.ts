import { Component, inject, AfterViewInit } from '@angular/core';
import { HeroAvatar } from '../hero-avatar/hero-avatar';
import { PORTFOLIO } from '../../data/portfolio.data';
import { ScrollAnimationService } from '../../services/scroll-animation.service';

@Component({
  selector: 'app-hero',
  imports: [HeroAvatar],
  template: `
    <section id="home" class="hero">
      <div class="hero-stage">
        <div class="hero-left">
          <p class="hero-pretitle hero-pretitle-left">{{ data.banner.pretitle }}</p>
          <h1 class="hero-name">{{ data.name }}</h1>
        </div>

        <div class="hero-center">
          <app-hero-avatar />
        </div>

        <div class="hero-right">
          <p class="hero-pretitle hero-pretitle-right">Full Stack Developer &</p>
          <h2 class="hero-role">{{ roleLine }}</h2>
        </div>
      </div>

      <div class="hero-bottom">
        <a class="hero-cta" href="#contact" (click)="scrollToContact($event)">
          {{ data.banner.actionBtn }}
        </a>
        <div class="scroll-hint">
          <span>Scroll</span>
          <div class="scroll-line"></div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .hero {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
      padding: 6rem 3rem 3rem;
      overflow: hidden;
    }
    .hero-stage {
      display: grid;
      grid-template-columns: 1fr minmax(300px, 480px) 1fr;
      align-items: center;
      gap: 1rem;
      flex: 1;
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
    }
    .hero-left {
      text-align: left;
      padding-right: 1rem;
    }
    .hero-right {
      text-align: right;
      padding-left: 1rem;
    }
    .hero-pretitle {
      font-size: clamp(0.9rem, 1.5vw, 1.1rem);
      color: var(--text-secondary);
      font-weight: 400;
      letter-spacing: 0.02em;
      margin-bottom: 0.75rem;
    }
    .hero-name {
      font-family: var(--font-display);
      font-size: clamp(2.4rem, 5.5vw, 4.2rem);
      font-weight: 800;
      line-height: 0.95;
      color: var(--text-primary);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin: 0;
    }
    .hero-role {
      font-family: var(--font-display);
      font-size: clamp(1.3rem, 2.8vw, 2.2rem);
      font-weight: 800;
      line-height: 1.2;
      color: var(--text-primary);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin: 0;
      max-width: 340px;
      margin-left: auto;
    }
    .hero-center {
      position: relative;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .hero-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 1400px;
      margin: 2rem auto 0;
      width: 100%;
      padding: 0 1rem;
    }
    .hero-cta {
      font-size: 0.8rem;
      font-weight: 600;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--accent-cyan);
      text-decoration: none;
      border-bottom: 1px solid var(--accent-cyan);
      padding-bottom: 4px;
      transition: opacity 0.3s;
    }
    .hero-cta:hover { opacity: 0.75; }
    .scroll-hint {
      display: flex;
      align-items: center;
      gap: 1rem;
      color: var(--text-muted);
      font-size: 0.7rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
    }
    .scroll-line {
      width: 60px;
      height: 1px;
      background: linear-gradient(90deg, var(--text-muted), transparent);
      position: relative;
      overflow: hidden;
    }
    .scroll-line::after {
      content: '';
      position: absolute;
      left: -100%;
      top: 0;
      width: 100%;
      height: 100%;
      background: var(--accent-cyan);
      animation: scroll-slide 2s infinite;
    }
    @keyframes scroll-slide {
      0% { left: -100%; }
      100% { left: 100%; }
    }
    @media (max-width: 1024px) {
      .hero-stage {
        grid-template-columns: 1fr;
        grid-template-rows: auto auto auto;
        text-align: center;
        gap: 0.5rem;
      }
      .hero-left, .hero-right {
        text-align: center;
        padding: 0;
      }
      .hero-role { margin: 0 auto; }
      .hero-center { order: -1; }
      .hero-bottom { justify-content: center; flex-direction: column; gap: 2rem; }
      .scroll-hint { display: none; }
    }
  `,
})
export class Hero implements AfterViewInit {
  readonly data = PORTFOLIO;
  readonly roleLine = PORTFOLIO.title.toUpperCase();
  private readonly scrollAnim = inject(ScrollAnimationService);

  ngAfterViewInit(): void {
    setTimeout(() => this.scrollAnim.heroEntrance(), 200);
  }

  scrollToContact(event: Event): void {
    event.preventDefault();
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }
}
