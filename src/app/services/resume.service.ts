import { Injectable, signal } from '@angular/core';
import { PORTFOLIO } from '../data/portfolio.data';

@Injectable({ providedIn: 'root' })
export class ResumeService {
  readonly modalOpen = signal(false);

  open(): void {
    this.modalOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  close(): void {
    this.modalOpen.set(false);
    document.body.style.overflow = '';
  }

  async download(): Promise<void> {
    const { cvPath, cvName } = PORTFOLIO;

    try {
      const res = await fetch(cvPath);
      if (!res.ok) throw new Error('CV not found');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = cvName;
      link.rel = 'noopener';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      window.open(cvPath, '_blank', 'noopener');
    }
  }
}
