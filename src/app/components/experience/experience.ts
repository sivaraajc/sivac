import { Component, inject, AfterViewInit, signal } from '@angular/core';
import { PORTFOLIO } from '../../data/portfolio.data';
import { ScrollAnimationService } from '../../services/scroll-animation.service';

@Component({
  selector: 'app-experience',
  template: `
    <section id="experience" class="section experience">
      <h2 class="section-title">{{ data.experience.title }}</h2>

      <div class="exp-tabs reveal-item">
        @for (job of data.experience.jobs; track job.tab; let i = $index) {
          <button
            class="exp-tab"
            [class.active]="activeTab() === i"
            (click)="setTab(i)"
          >{{ job.tab }}</button>
        }
      </div>

      @for (job of data.experience.jobs; track job.tab; let i = $index) {
        @if (activeTab() === i) {
          <div class="exp-card reveal-item">
            <div class="exp-header">
              <div>
                <h3 class="exp-title">{{ job.title }}</h3>
                <p class="exp-company">{{ job.company }}</p>
              </div>
              <span class="exp-date">{{ job.date }}</span>
            </div>
            <ul class="exp-list">
              @for (item of job.description; track item) {
                <li class="exp-item">{{ item }}</li>
              }
            </ul>
          </div>
        }
      }
    </section>
  `,
  styles: `
    .exp-tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }
    .exp-tab {
      padding: 0.65rem 1.5rem;
      background: transparent;
      border: 1px solid var(--glass-border);
      border-radius: 999px;
      color: var(--text-muted);
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      font-family: inherit;
    }
    .exp-tab:hover {
      border-color: rgba(99, 102, 241, 0.4);
      color: var(--text-primary);
    }
    .exp-tab.active {
      background: linear-gradient(135deg, var(--accent-indigo), #4f46e5);
      border-color: transparent;
      color: white;
      box-shadow: 0 4px 20px rgba(99, 102, 241, 0.35);
    }
    .exp-card {
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: 20px;
      padding: 2rem;
      backdrop-filter: blur(16px);
      animation: fadeIn 0.5s ease;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .exp-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }
    .exp-title {
      font-size: 1.35rem;
      font-weight: 700;
      margin: 0;
      color: var(--text-primary);
    }
    .exp-company {
      font-size: 0.95rem;
      color: var(--accent-cyan);
      margin: 0.25rem 0 0;
    }
    .exp-date {
      font-size: 0.85rem;
      color: var(--text-muted);
      padding: 0.35rem 1rem;
      background: rgba(99, 102, 241, 0.1);
      border-radius: 999px;
      white-space: nowrap;
    }
    .exp-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .exp-item {
      position: relative;
      padding-left: 1.5rem;
      margin-bottom: 0.85rem;
      font-size: 0.95rem;
      line-height: 1.7;
      color: var(--text-secondary);
    }
    .exp-item::before {
      content: '▹';
      position: absolute;
      left: 0;
      color: var(--accent-indigo);
      font-weight: bold;
    }
    @media (max-width: 768px) {
      .exp-tab { padding: 0.55rem 1.1rem; font-size: 0.82rem; }
      .exp-card { padding: 1.35rem; border-radius: 16px; }
      .exp-header { flex-direction: column; align-items: flex-start; }
      .exp-date { align-self: flex-start; }
      .exp-title { font-size: 1.15rem; }
    }
    @media (max-width: 480px) {
      .exp-tabs { gap: 0.4rem; }
      .exp-tab { padding: 0.5rem 0.9rem; font-size: 0.75rem; }
      .exp-item { font-size: 0.9rem; }
    }
  `,
})
export class Experience implements AfterViewInit {
  readonly data = PORTFOLIO;
  readonly activeTab = signal(0);
  private readonly scrollAnim = inject(ScrollAnimationService);

  ngAfterViewInit(): void {
    this.scrollAnim.sectionTitle('#experience .section-title');
    this.scrollAnim.reveal('#experience .reveal-item', { y: 40 });
  }

  setTab(index: number): void {
    this.activeTab.set(index);
  }
}
