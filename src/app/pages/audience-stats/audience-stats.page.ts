import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PortfolioAudienceService } from '../../services/portfolio-audience.service';
import { environment } from '../../../environments/environment';

const LIMIT_OPTIONS = [100, 200, 300, 400] as const;
const DEFAULT_LIMIT = 100;

@Component({
  selector: 'app-audience-stats-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  styles: [
    `
      .limit-picker {
        display: inline-flex;
        gap: 0.25rem;
        padding: 0.2rem;
        border-radius: 0.5rem;
        border: 1px solid var(--color-border, rgba(255, 255, 255, 0.12));
        background: #0a0f1f;
      }
      .limit-picker button {
        min-width: 2.75rem;
        padding: 0.35rem 0.55rem;
        border-radius: 0.35rem;
        font-size: 0.75rem;
        font-family: var(--font-mono, ui-monospace, monospace);
        color: #94a3b8;
        background: transparent;
        border: none;
        cursor: pointer;
        transition:
          color 0.15s ease,
          background 0.15s ease;
      }
      .limit-picker button:hover {
        color: #f8fafc;
        background: rgba(255, 255, 255, 0.06);
      }
      .limit-picker button.is-active {
        color: #050816;
        background: var(--day-accent, #4ecdc4);
        font-weight: 600;
      }
    `,
  ],
  template: `
    <div class="min-h-[100svh] bg-bg px-4 py-10 text-text">
      <div class="container-premium mx-auto max-w-3xl">
        @if (!authorized()) {
          <div class="card-premium gradient-border p-8 text-center">
            <h1 class="font-display text-2xl font-semibold">Private stats</h1>
            <p class="mt-3 text-sm text-text-muted">
              Add your secret key to the URL:
              <code class="text-accent">/private/audience?key=YOUR_KEY</code>
            </p>
            <a routerLink="/" class="mt-6 inline-block text-sm text-accent hover:underline">← Back to portfolio</a>
          </div>
        } @else {
          <div class="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p class="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">Owner only</p>
              <h1 class="font-display text-3xl font-semibold">Portfolio audience</h1>
              <p class="mt-2 text-sm text-text-muted">
                Background only. Names/emails appear when someone uses the contact form; other visits show
                approximate city &amp; device (from IP), not their exact home address.
              </p>
            </div>
            <a class="magnetic-btn btn-ghost text-sm" [href]="mailtoReport()"> Email this report </a>
          </div>

          <div class="mb-6 grid gap-4 sm:grid-cols-2">
            <div class="card-premium gradient-border p-6">
              <p class="font-mono text-[10px] uppercase tracking-[0.18em] text-text-dim">Total views</p>
              <p class="mt-2 font-display text-4xl font-semibold text-accent">{{ totalViews() ?? '…' }}</p>
            </div>
            <div class="card-premium gradient-border p-6">
              <p class="font-mono text-[10px] uppercase tracking-[0.18em] text-text-dim">Identified members</p>
              <p class="mt-2 font-display text-4xl font-semibold text-accent-2">{{ memberCount() }}</p>
            </div>
          </div>

          <div class="card-premium gradient-border overflow-hidden">
            <div
              class="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3"
            >
              <div>
                <p class="font-mono text-xs uppercase tracking-[0.16em] text-text-dim">Visitor history</p>
                <p class="mt-1 text-xs text-text-muted">
                  @if (totalEvents() === 0) {
                    No records yet
                  } @else {
                    Showing {{ rangeStart() }}–{{ rangeEnd() }} of {{ totalEvents() }}
                  }
                </p>
              </div>
              <div class="flex items-center gap-2 text-xs text-text-muted">
                Per page
                <div class="limit-picker" role="group" aria-label="Results per page">
                  @for (n of limitOptions; track n) {
                    <button
                      type="button"
                      [class.is-active]="limit() === n"
                      [attr.aria-pressed]="limit() === n"
                      (click)="setLimit(n)"
                    >
                      {{ n }}
                    </button>
                  }
                </div>
              </div>
            </div>
            <ul class="divide-y divide-border">
              @for (row of rows(); track row.id) {
                <li class="px-5 py-4 text-sm">
                  <div class="flex flex-wrap items-center justify-between gap-2">
                    <span class="font-medium text-text">{{ row.label }}</span>
                    <span class="font-mono text-[10px] text-text-dim">{{ row.at }}</span>
                  </div>
                  <p class="mt-1 text-xs text-text-muted">{{ row.detail }}</p>
                </li>
              } @empty {
                <li class="px-5 py-8 text-center text-sm text-text-muted">No events on this page.</li>
              }
            </ul>
            @if (totalEvents() > 0) {
              <div
                class="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-3"
              >
                <button
                  type="button"
                  class="magnetic-btn btn-ghost text-sm disabled:opacity-40"
                  [disabled]="!hasPrev()"
                  (click)="goPrev()"
                >
                  ← Newer
                </button>
                <span class="font-mono text-[10px] text-text-dim">
                  offset {{ offset() }} · limit {{ limit() }}
                </span>
                <button
                  type="button"
                  class="magnetic-btn btn-ghost text-sm disabled:opacity-40"
                  [disabled]="!hasNext()"
                  (click)="goNext()"
                >
                  Older →
                </button>
              </div>
            }
          </div>

          @if (environment.audience.webhookUrl.includes('formsubmit.co')) {
            <p class="mt-6 text-xs leading-relaxed text-text-dim">
              Email alerts are on via FormSubmit (confirm their activation email once). For a shared visitor log on this
              page from every device, deploy <code>scripts/portfolio-audience-webhook.gs</code> and replace
              <code>webhookUrl</code> with your Google Apps Script URL.
            </p>
          } @else if (!environment.audience.webhookUrl) {
            <p class="mt-6 text-xs leading-relaxed text-text-dim">
              Set <code>webhookUrl</code> in <code>environment.ts</code> for email alerts or cloud visitor storage.
            </p>
          }

          <a routerLink="/" class="mt-8 inline-block text-sm text-accent hover:underline">← Back to portfolio</a>
        }
      </div>
    </div>
  `,
})
export class AudienceStatsPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly audience = inject(PortfolioAudienceService);

  readonly environment = environment;
  readonly limitOptions = LIMIT_OPTIONS;

  readonly authorized = signal(false);
  readonly totalViews = signal<number | null>(null);
  readonly memberCount = signal(0);
  readonly limit = signal(DEFAULT_LIMIT);
  readonly offset = signal(0);
  readonly totalEvents = signal(0);

  readonly rows = computed(() => {
    void this.totalEvents();
    const events = this.audience.getEventsPage(this.offset(), this.limit());
    return events.map((e, i) => ({
      id: `${e.at}-${this.offset() + i}`,
      at: new Date(e.at).toLocaleString(),
      label: this.audience.formatEventLabel(e),
      detail: this.audience.formatEventDetail(e),
    }));
  });

  readonly rangeStart = computed(() => {
    const total = this.totalEvents();
    if (total === 0) return 0;
    return this.offset() + 1;
  });

  readonly rangeEnd = computed(() =>
    Math.min(this.offset() + this.limit(), this.totalEvents()),
  );

  readonly hasPrev = computed(() => this.offset() > 0);

  readonly hasNext = computed(() => this.offset() + this.limit() < this.totalEvents());

  ngOnInit(): void {
    const key = this.route.snapshot.queryParamMap.get('key') ?? '';
    const limit = this.parseLimit(this.route.snapshot.queryParamMap.get('limit'));
    const offset = this.parseOffset(this.route.snapshot.queryParamMap.get('offset'));
    this.limit.set(limit);
    this.offset.set(offset);

    void this.audience.loadStatsForOwner(key).then((ok) => {
      if (!ok) return;
      this.totalViews.set(this.audience.getTotalViews());
      this.memberCount.set(this.audience.getIdentifiedMemberCount());
      this.refreshTotalsAndClampOffset();
      this.authorized.set(true);
    });
  }

  setLimit(value: number): void {
    this.limit.set(this.parseLimit(String(value)));
    this.offset.set(0);
    this.syncQueryParams();
  }

  goPrev(): void {
    if (!this.hasPrev()) return;
    this.offset.update((o) => Math.max(0, o - this.limit()));
    this.syncQueryParams();
  }

  goNext(): void {
    if (!this.hasNext()) return;
    this.offset.update((o) => o + this.limit());
    this.syncQueryParams();
  }

  mailtoReport(): string {
    const subject = encodeURIComponent('Portfolio audience report');
    const body = encodeURIComponent(this.audience.buildEmailReport());
    return `mailto:${environment.audience.notifyEmail}?subject=${subject}&body=${body}`;
  }

  private refreshTotalsAndClampOffset(): void {
    const total = this.audience.getEventCount();
    this.totalEvents.set(total);
    if (this.offset() >= total && total > 0) {
      const lastPageOffset = Math.floor((total - 1) / this.limit()) * this.limit();
      this.offset.set(lastPageOffset);
      this.syncQueryParams();
    }
  }

  private parseLimit(raw: string | null): number {
    const n = Number(raw);
    if (!Number.isFinite(n)) return DEFAULT_LIMIT;
    return LIMIT_OPTIONS.includes(n as (typeof LIMIT_OPTIONS)[number])
      ? n
      : Math.min(400, Math.max(1, Math.floor(n)));
  }

  private parseOffset(raw: string | null): number {
    const n = Number(raw);
    return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
  }

  private syncQueryParams(): void {
    const key = this.route.snapshot.queryParamMap.get('key') ?? '';
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        key,
        limit: this.limit(),
        offset: this.offset(),
      },
      replaceUrl: true,
    });
  }
}
