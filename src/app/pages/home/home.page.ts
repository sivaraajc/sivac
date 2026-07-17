import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  inject,
} from '@angular/core';
import { Hero } from '../../components/hero/hero';
import { About } from '../../components/about/about';
import { Skills } from '../../components/skills/skills';
import { Experience } from '../../components/experience/experience';
import { Projects } from '../../components/projects/projects';
import { Services } from '../../components/services/services';
import { Testimonials } from '../../components/testimonials/testimonials';
import { Contact } from '../../components/contact/contact';
import { LenisService } from '../../services/lenis.service';
import { AnimationService } from '../../services/animation.service';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Hero, About, Skills, Experience, Projects, Services, Testimonials, Contact],
  template: `
    <app-hero />
    <app-about />
    <app-skills />
    <app-experience />
    <app-projects />
    <app-services />
    <app-testimonials />
    <app-contact />
  `,
})
export class HomePage implements AfterViewInit, OnDestroy {
  private readonly lenis = inject(LenisService);
  private readonly animation = inject(AnimationService);
  private readonly portfolio = inject(PortfolioService);
  private refreshTimer?: ReturnType<typeof setTimeout>;

  ngAfterViewInit(): void {
    this.lenis.init();
    this.animation.init();
    const ids = ['home', ...this.portfolio.portfolio().nav.map((n) => n.id)];
    this.refreshTimer = setTimeout(() => {
      this.animation.observeSections(ids);
      this.animation.refresh();
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.refreshTimer) clearTimeout(this.refreshTimer);
  }
}
