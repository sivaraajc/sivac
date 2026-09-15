import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PortfolioAudienceService } from '../../services/portfolio-audience.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-audience-stats-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
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
              <p class="mt-2 text-sm text-text-muted">Not shown on the public site — background tracking only.</p>
            </div>
            <a
              class="magnetic-btn btn-ghost text-sm"
              [href]="mailtoReport()"
            >
              Email this report
            </a>
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
            <div class="border-b border-border px-5 py-3 font-mono text-xs uppercase tracking-[0.16em] text-text-dim">
              Who viewed / contacted
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
                <li class="px-5 py-8 text-center text-sm text-text-muted">No events yet.</li>
              }
            </ul>
          </div>

          @if (!environment.audience.webhookUrl) {
            <p class="mt-6 text-xs leading-relaxed text-text-dim">
              Tip: set <code>webhookUrl</code> in <code>src/environments/environment.ts</code> to store all visitors
              globally and receive email alerts on each view.
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
  private readonly audience = inject(PortfolioAudienceService);

  readonly environment = environment;
  readonly authorized = signal(false);
  readonly totalViews = signal<number | null>(null);
  readonly memberCount = signal(0);
  readonly rows = signal<{ id: string; label: string; detail: string; at: string }[]>([]);

  ngOnInit(): void {
    const key = this.route.snapshot.queryParamMap.get('key') ?? '';
    void this.audience.loadStatsForOwner(key).then((ok) => {
      if (!ok) return;
      this.authorized.set(true);
      this.totalViews.set(this.audience.getTotalViews());
      this.memberCount.set(this.audience.getIdentifiedMemberCount());
      this.rows.set(
        this.audience.getAllEvents().map((e, i) => ({
          id: `${e.at}-${i}`,
          at: new Date(e.at).toLocaleString(),
          label:
            e.type === 'page_view'
              ? 'Anonymous page view'
              : e.name ?? e.email ?? 'Identified visitor',
          detail:
            e.type === 'page_view'
              ? `Referrer: ${e.referrer ?? 'direct'}`
              : [e.email, e.company, e.type].filter(Boolean).join(' · '),
        })),
      );
    });
  }

  mailtoReport(): string {
    const subject = encodeURIComponent('Portfolio audience report');
    const body = encodeURIComponent(this.audience.buildEmailReport());
    return `mailto:${environment.audience.notifyEmail}?subject=${subject}&body=${body}`;
  }
}
