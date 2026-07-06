import { Component, inject, AfterViewInit } from '@angular/core';
import { PORTFOLIO } from '../../data/portfolio.data';
import { ScrollAnimationService } from '../../services/scroll-animation.service';

@Component({
  selector: 'app-skills',
  template: `
    <section class="section skills">
      <h2 class="section-title">Technical Skills</h2>
      <div class="skills-grid">
        @for (group of data.skills; track group.category) {
          <div class="skill-card reveal-item">
            <h3 class="skill-category">{{ group.category }}</h3>
            <div class="skill-tags">
              @for (skill of group.items; track skill) {
                <span class="skill-tag">{{ skill }}</span>
              }
            </div>
          </div>
        }
      </div>
    </section>
  `,
  styles: `
    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.25rem;
    }
    .skill-card {
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: 16px;
      padding: 1.5rem;
      backdrop-filter: blur(12px);
      transition: transform 0.3s, border-color 0.3s;
    }
    .skill-card:hover {
      transform: translateY(-4px);
      border-color: rgba(34, 211, 238, 0.3);
    }
    .skill-category {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--accent-cyan);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin: 0 0 1rem;
    }
    .skill-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .skill-tag {
      padding: 0.35rem 0.85rem;
      background: rgba(99, 102, 241, 0.1);
      border: 1px solid rgba(99, 102, 241, 0.2);
      border-radius: 999px;
      font-size: 0.82rem;
      color: var(--text-secondary);
      transition: all 0.2s;
    }
    .skill-tag:hover {
      background: rgba(99, 102, 241, 0.2);
      color: var(--text-primary);
    }
  `,
})
export class Skills implements AfterViewInit {
  readonly data = PORTFOLIO;
  private readonly scrollAnim = inject(ScrollAnimationService);

  ngAfterViewInit(): void {
    this.scrollAnim.sectionTitle('.skills .section-title');
    this.scrollAnim.reveal('.skills .reveal-item', { y: 30, stagger: 0.08 });
  }
}
