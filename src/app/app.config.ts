import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    //Proveemos el Cliente para que pueda ser inyectado en el service
    provideHttpClient(withFetch()), //Las peticiones de Angular van a usar peticioens fetch
  ],
};
