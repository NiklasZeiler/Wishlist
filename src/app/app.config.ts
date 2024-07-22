import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), importProvidersFrom(provideFirebaseApp(() => initializeApp({ "projectId": "wishlist-676f9", "appId": "1:900522206512:web:cfe591a23d1823922a54f5", "storageBucket": "wishlist-676f9.appspot.com", "apiKey": "AIzaSyB0dchvrYP7JDjCX3BrlUWSG5Rsv40-U5M", "authDomain": "wishlist-676f9.firebaseapp.com", "messagingSenderId": "900522206512" }))), 
  importProvidersFrom(provideAuth(() => getAuth())), 
  importProvidersFrom(provideFirestore(() => getFirestore()))]
};
