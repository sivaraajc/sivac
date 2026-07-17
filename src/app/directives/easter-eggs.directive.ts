import { Directive, HostListener, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ExperienceModeService } from '../services/experience-mode.service';

const KONAMI = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

@Directive({
  selector: '[appEasterEggs]',
  standalone: true,
})
export class EasterEggsDirective {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly mode = inject(ExperienceModeService);
  private buffer: string[] = [];

  @HostListener('document:keydown', ['$event'])
  onKey(event: KeyboardEvent): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.buffer.push(event.key.length === 1 ? event.key.toLowerCase() : event.key);
    this.buffer = this.buffer.slice(-KONAMI.length);
    if (this.buffer.join(',') === KONAMI.join(',')) {
      this.mode.toggleMatrix();
      this.burst();
      this.buffer = [];
    }
    if (event.code === 'Space' && event.target === document.body) {
      // subtle particle pop handled via CSS class flash
      document.documentElement.classList.add('space-burst');
      setTimeout(() => document.documentElement.classList.remove('space-burst'), 500);
    }
  }

  private burst(): void {
    document.documentElement.classList.add('matrix-flash');
    setTimeout(() => document.documentElement.classList.remove('matrix-flash'), 700);
  }
}
