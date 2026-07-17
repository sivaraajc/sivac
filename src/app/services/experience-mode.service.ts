import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ExperienceModeService {
  private readonly platformId = inject(PLATFORM_ID);
  readonly matrixMode = signal(false);
  readonly musicOn = signal(false);
  readonly loaderDone = signal(false);

  toggleMatrix(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const next = !this.matrixMode();
    this.matrixMode.set(next);
    document.documentElement.classList.toggle('matrix-mode', next);
  }

  setLoaderDone(): void {
    this.loaderDone.set(true);
  }
}
