import { Component, HostListener, inject, signal } from '@angular/core';
import { PORTFOLIO } from '../../data/portfolio.data';
import { ResumeService } from '../../services/resume.service';

@Component({
  selector: 'app-header',
  template: `
    <header class="header" [class.scrolled]="scrolled()">
      <a class="logo" href="#home" (click)="scrollTo('home', $event)">
        <img class="logo-avatar" [src]="data.avatarImage" [alt]="data.name" />
        <span class="logo-text">SC</span>
      </a>

      <nav class="nav" [class.open]="menuOpen()">
        @for (item of navItems; track item.id) {
          <a
            class="nav-link"
            [href]="'#' + item.id"
            (click)="onNavClick(item.id, $event)"
          >{{ item.label }}</a>
        }
      </nav>

      <div class="header-actions">
        <button class="cv-btn" (click)="openResume()">{{ data.header.cvBtn }}</button>
        <button class="menu-toggle" (click)="toggleMenu()" aria-label="Toggle menu">
          <span></span><span></span>
        </button>
      </div>
    </header>
  `,
  styles: `
    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 2rem 3rem;
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .header.scrolled {
      background: rgba(8, 8, 12, 0.88);
      backdrop-filter: blur(24px);
      padding: 1rem 3rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      text-decoration: none;
    }
    .logo-avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      object-fit: cover;
      object-position: center center;
      border: 2px solid rgba(129, 140, 248, 0.55);
      box-shadow: 0 0 16px rgba(99, 102, 241, 0.25);
    }
    .logo-text {
      font-family: var(--font-display);
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--text-primary);
      letter-spacing: 0.05em;
      text-transform: lowercase;
    }
    .nav {
      display: flex;
      gap: 2.5rem;
    }
    .nav-link {
      color: var(--text-muted);
      text-decoration: none;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      transition: color 0.3s;
      background: none;
      border: none;
      cursor: pointer;
      font-family: inherit;
    }
    .nav-link:hover { color: var(--text-primary); }
    .header-actions { display: flex; align-items: center; gap: 1.5rem; }
    .cv-btn {
      padding: 0.5rem 0;
      color: var(--text-muted);
      background: none;
      border: none;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      border-bottom: 1px solid transparent;
      transition: all 0.3s;
      cursor: pointer;
      font-family: inherit;
    }
    .cv-btn:hover {
      color: var(--accent-cyan);
      border-bottom-color: var(--accent-cyan);
    }
    .menu-toggle {
      display: none;
      flex-direction: column;
      gap: 6px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
    }
    .menu-toggle span {
      display: block;
      width: 22px;
      height: 1.5px;
      background: var(--text-primary);
      transition: 0.3s;
    }
    @media (max-width: 768px) {
      .header { padding: 1.25rem 1.5rem; }
      .menu-toggle { display: flex; }
      .nav {
        position: fixed;
        top: 0;
        right: -100%;
        width: 75%;
        max-width: 280px;
        height: 100vh;
        background: rgba(8, 8, 12, 0.97);
        backdrop-filter: blur(24px);
        flex-direction: column;
        padding: 5rem 2rem;
        gap: 2rem;
        transition: right 0.4s ease;
        border-left: 1px solid rgba(255,255,255,0.06);
      }
      .nav.open { right: 0; }
    }
  `,
})
export class Header {
  readonly data = PORTFOLIO;
  readonly scrolled = signal(false);
  readonly menuOpen = signal(false);
  private readonly resume = inject(ResumeService);

  readonly navItems = [
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Work' },
    { id: 'resume', label: 'Resume' },
    { id: 'contact', label: 'Contact' },
  ];

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 50);
  }

  onNavClick(id: string, event: Event): void {
    event.preventDefault();
    this.menuOpen.set(false);
    if (id === 'resume') {
      this.resume.open();
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  scrollTo(id: string, event: Event): void {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  openResume(): void {
    this.resume.open();
  }

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }
}
