import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Injectable({ providedIn: 'root' })
export class ScrollAnimationService {
  private readonly platformId = inject(PLATFORM_ID);
  private initialized = false;

  init(): void {
    if (!isPlatformBrowser(this.platformId) || this.initialized) return;
    gsap.registerPlugin(ScrollTrigger);
    this.initialized = true;
  }

  reveal(selector: string, options?: { y?: number; stagger?: number; delay?: number }): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.init();

    const elements = document.querySelectorAll(selector);
    if (!elements.length) return;

    gsap.fromTo(
      elements,
      { opacity: 0, y: options?.y ?? 60 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: options?.stagger ?? 0.12,
        delay: options?.delay ?? 0,
        scrollTrigger: {
          trigger: elements[0],
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      },
    );
  }

  parallax(selector: string, speed = 0.3): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.init();

    const el = document.querySelector(selector);
    if (!el) return;

    gsap.to(el, {
      yPercent: speed * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  heroEntrance(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.init();

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.from('.hero-pretitle-left', { opacity: 0, x: -40, duration: 0.9 })
      .from('.hero-name', { opacity: 0, x: -60, duration: 1.1 }, '-=0.6')
      .from('.hero-center', { opacity: 0, scale: 0.85, duration: 1.2 }, '-=0.8')
      .from('.hero-pretitle-right', { opacity: 0, x: 40, duration: 0.9 }, '-=1')
      .from('.hero-role', { opacity: 0, x: 60, duration: 1.1 }, '-=0.7')
      .from('.hero-bottom', { opacity: 0, y: 20, duration: 0.7 }, '-=0.4');
  }

  sectionTitle(selector: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.init();

    gsap.fromTo(
      selector,
      { opacity: 0, x: -40 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: selector,
          start: 'top 88%',
        },
      },
    );
  }

  refresh(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    ScrollTrigger.refresh();
  }
}
