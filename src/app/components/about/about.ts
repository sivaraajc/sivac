import { Component, inject, AfterViewInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PORTFOLIO } from '../../data/portfolio.data';
import { ScrollAnimationService } from '../../services/scroll-animation.service';

@Component({
  selector: 'app-about',
  template: `
    <section id="about" class="section about">
      <h2 class="section-title">{{ data.about.title }}</h2>
      <div class="about-grid">
        <div class="about-text">
          @for (para of safeParagraphs; track $index) {
            <p class="about-para reveal-item" [innerHTML]="para"></p>
          }
        </div>
        <div class="about-stats reveal-item">
          <div class="stat-card">
            <span class="stat-number">3+</span>
            <span class="stat-label">Years Experience</span>
          </div>
          <div class="stat-card">
            <span class="stat-number">30%</span>
            <span class="stat-label">Faster Delivery</span>
          </div>
          <div class="stat-card">
            <span class="stat-number">40%</span>
            <span class="stat-label">Less Code Duplication</span>
          </div>
          <div class="stat-card">
            <span class="stat-number">15+</span>
            <span class="stat-label">Projects Delivered</span>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .about-grid {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 3rem;
      align-items: start;
    }
    .about-para {
      font-size: 1.05rem;
      line-height: 1.85;
      color: var(--text-secondary);
      margin-bottom: 1.25rem;
    }
    .about-stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    .stat-card {
      background: transparent;
      border: 1px solid var(--glass-border);
      border-radius: 12px;
      padding: 1.5rem;
      text-align: center;
      transition: border-color 0.3s;
    }
    .stat-card:hover {
      border-color: rgba(34, 211, 238, 0.3);
    }
    .stat-number {
      display: block;
      font-family: var(--font-display);
      font-size: 2rem;
      font-weight: 700;
      color: var(--accent-cyan);
    }
    .stat-label {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-top: 0.25rem;
    }
    @media (max-width: 768px) {
      .about-grid { grid-template-columns: 1fr; gap: 2rem; }
      .about-para { font-size: 1rem; }
    }
    @media (max-width: 480px) {
      .about-stats { grid-template-columns: 1fr; }
      .stat-card { padding: 1.15rem; }
      .stat-number { font-size: 1.65rem; }
    }
  `,
})
export class About implements AfterViewInit {
  readonly data = PORTFOLIO;
  private readonly sanitizer = inject(DomSanitizer);
  private readonly scrollAnim = inject(ScrollAnimationService);

  readonly safeParagraphs: SafeHtml[] = PORTFOLIO.about.paragraphs.map((p) =>
    this.sanitizer.bypassSecurityTrustHtml(p),
  );

  ngAfterViewInit(): void {
    this.scrollAnim.sectionTitle('#about .section-title');
    this.scrollAnim.reveal('#about .reveal-item', { y: 40, stagger: 0.1 });
  }
}
