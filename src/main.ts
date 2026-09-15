import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .then(() => {
    void import('./app/layouts/main-layout/main-layout');
    void import('./app/pages/home/home.page');
  })
  .catch((err) => console.error(err));
