import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DAY_PALETTES, DayPalette } from '../models/day-theme.data';

@Injectable({ providedIn: 'root' })
export class DayThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly active = signal<DayPalette>(DAY_PALETTES[new Date().getDay()] ?? DAY_PALETTES[0]);

  readonly palette = this.active.asReadonly();

  apply(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const dayIndex = new Date().getDay();
    const palette = DAY_PALETTES[dayIndex] ?? DAY_PALETTES[0];
    this.active.set(palette);
    this.setVars(document.documentElement, palette);
  }

  private setVars(root: HTMLElement, palette: DayPalette): void {
    const rgb2 = hexToRgb(palette.accent2);

    root.dataset['dayTheme'] = palette.id;
    root.style.setProperty('--day-accent', palette.accent);
    root.style.setProperty('--day-accent-2', palette.accent2);
    root.style.setProperty('--day-accent-3', palette.accent3);
    root.style.setProperty('--day-neon', palette.neon);
    root.style.setProperty('--day-glow', `rgba(${rgb2.r}, ${rgb2.g}, ${rgb2.b}, 0.4)`);
    root.style.setProperty('--day-border', `rgba(${rgb2.r}, ${rgb2.g}, ${rgb2.b}, 0.16)`);
    root.style.setProperty('--day-border-strong', `rgba(${rgb2.r}, ${rgb2.g}, ${rgb2.b}, 0.28)`);
    root.style.setProperty('--day-shadow-glow', `0 0 90px rgba(${rgb2.r}, ${rgb2.g}, ${rgb2.b}, 0.22)`);
    root.style.setProperty('--day-btn-shadow', `0 12px 44px rgba(${rgb2.r}, ${rgb2.g}, ${rgb2.b}, 0.35)`);
    root.style.setProperty('--day-selection', `rgba(${rgb2.r}, ${rgb2.g}, ${rgb2.b}, 0.35)`);
    root.style.setProperty('--day-card-hover-border', `rgba(${rgb2.r}, ${rgb2.g}, ${rgb2.b}, 0.4)`);
    root.style.setProperty('--day-ghost-hover-border', `rgba(${rgb2.r}, ${rgb2.g}, ${rgb2.b}, 0.45)`);

    const neonRgb = hexToRgb(palette.neon);
    root.style.setProperty('--day-neon-bg', `rgba(${neonRgb.r}, ${neonRgb.g}, ${neonRgb.b}, 0.08)`);
    root.style.setProperty('--day-neon-border', `rgba(${neonRgb.r}, ${neonRgb.g}, ${neonRgb.b}, 0.35)`);
    root.style.setProperty('--day-neon-shadow', `0 0 30px rgba(${neonRgb.r}, ${neonRgb.g}, ${neonRgb.b}, 0.25)`);
  }
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const value = hex.replace('#', '');
  const full = value.length === 3 ? value.replace(/./g, (c) => c + c) : value;
  const num = Number.parseInt(full, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}
