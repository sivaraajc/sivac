import {
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
  inject,
  input,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Directive({
  selector: '[appCountUp]',
  standalone: true,
})
export class CountUpDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly platformId = inject(PLATFORM_ID);
  readonly appCountUp = input.required<number>();
  readonly suffix = input('');
  readonly duration = input(1.6);
  private trigger?: ScrollTrigger;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.el.nativeElement.textContent = `${this.appCountUp()}${this.suffix()}`;
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const obj = { val: 0 };
    const tween = gsap.to(obj, {
      val: this.appCountUp(),
      duration: this.duration(),
      ease: 'power2.out',
      paused: true,
      onUpdate: () => {
        this.el.nativeElement.textContent = `${Math.floor(obj.val)}${this.suffix()}`;
      },
    });

    this.trigger = ScrollTrigger.create({
      trigger: this.el.nativeElement,
      start: 'top 90%',
      onEnter: () => tween.play(),
    });
  }

  ngOnDestroy(): void {
    this.trigger?.kill();
  }
}
