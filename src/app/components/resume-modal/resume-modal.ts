import { Component, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PORTFOLIO } from '../../data/portfolio.data';
import { ResumeService } from '../../services/resume.service';

@Component({
  selector: 'app-resume-modal',
  template: `
    @if (resume.modalOpen()) {
      <div class="overlay" (click)="resume.close()" role="dialog" aria-modal="true">
        <div class="modal" (click)="$event.stopPropagation()">
          <header class="modal-header">
            <h2>Resume Preview</h2>
            <div class="modal-actions">
              <button class="tab" [class.active]="tab() === 'preview'" (click)="tab.set('preview')">Preview</button>
              <button class="tab" [class.active]="tab() === 'pdf'" (click)="tab.set('pdf')">PDF</button>
              <button type="button" class="download" (click)="resume.download()">Download</button>
              <button class="close" (click)="resume.close()" aria-label="Close">&times;</button>
            </div>
          </header>

          <div class="modal-body">
            @if (tab() === 'preview') {
              <div class="resume-doc">
                <div class="resume-header">
                  <h1>{{ data.name }}</h1>
                  <p class="resume-title">{{ data.title }}</p>
                  <p class="resume-meta">
                    {{ data.location }} · {{ data.email }} · {{ data.phone }}
                  </p>
                </div>

                <section>
                  <h3>Professional Summary</h3>
                  <p>{{ summary }}</p>
                </section>

                <section>
                  <h3>Technical Skills</h3>
                  <div class="skill-rows">
                    @for (group of data.skills; track group.category) {
                      <p><strong>{{ group.category }}:</strong> {{ group.items.join(', ') }}</p>
                    }
                  </div>
                </section>

                <section>
                  <h3>Experience</h3>
                  @for (job of data.experience.jobs; track job.tab) {
                    <div class="job">
                      <div class="job-head">
                        <strong>{{ job.title }}</strong>
                        <span>{{ job.date }}</span>
                      </div>
                      <p class="company">{{ job.company }}</p>
                      <ul>
                        @for (line of job.description.slice(0, 5); track line) {
                          <li>{{ line }}</li>
                        }
                      </ul>
                    </div>
                  }
                </section>

                <section>
                  <h3>Education</h3>
                  <p><strong>{{ data.education.degree }}</strong></p>
                  <p>{{ data.education.school }} — {{ data.education.date }} · {{ data.education.gpa }}</p>
                </section>
              </div>
            } @else {
              <iframe class="pdf-frame" [src]="pdfUrl" title="Resume PDF"></iframe>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    .overlay {
      position: fixed;
      inset: 0;
      z-index: 200;
      background: rgba(0, 0, 0, 0.82);
      backdrop-filter: blur(12px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      animation: fadeIn 0.3s ease;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .modal {
      width: min(900px, 100%);
      max-height: 90vh;
      background: #0f0f14;
      border: 1px solid rgba(34, 211, 238, 0.15);
      border-radius: 20px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 40px 100px rgba(0,0,0,0.6);
    }
    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      flex-wrap: wrap;
      gap: 1rem;
    }
    .modal-header h2 {
      font-size: 1rem;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--accent-cyan);
    }
    .modal-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }
    .tab {
      background: transparent;
      border: 1px solid rgba(255,255,255,0.1);
      color: var(--text-muted);
      padding: 0.4rem 1rem;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.25s;
    }
    .tab.active, .tab:hover {
      color: var(--text-primary);
      border-color: var(--accent-cyan);
    }
    .download {
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--accent-cyan);
      text-decoration: none;
      padding: 0.4rem 1rem;
      border: 1px solid rgba(34,211,238,0.3);
      border-radius: 999px;
      transition: background 0.25s;
      background: transparent;
      cursor: pointer;
      font-family: inherit;
    }
    .download:hover { background: rgba(34,211,238,0.1); }
    .close {
      background: none;
      border: none;
      color: var(--text-muted);
      font-size: 1.75rem;
      cursor: pointer;
      line-height: 1;
      padding: 0 0.25rem;
    }
    .close:hover { color: white; }
    .modal-body {
      overflow-y: auto;
      flex: 1;
      padding: 1.5rem;
    }
    .pdf-frame {
      width: 100%;
      height: 70vh;
      border: none;
      border-radius: 12px;
      background: #1a1a1a;
    }
    .resume-doc {
      color: #e2e8f0;
      font-size: 0.9rem;
      line-height: 1.7;
      max-width: 720px;
      margin: 0 auto;
    }
    .resume-header {
      text-align: center;
      padding-bottom: 1.5rem;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .resume-header h1 {
      font-size: 1.75rem;
      font-weight: 800;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      margin-bottom: 0.35rem;
    }
    .resume-title { color: var(--accent-cyan); font-weight: 600; margin-bottom: 0.5rem; }
    .resume-meta { font-size: 0.8rem; color: var(--text-muted); }
    section { margin-bottom: 1.5rem; }
    section h3 {
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--accent-cyan);
      margin-bottom: 0.75rem;
      padding-bottom: 0.35rem;
      border-bottom: 1px solid rgba(34,211,238,0.2);
    }
    .job { margin-bottom: 1.25rem; }
    .job-head {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .job-head span { color: var(--text-muted); font-size: 0.82rem; }
    .company { color: var(--text-secondary); font-size: 0.85rem; margin: 0.25rem 0 0.5rem; }
    ul { padding-left: 1.25rem; color: var(--text-secondary); }
    li { margin-bottom: 0.35rem; }
    .skill-rows p { margin-bottom: 0.4rem; color: var(--text-secondary); }
    .skill-rows strong { color: var(--text-primary); }
  `,
})
export class ResumeModal {
  readonly data = PORTFOLIO;
  readonly resume = inject(ResumeService);
  private readonly sanitizer = inject(DomSanitizer);
  readonly tab = signal<'preview' | 'pdf'>('preview');

  readonly pdfUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    `${PORTFOLIO.cvPath}#toolbar=0&navpanes=0`,
  );

  readonly summary =
    'Senior Software Engineer with 3+ years building scalable web applications. Expert in Angular, TypeScript, Java Spring Boot, and Python FastAPI. Proven delivery across enterprise ERP, oil & gas, and e-commerce with measurable performance gains.';
}
