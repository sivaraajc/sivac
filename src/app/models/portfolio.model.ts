export interface NavItem {
  label: string;
  href: string;
  id: string;
}

export interface Job {
  tab: string;
  company: string;
  title: string;
  date: string;
  description: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  imgs: string[];
  technologies: string[];
  category: string;
  link?: string;
  github?: string;
  featured?: boolean;
  status?: 'Live' | 'Production' | 'Internal';
  stars?: number;
  commits?: number;
  lighthouse?: number;
  latency?: string;
  architecture?: string;
}

export interface SkillItem {
  name: string;
  level: number;
  icon?: string;
}

export interface SkillCategory {
  category: string;
  items: SkillItem[];
}

export interface ServiceItem {
  title: string;
  description: string;
  icon: 'code' | 'layout' | 'server' | 'zap' | 'users' | 'shield';
}

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
}

export interface StatItem {
  label: string;
  value: number;
  suffix: string;
}

export interface DevIdentity {
  badges: string[];
  terminalLines: string[];
  codeSnippet: string[];
  orbitTechs: string[];
}

export interface DevWidgetStats {
  years: number;
  projects: number;
  technologies: number;
  contributions: number;
  streak: number;
  codingHours: number;
  openSource: number;
  coffee: number;
}

export interface PortfolioData {
  name: string;
  fullName: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  portfolio: string;
  cvPath: string;
  heroAvatarImage: string;
  avatarImage: string;
  tagline: string;
  roles: string[];
  identity: DevIdentity;
  widgets: DevWidgetStats;
  about: {
    title: string;
    paragraphs: string[];
  };
  stats: StatItem[];
  skills: SkillCategory[];
  experience: {
    title: string;
    jobs: Job[];
  };
  projects: {
    title: string;
    label: string;
    items: Project[];
  };
  services: ServiceItem[];
  testimonials: Testimonial[];
  education: {
    title: string;
    degree: string;
    school: string;
    location: string;
    date: string;
    gpa: string;
  };
  certifications: string[];
  contact: {
    pretitle: string;
    title: string;
    content: string;
    btn: string;
  };
  nav: NavItem[];
}
