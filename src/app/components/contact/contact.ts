import { Component, inject, AfterViewInit } from '@angular/core';
import { PORTFOLIO } from '../../data/portfolio.data';
import { ScrollAnimationService } from '../../services/scroll-animation.service';

@Component({
  selector: 'app-contact',
  template: `
    <section id="contact" class="section contact">
      <p class="contact-pretitle reveal-item">{{ data.contact.pretitle }}</p>
      <h2 class="section-title contact-title reveal-item">{{ data.contact.title }}</h2>
      <p class="contact-content reveal-item">{{ data.contact.content }}</p>

      <div class="contact-actions reveal-item">
        <a class="btn-primary" [href]="'mailto:' + data.email">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="4" width="20" height="16" rx="2"/>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
          {{ data.contact.btn }}
        </a>
        <a class="btn-ghost" [href]="'tel:' + data.phone.replace(/\s/g, '')">
          {{ data.phone }}
        </a>
      </div>

      <div class="contact-links reveal-item">
        <a [href]="data.linkedin" target="_blank" rel="noopener">LinkedIn</a>
        <span class="divider">·</span>
        <a [href]="data.github" target="_blank" rel="noopener">GitHub</a>
        <span class="divider">·</span>
        <a [href]="data.email">{{ data.email }}</a>
      </div>
    </section>

    <section id="chat" class="section chat-section">
      <div class="chat-card reveal-item">
        <div class="chat-glow"></div>
        <h3 class="chat-title">{{ data.chat.title }}</h3>
        <p class="chat-desc">{{ data.chat.description }}</p>
        <a class="btn-primary" [href]="data.chat.link" target="_blank" rel="noopener">
          {{ data.chat.btn }}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </a>
      </div>
    </section>

    <footer class="footer">
      <p>&copy; {{ year }} {{ data.name }}. Built with Angular & Three.js</p>
    </footer>
  `,
  styles: `
    .contact {
      text-align: center;
      padding-bottom: 2rem;
    }
    .contact-pretitle {
      font-size: 1rem;
      color: var(--accent-cyan);
      text-transform: uppercase;
      letter-spacing: 0.15em;
      margin-bottom: 0.5rem;
    }
    .contact-title { margin-bottom: 1rem; }
    .contact-content {
      max-width: 550px;
      margin: 0 auto 2rem;
      font-size: 1.05rem;
      line-height: 1.8;
      color: var(--text-secondary);
    }
    .contact-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: 2rem;
    }
    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.85rem 2rem;
      background: linear-gradient(135deg, var(--accent-indigo), #4f46e5);
      color: white;
      border-radius: 999px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s;
      box-shadow: 0 4px 25px rgba(99, 102, 241, 0.4);
    }
    .btn-primary:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 35px rgba(99, 102, 241, 0.55);
    }
    .btn-ghost {
      display: inline-flex;
      align-items: center;
      padding: 0.85rem 2rem;
      border: 1px solid rgba(99, 102, 241, 0.4);
      color: var(--text-primary);
      border-radius: 999px;
      text-decoration: none;
      font-weight: 600;
      background: rgba(99, 102, 241, 0.05);
      transition: all 0.3s;
    }
    .btn-ghost:hover {
      background: rgba(99, 102, 241, 0.15);
    }
    .contact-links {
      display: flex;
      gap: 0.75rem;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
    }
    .contact-links a {
      color: var(--text-muted);
      text-decoration: none;
      font-size: 0.9rem;
      transition: color 0.3s;
    }
    .contact-links a:hover { color: var(--accent-cyan); }
    .divider { color: var(--text-muted); opacity: 0.4; }
    .chat-section { padding-top: 0; }
    .chat-card {
      position: relative;
      text-align: center;
      padding: 3rem 2rem;
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: 24px;
      backdrop-filter: blur(16px);
      overflow: hidden;
    }
    .chat-glow {
      position: absolute;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(34,211,238,0.12) 0%, transparent 70%);
      top: -100px;
      right: -50px;
      pointer-events: none;
    }
    .chat-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0 0 0.75rem;
      position: relative;
    }
    .chat-desc {
      color: var(--text-secondary);
      margin: 0 0 1.5rem;
      position: relative;
    }
    .footer {
      text-align: center;
      padding: 3rem 2rem;
      color: var(--text-muted);
      font-size: 0.85rem;
      border-top: 1px solid var(--glass-border);
      margin-top: 2rem;
    }
  `,
})
export class Contact implements AfterViewInit {
  readonly data = PORTFOLIO;
  readonly year = new Date().getFullYear();
  private readonly scrollAnim = inject(ScrollAnimationService);

  ngAfterViewInit(): void {
    this.scrollAnim.reveal('#contact .reveal-item', { y: 40, stagger: 0.1 });
    this.scrollAnim.reveal('.chat-section .reveal-item', { y: 40 });
  }
}
