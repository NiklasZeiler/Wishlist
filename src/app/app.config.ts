import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideServiceWorker } from '@angular/service-worker';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { ReCaptchaV3Provider, initializeAppCheck, provideAppCheck } from '@angular/fire/app-check';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { firebaseConfig } from '../environments/firebase-config';
import { APP_CHECK_SITE_KEY } from '../environments/app-check';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    // Local development skips App Check: the debug token has to be registered per browser
    // in the Firebase console, and an unregistered one makes sign-in fail with a 403.
    ...(isDevMode()
      ? []
      : [
          provideAppCheck(() =>
            initializeAppCheck(undefined, {
              provider: new ReCaptchaV3Provider(APP_CHECK_SITE_KEY),
              isTokenAutoRefreshEnabled: true,
            }),
          ),
        ]),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
