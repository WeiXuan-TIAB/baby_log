import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import {
  LucideAngularModule,
  Baby,
  BedSingle,
  Toilet,
  Utensils,
  CalendarDays,
} from 'lucide-angular';
import { provideServiceWorker } from '@angular/service-worker';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    // 路由
    provideRouter(routes),
    // Lucide icon
    importProvidersFrom(
      LucideAngularModule.pick({
        Baby,
        BedSingle,
        Toilet,
        Utensils,
        CalendarDays,
      })
    ),
    // MatSnackBar
    provideAnimations(),
    importProvidersFrom(MatSnackBarModule),
    // pwa
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),

  ],
};
