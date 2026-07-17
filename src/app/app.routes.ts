import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layouts/main-layout/main-layout').then((m) => m.MainLayout),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
        title: 'Sivaraaj C | Senior Software Engineer',
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
