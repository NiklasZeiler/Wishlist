import { Routes } from '@angular/router';
import { guestGuard, unverifiedUserGuard, verifiedUserGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'wishlist', pathMatch: 'full' },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./pages/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'verify-email',
    canActivate: [unverifiedUserGuard],
    loadComponent: () =>
      import('./pages/verify-email/verify-email.component').then((m) => m.VerifyEmailComponent),
  },
  {
    path: 'wishlist',
    canActivate: [verifiedUserGuard],
    loadComponent: () =>
      import('./pages/wishlist/wishlist.component').then((m) => m.WishlistComponent),
  },
  {
    path: 'add-wish',
    canActivate: [verifiedUserGuard],
    loadComponent: () =>
      import('./pages/add-wish/add-wish.component').then((m) => m.AddWishComponent),
  },
  {
    path: 'profile',
    canActivate: [verifiedUserGuard],
    loadComponent: () => import('./pages/profile/profile.component').then((m) => m.ProfileComponent),
  },
  {
    path: 'feedback',
    canActivate: [verifiedUserGuard],
    loadComponent: () =>
      import('./pages/feedback/feedback.component').then((m) => m.FeedbackComponent),
  },
  {
    path: 'share',
    loadComponent: () => import('./pages/share/share.component').then((m) => m.ShareComponent),
  },
  // Links created before the redesign used /wishes/share?shareCode=...
  { path: 'wishes/share', redirectTo: 'share' },
  {
    path: 'privacy',
    loadComponent: () => import('./pages/privacy/privacy.component').then((m) => m.PrivacyComponent),
  },
  {
    path: 'imprint',
    loadComponent: () => import('./pages/imprint/imprint.component').then((m) => m.ImprintComponent),
  },
  { path: '**', redirectTo: 'wishlist' },
];
