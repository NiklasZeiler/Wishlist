import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/** Only verified, signed-in users may enter; everyone else is sent to the matching screen. */
export const verifiedUserGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const user = await inject(AuthService).whenReady();

  if (!user) {
    return router.createUrlTree(['/login']);
  }
  if (!user.emailVerified) {
    return router.createUrlTree(['/verify-email']);
  }
  return true;
};

/** The verification screen is only meant for signed-in users with an unverified address. */
export const unverifiedUserGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const user = await inject(AuthService).whenReady();

  if (!user) {
    return router.createUrlTree(['/login']);
  }
  return user.emailVerified ? router.createUrlTree(['/wishlist']) : true;
};

/** Login and registration are skipped for users who are already signed in. */
export const guestGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const user = await inject(AuthService).whenReady();

  if (!user) {
    return true;
  }
  return router.createUrlTree([user.emailVerified ? '/wishlist' : '/verify-email']);
};
