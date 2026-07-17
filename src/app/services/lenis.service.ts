import { Injectable, inject, PLATFORM_ID, NgZone, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Injectable({ providedIn: 'root' })
export class LenisService implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly zone = inject(NgZone);
  private lenis: Lenis | null = null;
  private tickerFn?: (time: number) => void;

  init(): void {
    if (!isPlatformBrowser(this.platformId) || this.lenis) return;

    gsap.registerPlugin(ScrollTrigger);

    this.zone.runOutsideAngular(() => {
      this.lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.35,
        autoRaf: false,
      });

      this.lenis.on('scroll', ScrollTrigger.update);

      this.tickerFn = (time: number) => {
        this.lenis?.raf(time * 1000);
      };
      gsap.ticker.add(this.tickerFn);
      gsap.ticker.lagSmoothing(0);
    });
  }

  scrollTo(target: string | number | HTMLElement, offset = -88): void {
    this.lenis?.scrollTo(target, { offset, duration: 1.25 });
  }

  stop(): void {
    this.lenis?.stop();
  }

  start(): void {
    this.lenis?.start();
  }

  get instance(): Lenis | null {
    return this.lenis;
  }

  ngOnDestroy(): void {
    if (this.tickerFn) gsap.ticker.remove(this.tickerFn);
    this.lenis?.destroy();
    this.lenis = null;
  }
}
