import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  LucideAngularModule,
  Baby,
  BedSingle,
  Toilet,
  Utensils,
  CalendarDays,
} from 'lucide-angular';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(
      LucideAngularModule.pick({
        Baby,
        BedSingle,
        Toilet,
        Utensils,
        CalendarDays,
      })
    ),
  ],
};
