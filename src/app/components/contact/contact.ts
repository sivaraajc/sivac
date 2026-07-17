import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PortfolioService } from '../../services/portfolio.service';
import { SectionHeading } from '../../shared/section-heading/section-heading';
import { RevealDirective } from '../../directives/reveal.directive';
import { MagneticDirective } from '../../directives/magnetic.directive';
import { fadeIn } from '../../animations/portfolio.animations';
import {
  LucideCopy,
  LucideCheck,
  LucideMail,
  LucideSend,
} from '@lucide/angular';
import { SocialIcon } from '../../shared/social-icon/social-icon';

@Component({
  selector: 'app-contact',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    SectionHeading,
    RevealDirective,
    MagneticDirective,
    LucideCopy,
    LucideCheck,
    LucideMail,
    LucideSend,
    SocialIcon,
  ],
  animations: [fadeIn],
  template: `
    <section id="contact" class="section-pad relative z-10">
      <div class="container-premium">
        <app-section-heading
          [eyebrow]="p().contact.pretitle"
          [title]="p().contact.title"
          [subtitle]="p().contact.content"
        />

        <div class="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div class="space-y-4" appReveal="left">
            <div class="card-premium p-6">
              <p class="text-xs uppercase tracking-[0.2em] text-text-dim">Email</p>
              <div class="mt-3 flex items-center justify-between gap-3">
                <a class="truncate text-lg text-accent hover:underline" [href]="'mailto:' + p().email">{{ p().email }}</a>
                <button
                  type="button"
                  class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface"
                  [attr.aria-label]="copied() ? 'Email copied' : 'Copy email'"
                  (click)="copyEmail()"
                >
                  @if (copied()) {
                    <svg lucideCheck [size]="16" class="text-accent"></svg>
                  } @else {
                    <svg lucideCopy [size]="16"></svg>
                  }
                </button>
              </div>
            </div>
            <div class="card-premium p-6">
              <p class="text-xs uppercase tracking-[0.2em] text-text-dim">Phone</p>
              <p class="mt-3 text-lg">{{ p().phone }}</p>
            </div>
            <div class="flex gap-3">
              <a [href]="p().github" target="_blank" rel="noopener" class="social" aria-label="GitHub">
                <app-social-icon name="github" />
              </a>
              <a [href]="p().linkedin" target="_blank" rel="noopener" class="social" aria-label="LinkedIn">
                <app-social-icon name="linkedin" />
              </a>
              <a [href]="'mailto:' + p().email" class="social" aria-label="Email">
                <svg lucideMail [size]="18"></svg>
              </a>
            </div>
          </div>

          <form class="card-premium space-y-5 p-6 md:p-8" [formGroup]="form" (ngSubmit)="submit()" appReveal="right">
            <div class="field">
              <input id="name" type="text" formControlName="name" placeholder=" " required />
              <label for="name">Your name</label>
              @if (showError('name')) {
                <span class="error">Name is required</span>
              }
            </div>
            <div class="field">
              <input id="email" type="email" formControlName="email" placeholder=" " required />
              <label for="email">Email address</label>
              @if (showError('email')) {
                <span class="error">Valid email is required</span>
              }
            </div>
            <div class="field">
              <textarea id="message" rows="5" formControlName="message" placeholder=" " required></textarea>
              <label for="message">Message</label>
              @if (showError('message')) {
                <span class="error">Please share a short message</span>
              }
            </div>

            <button class="magnetic-btn btn-primary w-full sm:w-auto" type="submit" appMagnetic [disabled]="form.invalid || sending()">
              <svg lucideSend [size]="16"></svg>
              {{ sending() ? 'Sending…' : p().contact.btn }}
            </button>

            @if (success()) {
              <p class="text-sm text-accent" @fadeIn>Message prepared — your mail client should open shortly. Thank you!</p>
            }
          </form>
        </div>
      </div>
    </section>
  `,
  styles: `
    .field {
      position: relative;
    }
    .field input,
    .field textarea {
      width: 100%;
      border-radius: 16px;
      border: 1px solid var(--color-border);
      background: rgba(255, 255, 255, 0.02);
      padding: 1.35rem 1rem 0.75rem;
      color: var(--color-text);
      outline: none;
      transition: border-color 0.25s ease, box-shadow 0.25s ease;
    }
    .field textarea {
      resize: vertical;
      min-height: 140px;
    }
    .field label {
      position: absolute;
      left: 1rem;
      top: 1.05rem;
      color: var(--color-text-dim);
      pointer-events: none;
      transition: transform 0.2s ease, font-size 0.2s ease, color 0.2s ease;
    }
    .field input:focus,
    .field textarea:focus,
    .field input:not(:placeholder-shown),
    .field textarea:not(:placeholder-shown) {
      border-color: rgba(45, 212, 191, 0.45);
      box-shadow: 0 0 0 3px rgba(45, 212, 191, 0.08);
    }
    .field input:focus + label,
    .field textarea:focus + label,
    .field input:not(:placeholder-shown) + label,
    .field textarea:not(:placeholder-shown) + label {
      transform: translateY(-0.55rem);
      font-size: 0.7rem;
      color: #2dd4bf;
    }
    .error {
      display: block;
      margin-top: 0.4rem;
      font-size: 0.75rem;
      color: #f87171;
    }
    .social {
      display: inline-flex;
      height: 44px;
      width: 44px;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      border: 1px solid var(--color-border);
      background: rgba(255, 255, 255, 0.03);
      transition: 0.3s ease;
    }
    .social:hover {
      border-color: rgba(45, 212, 191, 0.4);
      color: #2dd4bf;
      transform: translateY(-2px);
    }
  `,
})
export class Contact {
  private readonly portfolio = inject(PortfolioService);
  private readonly fb = inject(FormBuilder);

  readonly p = () => this.portfolio.portfolio();
  readonly copied = signal(false);
  readonly sending = signal(false);
  readonly success = signal(false);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  showError(control: 'name' | 'email' | 'message'): boolean {
    const c = this.form.controls[control];
    return c.invalid && (c.dirty || c.touched);
  }

  async copyEmail(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.p().email);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1800);
    } catch {
      this.copied.set(false);
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.sending.set(true);
    const { name, email, message } = this.form.getRawValue();
    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:${this.p().email}?subject=${subject}&body=${body}`;
    this.success.set(true);
    this.sending.set(false);
    this.form.reset();
  }
}
