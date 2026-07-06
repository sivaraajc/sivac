import { Component, inject, AfterViewInit } from '@angular/core';
import { PORTFOLIO } from '../../data/portfolio.data';
import { ScrollAnimationService } from '../../services/scroll-animation.service';

@Component({
  selector: 'app-education',
  template: `
    <section class="section education">
      <h2 class="section-title">{{ data.education.title }}</h2>
      <div class="edu-card reveal-item">
        <div class="edu-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
            <path d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5"/>
          </svg>
        </div>
        <div class="edu-content">
          <h3 class="edu-degree">{{ data.education.degree }}</h3>
          <p class="edu-school">{{ data.education.school }} — {{ data.education.location }}</p>
          <div class="edu-meta">
            <span class="edu-date">{{ data.education.date }}</span>
            <span class="edu-gpa">{{ data.education.gpa }}</span>
          </div>
        </div>
      </div>

      <h3 class="certs-title reveal-item">Certifications</h3>
      <div class="certs-list">
        @for (cert of data.certifications; track cert) {
          <div class="cert-item reveal-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" stroke-width="2">
              <circle cx="12" cy="8" r="6"/>
              <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
            </svg>
            <span>{{ cert }}</span>
          </div>
        }
      </div>
    </section>
  `,
  styles: `
    .edu-card {
      display: flex;
      gap: 1.5rem;
      align-items: flex-start;
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: 20px;
      padding: 2rem;
      backdrop-filter: blur(16px);
      margin-bottom: 2.5rem;
    }
    .edu-icon {
      flex-shrink: 0;
      width: 56px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(99, 102, 241, 0.15);
      border-radius: 14px;
      color: var(--accent-indigo);
    }
    .edu-degree {
      font-size: 1.15rem;
      font-weight: 700;
      margin: 0 0 0.5rem;
      color: var(--text-primary);
    }
    .edu-school {
      font-size: 0.95rem;
      color: var(--text-muted);
      margin: 0 0 0.75rem;
    }
    .edu-meta {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .edu-date, .edu-gpa {
      font-size: 0.85rem;
      padding: 0.3rem 0.85rem;
      background: rgba(99, 102, 241, 0.1);
      border-radius: 999px;
      color: var(--text-secondary);
    }
    .certs-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 1rem;
    }
    .certs-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .cert-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.85rem 1.25rem;
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: 12px;
      font-size: 0.9rem;
      color: var(--text-secondary);
      transition: border-color 0.3s;
    }
    .cert-item:hover {
      border-color: rgba(34, 211, 238, 0.3);
    }
    @media (max-width: 768px) {
      .edu-card { flex-direction: column; padding: 1.35rem; }
      .edu-degree { font-size: 1.05rem; }
    }
    @media (max-width: 480px) {
      .edu-card { padding: 1.15rem; border-radius: 16px; }
      .cert-item { padding: 0.75rem 1rem; font-size: 0.85rem; }
    }
  `,
})
export class Education implements AfterViewInit {
  readonly data = PORTFOLIO;
  private readonly scrollAnim = inject(ScrollAnimationService);

  ngAfterViewInit(): void {
    this.scrollAnim.sectionTitle('.education .section-title');
    this.scrollAnim.reveal('.education .reveal-item', { y: 30, stagger: 0.08 });
  }
}
