import { Injectable, signal, computed } from '@angular/core';
import { PORTFOLIO_DATA } from '../models/portfolio.data';
import { PortfolioData, Project } from '../models/portfolio.model';

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  private readonly data = signal<PortfolioData>(PORTFOLIO_DATA);
  private readonly projectFilter = signal<string>('All');
  private readonly selectedProject = signal<Project | null>(null);

  readonly portfolio = this.data.asReadonly();
  readonly filter = this.projectFilter.asReadonly();
  readonly activeProject = this.selectedProject.asReadonly();

  readonly categories = computed(() => {
    const cats = this.data().projects.items.map((p) => p.category);
    return ['All', ...Array.from(new Set(cats))];
  });

  readonly filteredProjects = computed(() => {
    const filter = this.projectFilter();
    const items = this.data().projects.items;
    if (filter === 'All') return items;
    return items.filter((p) => p.category === filter);
  });

  setFilter(category: string): void {
    this.projectFilter.set(category);
  }

  openProject(project: Project): void {
    this.selectedProject.set(project);
  }

  closeProject(): void {
    this.selectedProject.set(null);
  }
}
