import { Directive, ElementRef, OnInit, OnDestroy, inject, input, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type RevealType = 'up' | 'left' | 'right' | 'scale' | 'blur';

function toReveal(value: string | RevealType | null | undefined): RevealType {
  if (value === 'left' || value === 'right' || value === 'scale' || value === 'blur') return value;
  return 'up';
}

@Directive({
  selector: '[appReveal]',
  standalone: true,
})
export class RevealDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly platformId = inject(PLATFORM_ID);
  private trigger?: ScrollTrigger;

  readonly appReveal = input('up', { transform: toReveal });
  readonly revealDelay = input(0);
  readonly revealOnce = input(true);

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    gsap.registerPlugin(ScrollTrigger);

    const type = this.appReveal();
    const from: gsap.TweenVars = { opacity: 0 };
    if (type === 'up') from.y = 48;
    if (type === 'left') from.x = -48;
    if (type === 'right') from.x = 48;
    if (type === 'scale') from.scale = 0.9;
    if (type === 'blur') from.filter = 'blur(10px)';

    const tween = gsap.fromTo(this.el.nativeElement, from, {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      duration: 1,
      delay: this.revealDelay(),
      ease: 'power3.out',
      scrollTrigger: {
        trigger: this.el.nativeElement,
        start: 'top 88%',
        toggleActions: this.revealOnce() ? 'play none none none' : 'play none none reverse',
      },
    });

    this.trigger = tween.scrollTrigger;
  }

  ngOnDestroy(): void {
    this.trigger?.kill();
  }
}
