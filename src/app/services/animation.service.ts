import { Injectable, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Injectable({ providedIn: 'root' })
export class AnimationService {
  private readonly platformId = inject(PLATFORM_ID);
  private ready = false;
  readonly scrollProgress = signal(0);
  readonly activeSection = signal('home');

  init(): void {
    if (!isPlatformBrowser(this.platformId) || this.ready) return;
    gsap.registerPlugin(ScrollTrigger);
    this.ready = true;

    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => this.scrollProgress.set(Math.round(self.progress * 100)),
    });
  }

  observeSections(ids: string[]): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.init();

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      ScrollTrigger.create({
        trigger: el,
        start: 'top 45%',
        end: 'bottom 45%',
        onEnter: () => this.activeSection.set(id),
        onEnterBack: () => this.activeSection.set(id),
      });
    });
  }

  heroTimeline(root: HTMLElement): gsap.core.Timeline | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    this.init();

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.from(root.querySelectorAll('[data-hero="eyebrow"]'), { opacity: 0, y: 24, duration: 0.7 })
      .from(root.querySelectorAll('[data-hero="title"]'), { opacity: 0, y: 60, duration: 1 }, '-=0.35')
      .from(root.querySelectorAll('[data-hero="subtitle"]'), { opacity: 0, y: 30, duration: 0.8 }, '-=0.55')
      .from(root.querySelectorAll('[data-hero="cta"]'), { opacity: 0, y: 24, stagger: 0.1, duration: 0.7 }, '-=0.45')
      .from(root.querySelectorAll('[data-hero="visual"]'), { opacity: 0, scale: 0.88, duration: 1.1 }, '-=0.9')
      .from(root.querySelectorAll('[data-hero="scroll"]'), { opacity: 0, y: 16, duration: 0.6 }, '-=0.5');
    return tl;
  }

  revealBatch(selector: string, options?: { y?: number; stagger?: number }): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.init();

    gsap.utils.toArray<HTMLElement>(selector).forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: options?.y ?? 48, filter: 'blur(8px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
        },
      );
    });
  }

  staggerChildren(container: string, child: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.init();

    const root = document.querySelector(container);
    if (!root) return;

    gsap.from(root.querySelectorAll(child), {
      opacity: 0,
      y: 36,
      duration: 0.85,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: root,
        start: 'top 80%',
      },
    });
  }

  refresh(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    ScrollTrigger.refresh();
  }
}
