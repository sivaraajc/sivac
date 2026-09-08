export interface DayPalette {
  id: string;
  label: string;
  /** Primary — links, icons, progress bars */
  accent: string;
  /** Depth — buttons, borders, glow shadows */
  accent2: string;
  /** Bridge — cards, rings, soft fills */
  accent3: string;
  /** Pop — CTAs, highlights, gradient tails */
  neon: string;
}

/**
 * Array index MUST match JavaScript getDay():
 * 0 Sunday · 1 Monday · 2 Tuesday · 3 Wednesday · 4 Thursday · 5 Friday · 6 Saturday
 *
 * Curated website palettes — vivid enough to feel alive, balanced for dark UI.
 */
export const DAY_PALETTES: DayPalette[] = [
  {
    id: 'sunday',
    label: 'Sunday',
    // Rose Quartz — soft weekend warmth
    accent: '#f0a8b8',
    accent2: '#c0607a',
    accent3: '#f5c8d4',
    neon: '#e88898',
  },
  {
    id: 'monday',
    label: 'Monday',
    // Sky Blue — clean SaaS trust
    accent: '#60a5fa',
    accent2: '#3b82f6',
    accent3: '#93c5fd',
    neon: '#4f9cf0',
  },
  // {
  //   id: 'tuesday',
  //   label: 'Tuesday',
  //   // Seafoam — fresh teal mint
  //   accent: '#4ecdc4',
  //   accent2: '#2a9d8f',
  //   accent3: '#7ee8e0',
  //   neon: '#3db8a8',
  // },
  {
    id: 'wednesday',
    label: 'Wednesday',
    // Aurora — cyan meets violet
    accent: '#22d3ee',
    accent2: '#8b5cf6',
    accent3: '#a78bfa',
    neon: '#c084fc',
  },
  {
    id: 'thursday',
    label: 'Thursday',
    // Sunset Coral — warm terracotta, no gold/yellow
    accent: '#f4845f',
    accent2: '#c45c4a',
    accent3: '#f8a080',
    neon: '#e86850',
  },
  {
    id: 'friday',
    label: 'Friday',
    // Orchid — elegant magenta bloom
    accent: '#e080c8',
    accent2: '#a84898',
    accent3: '#f0a8e0',
    neon: '#d068b0',
  },
  {
    id: 'saturday',
    label: 'Saturday',
    // Twilight — indigo evening calm
    accent: '#8090e0',
    accent2: '#5868b8',
    accent3: '#a8b4f0',
    neon: '#6878d0',
  },
];
