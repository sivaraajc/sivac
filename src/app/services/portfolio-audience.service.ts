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
  ip?: string;
  browser?: string;
  /** Anonymous browser id (localStorage) — not a real name */
  visitorKey?: string;
  sessionId?: string;
  referrerHost?: string;
  trafficSource?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  screen?: string;
  networkType?: string;
}

const EVENTS_KEY = 'portfolio_audience_events';
const SESSION_VIEW_KEY = 'portfolio_view_logged';
const VISITOR_KEY_STORAGE = 'portfolio_visitor_key';
const SESSION_ID_STORAGE = 'portfolio_session_id';
const VIEW_COUNTER_API = 'https://countapi.mileshilliard.com/api/v1';

interface GeoJsResponse {
  success?: boolean;
  ip?: string;
  city?: string;
  region?: string;
  country?: string;
  timezone?: string;
  organization_name?: string;
}

interface IpWhoResponse {
  success?: boolean;
  ip?: string;
  city?: string;
  region?: string;
  country?: string;
  timezone?: string | { id?: string };
  connection?: { isp?: string };
}

type GeoFields = Pick<
  AudienceEvent,
  'city' | 'region' | 'country' | 'timezone' | 'isp' | 'ip'
>;

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
      return [
        e.email,
        `IP: ${this.formatVisitorIp(e)}`,
        `Browser: ${this.formatVisitorBrowser(e)}`,
        loc !== 'Location unknown' ? loc : null,
        e.type,
      ]
        .filter(Boolean)
        .join(' · ');
    }
    const ref = e.referrer && e.referrer !== 'direct' ? `Referrer: ${e.referrer}` : 'Referrer: direct';
    return [
      ref,
      `IP: ${this.formatVisitorIp(e)}`,
      `Browser: ${this.formatVisitorBrowser(e)}`,
      this.formatEventLocation(e),
    ].join(' · ');
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
    if (e.type === 'identified_visitor') {
      const who = e.name ?? 'Recruiter';
      return e.company ? `${who} — ${e.company}` : who;
    }
    if (e.type === 'page_view') {
      if (e.city || e.country) {
        return `Visitor — ${[e.city, e.country].filter(Boolean).join(', ')}`;
      }
      return 'Anonymous visitor';
    }
    return e.name ?? e.email ?? 'Identified visitor';
  }

  formatVisitorName(e: AudienceEvent): string {
    if (e.name) {
      return e.company ? `${e.name} (${e.company})` : e.name;
    }
    if (e.email) return e.email;
    if (e.visitorKey) return `Anonymous · visitor ${e.visitorKey}`;
    return 'Anonymous';
  }

  formatVisitorNetwork(e: AudienceEvent): string {
    return e.isp?.trim() || '—';
  }

  formatVisitorSource(e: AudienceEvent): string {
    if (e.trafficSource) return e.trafficSource;
    if (e.utmSource) return e.utmSource;
    if (e.referrerHost) return e.referrerHost;
    return 'direct';
  }

  formatVisitorLocation(e: AudienceEvent): string {
    const place = [e.city, e.region, e.country].filter(Boolean).join(', ');
    return place || 'Unknown';
  }

  formatVisitorBrowser(e: AudienceEvent): string {
    const parts = [e.browser, e.device].filter(Boolean);
    return parts.join(' · ') || 'Unknown';
  }

  formatVisitorIp(e: AudienceEvent): string {
    return e.ip?.trim() || '—';
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

  private clientHints(): Pick<
    AudienceEvent,
    | 'referrer'
    | 'path'
    | 'userAgent'
    | 'timezone'
    | 'locale'
    | 'device'
    | 'browser'
    | 'visitorKey'
    | 'sessionId'
    | 'referrerHost'
    | 'trafficSource'
    | 'utmSource'
    | 'utmMedium'
    | 'utmCampaign'
    | 'screen'
    | 'networkType'
  > {
    const ua = navigator.userAgent;
    const utm = this.readUtmParams();
    const referrerHost = this.parseReferrerHost(document.referrer);
    const trafficSource = utm.source ?? referrerHost ?? 'direct';

    return {
      referrer: document.referrer || 'direct',
      path: location.href,
      userAgent: ua.slice(0, 180),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      locale: navigator.language,
      device: this.inferDevice(),
      browser: this.parseBrowserName(ua),
      visitorKey: this.getOrCreateVisitorKey(),
      sessionId: this.getOrCreateSessionId(),
      referrerHost,
      trafficSource,
      utmSource: utm.source,
      utmMedium: utm.medium,
      utmCampaign: utm.campaign,
      screen: `${window.screen.width}×${window.screen.height}`,
      networkType: this.readNetworkType(),
    };
  }

  private readUtmParams(): { source?: string; medium?: string; campaign?: string } {
    const params = new URLSearchParams(location.search);
    const source = params.get('utm_source')?.trim();
    const medium = params.get('utm_medium')?.trim();
    const campaign = params.get('utm_campaign')?.trim();
    return {
      source: source || undefined,
      medium: medium || undefined,
      campaign: campaign || undefined,
    };
  }

  private parseReferrerHost(referrer: string): string | undefined {
    if (!referrer) return undefined;
    try {
      return new URL(referrer).hostname.replace(/^www\./, '');
    } catch {
      return undefined;
    }
  }

  private getOrCreateVisitorKey(): string {
    let key = localStorage.getItem(VISITOR_KEY_STORAGE);
    if (!key) {
      key =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID().replace(/-/g, '').slice(0, 10)
          : Math.random().toString(36).slice(2, 12);
      localStorage.setItem(VISITOR_KEY_STORAGE, key);
    }
    return key;
  }

  private getOrCreateSessionId(): string {
    let id = sessionStorage.getItem(SESSION_ID_STORAGE);
    if (!id) {
      id =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID().slice(0, 8)
          : Math.random().toString(36).slice(2, 10);
      sessionStorage.setItem(SESSION_ID_STORAGE, id);
    }
    return id;
  }

  private readNetworkType(): string | undefined {
    const conn = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection;
    return conn?.effectiveType;
  }

  private parseBrowserName(ua: string): string {
    if (/Edg\//i.test(ua)) return 'Microsoft Edge';
    if (/OPR\//i.test(ua) || /Opera/i.test(ua)) return 'Opera';
    if (/Chrome\//i.test(ua)) return 'Google Chrome';
    if (/Firefox\//i.test(ua)) return 'Firefox';
    if (/Safari\//i.test(ua)) return 'Safari';
    return 'Other';
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
  private async fetchVisitorGeo(): Promise<GeoFields> {
    const fromGeoJs = await this.tryGeoJson<GeoJsResponse>(
      'https://get.geojs.io/v1/ip/geo.json',
      (d) => ({
        ip: d.ip,
        city: d.city,
        region: d.region,
        country: d.country,
        timezone: d.timezone,
        isp: d.organization_name,
      }),
    );
    if (fromGeoJs) return fromGeoJs;

    const fromIpWho = await this.tryGeoJson<IpWhoResponse>('https://ipwho.is/', (d) => ({
      ip: d.ip,
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
    map: (data: T) => GeoFields,
  ): Promise<GeoFields | null> {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
      if (!res.ok) return null;
      const data = (await res.json()) as T;
      if (data.success === false) return null;
      const mapped = map(data);
      if (!mapped.ip && !mapped.city && !mapped.country) return null;
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
      `IP: ${this.formatVisitorIp(event)}`,
      `Browser: ${this.formatVisitorBrowser(event)}`,
      `Visitor ID: ${event.visitorKey ?? '—'}`,
      `Network: ${this.formatVisitorNetwork(event)}`,
      `Source: ${this.formatVisitorSource(event)}`,
      `Referrer: ${event.referrer ?? 'direct'}`,
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
