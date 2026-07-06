import { Component, inject, AfterViewInit } from '@angular/core';
import { PORTFOLIO } from '../../data/portfolio.data';
import { ResumeService } from '../../services/resume.service';
import { ScrollAnimationService } from '../../services/scroll-animation.service';
import { ResumeDevScene } from '../resume-dev-scene/resume-dev-scene';

@Component({
  selector: 'app-resume-section',
  imports: [ResumeDevScene],
  template: `
    <section id="resume" class="section resume-section">
      <div class="resume-layout reveal-item">
        <div class="resume-card">
          <div class="card-glow"></div>
          <div class="resume-card-header">
            <span class="label">Resume</span>
            <h2 class="section-title">{{ data.name }}</h2>
            <p class="subtitle">{{ data.title }}</p>
          </div>

          <div class="resume-preview-mini">
            <div class="mini-block">
              <span class="mini-label">Experience</span>
              <p>{{ data.experience.jobs.length }} roles · 3+ years</p>
            </div>
            <div class="mini-block">
              <span class="mini-label">Skills</span>
              <p>Angular · Spring Boot · FastAPI</p>
            </div>
            <div class="mini-block">
              <span class="mini-label">Education</span>
              <p>B.Tech IT · {{ data.education.gpa }}</p>
            </div>
          </div>

          <div class="resume-btns">
            <button class="btn-primary" (click)="openPreview()">Preview Resume</button>
            <button type="button" class="btn-ghost" (click)="downloadCv()">Download PDF</button>
          </div>
        </div>

        <div class="scene-panel reveal-item">
          <app-resume-dev-scene />
        </div>
      </div>
    </section>
  `,
  styles: `
    .resume-layout {
      display: grid;
      grid-template-columns: 1fr 1.15fr;
      gap: 2rem;
      align-items: stretch;
    }
    .resume-card {
      position: relative;
      padding: 2.5rem;
      border: 1px solid var(--glass-border);
      border-radius: 24px;
      background: linear-gradient(145deg, rgba(15,15,22,0.9), rgba(10,10,16,0.6));
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .card-glow {
      position: absolute;
      top: -50%;
      right: -30%;
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, rgba(34,211,238,0.12), transparent 70%);
      pointer-events: none;
    }
    .resume-card-header .label {
      font-size: 0.7rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--accent-cyan);
    }
    .resume-card-header .section-title {
      margin: 0.5rem 0 0.25rem;
      font-size: 2rem;
    }
    .subtitle { color: var(--text-muted); font-size: 1rem; margin-bottom: 2rem; }
    .resume-preview-mini {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .mini-block {
      padding: 1rem 1.25rem;
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 12px;
      background: rgba(0,0,0,0.2);
      transition: border-color 0.3s, background 0.3s;
    }
    .mini-block:hover {
      border-color: rgba(34,211,238,0.2);
      background: rgba(34,211,238,0.04);
    }
    .mini-label {
      display: block;
      font-size: 0.65rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--accent-cyan);
      margin-bottom: 0.35rem;
    }
    .mini-block p { color: var(--text-secondary); font-size: 0.9rem; margin: 0; }
    .resume-btns { display: flex; gap: 1rem; flex-wrap: wrap; }
    .btn-primary {
      padding: 0.75rem 1.75rem;
      background: linear-gradient(135deg, #22d3ee, #0891b2);
      color: #000;
      border: none;
      border-radius: 999px;
      font-weight: 700;
      font-size: 0.8rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      cursor: pointer;
      font-family: inherit;
      transition: transform 0.3s, box-shadow 0.3s;
    }
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(34,211,238,0.35);
    }
    .btn-ghost {
      padding: 0.75rem 1.75rem;
      border: 1px solid rgba(34,211,238,0.35);
      color: var(--accent-cyan);
      border-radius: 999px;
      font-weight: 600;
      font-size: 0.8rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      transition: background 0.3s;
      background: transparent;
      cursor: pointer;
      font-family: inherit;
    }
    .btn-ghost:hover { background: rgba(34,211,238,0.08); }
    .scene-panel {
      min-height: 480px;
      border-radius: 24px;
      overflow: hidden;
    }
    @media (max-width: 900px) {
      .resume-layout { grid-template-columns: 1fr; }
      .scene-panel { min-height: 400px; }
    }
  `,
})
export class ResumeSection implements AfterViewInit {
  readonly data = PORTFOLIO;
  private readonly resume = inject(ResumeService);
  private readonly scrollAnim = inject(ScrollAnimationService);

  ngAfterViewInit(): void {
    this.scrollAnim.reveal('.resume-section .reveal-item', { y: 40, stagger: 0.15 });
  }

  openPreview(): void {
    this.resume.open();
  }

  downloadCv(): void {
    this.resume.download();
  }
}
