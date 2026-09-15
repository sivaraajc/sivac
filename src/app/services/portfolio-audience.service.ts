import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

export type AudienceEventType = 'page_view' | 'identified_contact' | 'identified_visitor';

export interface AudienceEvent {
  type: AudienceEventType;
  at: string;
  name?: string;
  email?: string;
  company?: string;
  referrer?: string;
  path?: string;
  userAgent?: string;
}

const EVENTS_KEY = 'portfolio_audience_events';
const SESSION_VIEW_KEY = 'portfolio_view_logged';

@Injectable({ providedIn: 'root' })
export class PortfolioAudienceService {
  private readonly platformId = inject(PLATFORM_ID);

  private readonly totalViews = signal<number | null>(null);
  private readonly remoteEvents = signal<AudienceEvent[]>([]);
  private readonly loadedRemote = signal(false);

  /** Background only — no public UI */
  init(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (sessionStorage.getItem(SESSION_VIEW_KEY)) return;
    sessionStorage.setItem(SESSION_VIEW_KEY, '1');

    const event: AudienceEvent = {
      type: 'page_view',
      at: new Date().toISOString(),
      referrer: document.referrer || 'direct',
      path: location.href,
      userAgent: navigator.userAgent.slice(0, 180),
    };

    this.appendLocal(event);
    void this.hitCountApi();
    void this.postWebhook(event, true);
  }

  logContactLead(name: string, email: string): void {
    const event: AudienceEvent = {
      type: 'identified_contact',
      at: new Date().toISOString(),
      name: name.trim(),
      email: email.trim(),
      path: location.href,
    };
    this.appendLocal(event);
    void this.postWebhook(event, true);
  }

  async loadStatsForOwner(accessKey: string): Promise<boolean> {
    if (!isPlatformBrowser(this.platformId)) return false;
    if (accessKey !== environment.audience.statsAccessKey) return false;

    await Promise.all([this.refreshTotalViews(), this.fetchRemoteEvents(accessKey)]);
    this.loadedRemote.set(true);
    return true;
  }

  getTotalViews(): number | null {
    return this.totalViews();
  }

  getAllEvents(): AudienceEvent[] {
    const local = this.readLocal();
    const remote = this.remoteEvents();
    const map = new Map<string, AudienceEvent>();
    for (const e of [...remote, ...local]) {
      const key = `${e.type}|${e.at}|${e.name ?? ''}|${e.email ?? ''}`;
      if (!map.has(key)) map.set(key, e);
    }
    return Array.from(map.values()).sort((a, b) => b.at.localeCompare(a.at));
  }

  getIdentifiedMemberCount(): number {
    const names = new Set<string>();
    for (const e of this.getAllEvents()) {
      if (e.type === 'page_view') continue;
      if (e.name) names.add(e.name.toLowerCase());
      else if (e.email) names.add(e.email.toLowerCase());
    }
    return names.size;
  }

  buildEmailReport(): string {
    const views = this.totalViews() ?? '—';
    const members = this.getIdentifiedMemberCount();
    const lines = this.getAllEvents()
      .slice(0, 50)
      .map((e) => {
        if (e.type === 'page_view') {
          return `• Page view — ${e.at} — ${e.referrer ?? 'direct'}`;
        }
        return `• ${e.name ?? 'Unknown'}${e.email ? ` <${e.email}>` : ''} — ${e.type} — ${e.at}`;
      });
    return [
      'Portfolio audience report',
      `Total views (CountAPI): ${views}`,
      `Identified members: ${members}`,
      '',
      'Recent activity:',
      ...lines,
    ].join('\n');
  }

  private readLocal(): AudienceEvent[] {
    try {
      const raw = localStorage.getItem(EVENTS_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as AudienceEvent[];
    } catch {
      return [];
    }
  }

  private appendLocal(event: AudienceEvent): void {
    const next = [event, ...this.readLocal()].slice(0, 200);
    localStorage.setItem(EVENTS_KEY, JSON.stringify(next));
  }

  private async hitCountApi(): Promise<void> {
    const ns = environment.audience.countApiNamespace;
    try {
      await fetch(`https://api.countapi.xyz/hit/${ns}/page-views`);
      await this.refreshTotalViews();
    } catch {
      /* offline */
    }
  }

  private async refreshTotalViews(): Promise<void> {
    const ns = environment.audience.countApiNamespace;
    try {
      const res = await fetch(`https://api.countapi.xyz/get/${ns}/page-views`);
      const data = (await res.json()) as { value?: number };
      this.totalViews.set(data.value ?? 0);
    } catch {
      this.totalViews.set(null);
    }
  }

  private async fetchRemoteEvents(accessKey: string): Promise<void> {
    const base = environment.audience.webhookUrl;
    if (!base) return;
    try {
      const url = `${base}${base.includes('?') ? '&' : '?'}action=stats&key=${encodeURIComponent(accessKey)}`;
      const res = await fetch(url);
      if (!res.ok) return;
      const data = (await res.json()) as { events?: AudienceEvent[] };
      if (Array.isArray(data.events)) this.remoteEvents.set(data.events);
    } catch {
      /* webhook optional */
    }
  }

  private async postWebhook(event: AudienceEvent, notify: boolean): Promise<void> {
    const url = environment.audience.webhookUrl;
    if (!url) return;
    try {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'log',
          key: environment.audience.statsAccessKey,
          notify: notify ? environment.audience.notifyEmail : undefined,
          event,
        }),
        mode: 'no-cors',
      });
    } catch {
      /* ignore */
    }
  }
}
