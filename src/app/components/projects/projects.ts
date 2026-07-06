import { Component, inject, AfterViewInit, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PORTFOLIO, Project, ASSETS_BASE } from '../../data/portfolio.data';
import { ScrollAnimationService } from '../../services/scroll-animation.service';

@Component({
  selector: 'app-projects',
  template: `
    <section id="projects" class="section projects">
      <div class="projects-header">
        <h2 class="section-title">{{ data.projects.title }}</h2>
        @if (data.projects.label) {
          <span class="projects-label">{{ data.projects.label }}</span>
        }
      </div>

      <div class="projects-grid">
        @for (project of data.projects.items; track project.title; let i = $index) {
          <article
            class="project-card reveal-item"
            [class.featured]="project.featured"
            (mouseenter)="setActiveImage(i, 0)"
          >
            <div class="project-visual">
              <div class="project-carousel">
                @for (img of project.imgs; track img; let j = $index) {
                  <img
                    [src]="img"
                    [alt]="project.title"
                    class="project-img"
                    [class.active]="getActiveImage(i) === j"
                    (error)="onImgError($event)"
                  />
                }
                @if (project.imgs.length > 1) {
                  <div class="carousel-dots">
                    @for (img of project.imgs; track img; let j = $index) {
                      <button
                        class="dot"
                        [class.active]="getActiveImage(i) === j"
                        (click)="setActiveImage(i, j); $event.stopPropagation()"
                      ></button>
                    }
                  </div>
                }
              </div>
              @if (project.featured) {
                <span class="featured-badge">Featured</span>
              }
            </div>
            <div class="project-body">
              <h3 class="project-title">{{ project.title }}</h3>
              <p class="project-desc" [innerHTML]="getSafeDesc(project)"></p>
              <div class="project-tech">
                @for (tech of project.technologies; track tech) {
                  <span class="tech-tag">{{ tech }}</span>
                }
              </div>
              @if (project.link) {
                <a class="project-link" [href]="project.link" target="_blank" rel="noopener">
                  View Live Demo
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </a>
              }
            </div>
          </article>
        }
      </div>
    </section>
  `,
  styles: `
    .projects-header {
      display: flex;
      align-items: baseline;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .projects-label {
      font-size: 0.85rem;
      color: var(--accent-cyan);
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
      gap: 2rem;
    }
    .project-card {
      background: transparent;
      border: 1px solid var(--glass-border);
      border-radius: 16px;
      overflow: hidden;
      transition: border-color 0.4s, transform 0.4s;
    }
    .project-card:hover {
      transform: translateY(-6px);
      border-color: rgba(34, 211, 238, 0.25);
    }
    .project-card.featured {
      border-color: rgba(34, 211, 238, 0.25);
    }
    .project-visual {
      position: relative;
      height: 220px;
      overflow: hidden;
      background: linear-gradient(135deg, #0f0f23, #1a1a3e);
    }
    .project-carousel {
      position: relative;
      width: 100%;
      height: 100%;
    }
    .project-img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;
      transition: opacity 0.6s ease, transform 0.6s ease;
      transform: scale(1.05);
    }
    .project-img.active {
      opacity: 1;
      transform: scale(1);
    }
    .carousel-dots {
      position: absolute;
      bottom: 12px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 6px;
      z-index: 2;
    }
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      border: none;
      background: rgba(255,255,255,0.3);
      cursor: pointer;
      padding: 0;
      transition: all 0.3s;
    }
    .dot.active {
      background: var(--accent-cyan);
      transform: scale(1.3);
    }
    .featured-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      padding: 0.3rem 0.85rem;
      background: linear-gradient(135deg, var(--accent-cyan), #0891b2);
      color: #000;
      font-size: 0.7rem;
      font-weight: 700;
      border-radius: 999px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      z-index: 2;
    }
    .project-body { padding: 1.5rem; }
    .project-title {
      font-size: 1.2rem;
      font-weight: 700;
      margin: 0 0 0.75rem;
      color: var(--text-primary);
    }
    .project-desc {
      font-size: 0.9rem;
      line-height: 1.7;
      color: var(--text-secondary);
      margin: 0 0 1rem;
    }
    .project-tech {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin-bottom: 1rem;
    }
    .tech-tag {
      padding: 0.25rem 0.7rem;
      background: rgba(99, 102, 241, 0.1);
      border-radius: 6px;
      font-size: 0.75rem;
      color: var(--accent-indigo);
      font-weight: 500;
    }
    .project-link {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      color: var(--accent-cyan);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 600;
      transition: gap 0.3s;
    }
    .project-link:hover { gap: 0.7rem; }
    @media (max-width: 400px) {
      .projects-grid { grid-template-columns: 1fr; }
    }
  `,
})
export class Projects implements AfterViewInit {
  readonly data = PORTFOLIO;
  private readonly sanitizer = inject(DomSanitizer);
  private readonly scrollAnim = inject(ScrollAnimationService);
  private readonly activeImages = signal<Record<number, number>>({});
  private readonly descCache = new Map<string, SafeHtml>();
  private carouselIntervals: ReturnType<typeof setInterval>[] = [];

  ngAfterViewInit(): void {
    this.scrollAnim.sectionTitle('#projects .section-title');
    this.scrollAnim.reveal('#projects .reveal-item', { y: 50, stagger: 0.15 });
    this.startCarousels();
  }

  getSafeDesc(project: Project): SafeHtml {
    if (!this.descCache.has(project.title)) {
      this.descCache.set(
        project.title,
        this.sanitizer.bypassSecurityTrustHtml(project.description),
      );
    }
    return this.descCache.get(project.title)!;
  }

  getActiveImage(projectIndex: number): number {
    return this.activeImages()[projectIndex] ?? 0;
  }

  setActiveImage(projectIndex: number, imageIndex: number): void {
    this.activeImages.update((map) => ({ ...map, [projectIndex]: imageIndex }));
  }

  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = `${ASSETS_BASE}/icons/icon-192x192.png`;
  }

  private startCarousels(): void {
    this.data.projects.items.forEach((project, i) => {
      if (project.imgs.length <= 1) return;
      const interval = setInterval(() => {
        const current = this.getActiveImage(i);
        this.setActiveImage(i, (current + 1) % project.imgs.length);
      }, 4000);
      this.carouselIntervals.push(interval);
    });
  }
}
