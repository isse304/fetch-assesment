import {
  ApplicationConfig,
  APP_INITIALIZER,
  provideZonelessChangeDetection,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { tap } from 'rxjs/operators';

import { routes } from './app.routes';
import { provideClientHydration, withNoHttpTransferCache } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { AuthApiService } from './services/auth-api/auth-api.service';
import { AuthStateService } from './services/auth-state/auth-state.service';

export function initializeAuth(
  authApiService: AuthApiService,
  authStateService: AuthStateService
): () => Promise<boolean> {
  return () =>
    lastValueFrom(
      authApiService.verifyAuthStatus().pipe(
        tap((isAuthenticated) => {
          if (isAuthenticated) {
            authStateService.setAuthenticated(true);
          }
        })
      )
    ).then(() => true);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(withNoHttpTransferCache()),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuth,
      deps: [AuthApiService, AuthStateService],
      multi: true,
    },
  ],
};
