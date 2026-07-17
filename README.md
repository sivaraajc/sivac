# Sivaraaj C — Premium Portfolio

Awwwards-inspired personal portfolio built with **Angular 21**, **Tailwind CSS 4**, **GSAP + ScrollTrigger**, **Lenis**, and **Three.js**.

## Stack

- Angular 21 (standalone, signals, zoneless, OnPush)
- TypeScript (strict)
- Tailwind CSS 4
- Angular Animations + Router view transitions
- GSAP / ScrollTrigger
- Lenis smooth scroll
- Three.js particle / knot background
- Angular CDK
- Lucide icons (`@lucide/angular`)

## Develop

```bash
npm install
npm start
```

Open `http://localhost:4200/`.

## Build

```bash
npm run build
```

## Architecture

```
src/app/
  core/           # reserved for guards/interceptors
  shared/         # reusable UI (section heading, social icons)
  layouts/        # main shell (nav, footer, backgrounds)
  components/     # sections + chrome
  pages/          # route-level pages
  services/       # portfolio, lenis, animation
  models/         # types + content data
  animations/     # Angular triggers
  directives/     # reveal, magnetic, tilt, count-up
  pipes/
```

## Content

Edit portfolio copy, projects, and stats in `src/app/models/portfolio.data.ts`.
