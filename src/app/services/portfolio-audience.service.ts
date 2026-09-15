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
  /** Approximate location from IP (not GPS) */
  city?: string;
  region?: string;
  country?: string;
  timezone?: string;
  locale?: string;
  device?: string;
  isp?: string;
}

const EVENTS_KEY = 'portfolio_audience_events';
const SESSION_VIEW_KEY = 'portfolio_view_logged';
const VIEW_COUNTER_API = 'https://countapi.mileshilliard.com/api/v1';

interface GeoJsResponse {
  success?: boolean;
  city?: string;
  region?: string;
  country?: string;
  timezone?: string;
  organization_name?: string;
}

interface IpWhoResponse {
  success?: boolean;
  city?: string;
  region?: string;
  country?: string;
  timezone?: string | { id?: string };
  connection?: { isp?: string };
}

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
    void this.recordPageView();
  }

  logContactLead(name: string, email: string): void {
    void this.recordIdentifiedLead(name, email);
  }

  formatEventLocation(e: AudienceEvent): string {
    const place = [e.city, e.region, e.country].filter(Boolean).join(', ');
    const parts = [place, e.timezone, e.device, e.isp].filter(Boolean);
    return parts.join(' · ') || 'Location unknown';
  }

  formatEventDetail(e: AudienceEvent): string {
    if (e.type !== 'page_view') {
      const loc = this.formatEventLocation(e);
      return [e.email, e.company, loc !== 'Location unknown' ? loc : null, e.type]
        .filter(Boolean)
        .join(' · ');
    }
    const ref = e.referrer && e.referrer !== 'direct' ? `Referrer: ${e.referrer}` : 'Referrer: direct';
    return `${ref} · ${this.formatEventLocation(e)}`;
  }

  usesRemoteEventStore(): boolean {
    const url = environment.audience.webhookUrl?.trim() ?? '';
    return url.length > 0 && !url.includes('formsubmit.co');
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

  getEventCount(): number {
    return this.getAllEvents().length;
  }

  getEventsPage(offset: number, limit: number): AudienceEvent[] {
    const safeOffset = Math.max(0, offset);
    const safeLimit = Math.min(400, Math.max(1, limit));
    return this.getAllEvents().slice(safeOffset, safeOffset + safeLimit);
  }

  formatEventLabel(e: AudienceEvent): string {
    if (e.type === 'page_view') {
      if (e.city || e.country) {
        return `Visitor — ${[e.city, e.country].filter(Boolean).join(', ')}`;
      }
      return 'Anonymous visitor';
    }
    return e.name ?? e.email ?? 'Identified visitor';
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
      .slice(0, 100)
      .map((e) => {
        if (e.type === 'page_view') {
          return `• Page view — ${e.at} — ${this.formatEventDetail(e)}`;
        }
        return `• ${e.name ?? 'Unknown'}${e.email ? ` <${e.email}>` : ''} — ${this.formatEventDetail(e)} — ${e.at}`;
      });
    return [
      'Portfolio audience report',
      `Total views: ${views}`,
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
    const next = [event, ...this.readLocal()].slice(0, 500);
    localStorage.setItem(EVENTS_KEY, JSON.stringify(next));
  }

  private async recordPageView(): Promise<void> {
    const event: AudienceEvent = {
      type: 'page_view',
      at: new Date().toISOString(),
      ...this.clientHints(),
      ...(await this.fetchVisitorGeo()),
    };
    this.appendLocal(event);
    void this.hitCountApi();
    void this.postWebhook(event, true);
  }

  private async recordIdentifiedLead(name: string, email: string): Promise<void> {
    const event: AudienceEvent = {
      type: 'identified_contact',
      at: new Date().toISOString(),
      name: name.trim(),
      email: email.trim(),
      path: location.href,
      ...this.clientHints(),
      ...(await this.fetchVisitorGeo()),
    };
    this.appendLocal(event);
    void this.postWebhook(event, true);
  }

  private clientHints(): Pick<AudienceEvent, 'referrer' | 'path' | 'userAgent' | 'timezone' | 'locale' | 'device'> {
    return {
      referrer: document.referrer || 'direct',
      path: location.href,
      userAgent: navigator.userAgent.slice(0, 180),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      locale: navigator.language,
      device: this.inferDevice(),
    };
  }

  private inferDevice(): string {
    const ua = navigator.userAgent;
    if (/Mobi|Android|iPhone|iPad/i.test(ua)) return 'Mobile';
    if (/Windows/i.test(ua)) return 'Windows';
    if (/Mac OS/i.test(ua)) return 'Mac';
    if (/Linux/i.test(ua)) return 'Linux';
    return 'Desktop';
  }

  /** City/country from visitor IP (browser calls geo API — approximate, not exact address). */
  private async fetchVisitorGeo(): Promise<
    Pick<AudienceEvent, 'city' | 'region' | 'country' | 'timezone' | 'isp'>
  > {
    const fromGeoJs = await this.tryGeoJson<GeoJsResponse>(
      'https://get.geojs.io/v1/ip/geo.json',
      (d) => ({
        city: d.city,
        region: d.region,
        country: d.country,
        timezone: d.timezone,
        isp: d.organization_name,
      }),
    );
    if (fromGeoJs) return fromGeoJs;

    const fromIpWho = await this.tryGeoJson<IpWhoResponse>('https://ipwho.is/', (d) => ({
      city: d.city,
      region: d.region,
      country: d.country,
      timezone: typeof d.timezone === 'string' ? d.timezone : d.timezone?.id,
      isp: d.connection?.isp,
    }));
    return fromIpWho ?? {};
  }

  private async tryGeoJson<T extends { success?: boolean }>(
    url: string,
    map: (data: T) => Pick<AudienceEvent, 'city' | 'region' | 'country' | 'timezone' | 'isp'>,
  ): Promise<Pick<AudienceEvent, 'city' | 'region' | 'country' | 'timezone' | 'isp'> | null> {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
      if (!res.ok) return null;
      const data = (await res.json()) as T;
      if (data.success === false) return null;
      const mapped = map(data);
      if (!mapped.city && !mapped.country) return null;
      return mapped;
    } catch {
      return null;
    }
  }

  private viewCounterKey(): string {
    return environment.audience.viewCounterKey;
  }

  private localPageViewCount(): number {
    return this.getAllEvents().filter((e) => e.type === 'page_view').length;
  }

  private async hitCountApi(): Promise<void> {
    const key = encodeURIComponent(this.viewCounterKey());
    try {
      await fetch(`${VIEW_COUNTER_API}/hit/${key}`);
      await this.refreshTotalViews();
    } catch {
      this.totalViews.set(this.localPageViewCount());
    }
  }

  private async refreshTotalViews(): Promise<void> {
    const key = encodeURIComponent(this.viewCounterKey());
    try {
      const res = await fetch(`${VIEW_COUNTER_API}/get/${key}`);
      if (res.status === 404) {
        this.totalViews.set(0);
        return;
      }
      if (!res.ok) {
        this.totalViews.set(this.localPageViewCount());
        return;
      }
      const data = (await res.json()) as { value?: number | string };
      const n = Number(data.value);
      this.totalViews.set(Number.isFinite(n) ? n : this.localPageViewCount());
    } catch {
      this.totalViews.set(this.localPageViewCount());
    }
  }

  private async fetchRemoteEvents(accessKey: string): Promise<void> {
    const base = environment.audience.webhookUrl?.trim();
    if (!base || base.includes('formsubmit.co')) return;
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
    const url = environment.audience.webhookUrl?.trim();
    if (!url || !notify) return;

    if (url.includes('formsubmit.co')) {
      await this.postFormSubmit(url, event);
      return;
    }

    try {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'log',
          key: environment.audience.statsAccessKey,
          notify: environment.audience.notifyEmail,
          event,
        }),
      });
    } catch {
      /* ignore */
    }
  }

  private async postFormSubmit(url: string, event: AudienceEvent): Promise<void> {
    const place = [event.city, event.region, event.country].filter(Boolean).join(', ');
    const who =
      event.type === 'page_view'
        ? place ? `Visitor (${place})` : 'Portfolio visitor'
        : event.name ?? 'Contact form';

    const message = [
      `Type: ${event.type}`,
      `Time: ${event.at}`,
      `Location: ${this.formatEventLocation(event)}`,
      `Referrer: ${event.referrer ?? 'direct'}`,
      `Device: ${event.device ?? '—'}`,
      event.name ? `Name: ${event.name}` : null,
      event.email ? `Email: ${event.email}` : null,
      event.path ? `URL: ${event.path}` : null,
    ]
      .filter(Boolean)
      .join('\n');

    const subject =
      event.type === 'identified_contact'
        ? `Portfolio contact — ${event.name ?? 'New message'}`
        : `Portfolio visit${place ? ` — ${place}` : ''}`;

    try {
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: who,
          email: event.email ?? environment.audience.notifyEmail,
          message,
          _subject: subject,
          _captcha: 'false',
        }),
      });
    } catch {
      /* ignore */
    }
  }
}
