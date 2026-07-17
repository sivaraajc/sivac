import { Component, input } from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';

@Component({
  selector: 'app-section-heading',
  standalone: true,
  imports: [RevealDirective],
  template: `
    <div class="mb-10 md:mb-14" appReveal>
      @if (eyebrow()) {
        <p class="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-accent">{{ eyebrow() }}</p>
      }
      <h2 class="font-display text-3xl font-semibold tracking-tight text-text md:text-5xl">
        {{ title() }}
      </h2>
      @if (subtitle()) {
        <p class="mt-4 max-w-2xl text-base text-text-muted md:text-lg">{{ subtitle() }}</p>
      }
    </div>
  `,
  styles: `
    :host { display: block; }
  `,
  host: { class: 'block' },
})
export class SectionHeading {
  readonly eyebrow = input('');
  readonly title = input.required<string>();
  readonly subtitle = input('');
}
