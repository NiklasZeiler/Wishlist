import { Injectable, computed, inject, signal } from '@angular/core';
import {
  Auth,
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from '@angular/fire/auth';

export interface SessionUser {
  uid: string;
  email: string;
  displayName: string;
  emailVerified: boolean;
  lastSignInTime: string | null;
}

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/invalid-credential': 'E-Mail oder Passwort ist falsch.',
  'auth/invalid-email': 'Die E-Mail-Adresse ist ungültig.',
  'auth/user-not-found': 'Für diese E-Mail-Adresse existiert kein Konto.',
  'auth/wrong-password': 'E-Mail oder Passwort ist falsch.',
  'auth/email-already-in-use': 'Diese E-Mail-Adresse wird bereits verwendet.',
  'auth/weak-password': 'Das Passwort ist zu schwach.',
  'auth/too-many-requests': 'Zu viele Versuche. Bitte versuche es später erneut.',
  'auth/network-request-failed': 'Keine Verbindung zum Server.',
  'auth/requires-recent-login': 'Bitte melde dich erneut an, um diese Änderung vorzunehmen.',
};

export function describeError(error: unknown): string {
  if (typeof error === 'object' && error !== null) {
    const { code, message } = error as { code?: string; message?: string };
    if (code && AUTH_ERROR_MESSAGES[code]) {
      return AUTH_ERROR_MESSAGES[code];
    }
    if (message) {
      return message;
    }
  }
  return 'Unbekannter Fehler';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly auth = inject(Auth);
  private readonly session = signal<SessionUser | null | undefined>(undefined);

  /** `undefined` while the initial auth state is still being resolved. */
  readonly user = this.session.asReadonly();
  readonly isLoggedIn = computed(() => !!this.session());
  readonly isEmailVerified = computed(() => this.session()?.emailVerified ?? false);

  constructor() {
    onAuthStateChanged(this.auth, (user) => this.publish(user));
  }

  async whenReady(): Promise<SessionUser | null> {
    await this.auth.authStateReady();
    return this.session() ?? null;
  }

  async login(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, password);
  }

  async register(name: string, email: string, password: string): Promise<void> {
    const credential = await createUserWithEmailAndPassword(this.auth, email, password);
    await updateProfile(credential.user, { displayName: name });
    await sendEmailVerification(credential.user);
    this.publish(credential.user);
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  async resendVerificationEmail(): Promise<void> {
    const user = this.requireUser();
    if (user.emailVerified) {
      throw new Error('E-Mail ist bereits verifiziert');
    }
    await sendEmailVerification(user);
  }

  /** Re-reads the account from Firebase so a completed verification becomes visible. */
  async reloadUser(): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) {
      return;
    }
    await user.reload();
    this.publish(user);
  }

  /** Lets other services refresh the session after changing the Firebase user. */
  refreshSession(): void {
    this.publish(this.auth.currentUser);
  }

  requireUser(): User {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('Kein User eingeloggt');
    }
    return user;
  }

  private publish(user: User | null): void {
    this.session.set(
      user
        ? {
            uid: user.uid,
            email: user.email ?? '',
            displayName: user.displayName ?? '',
            emailVerified: user.emailVerified,
            lastSignInTime: user.metadata.lastSignInTime ?? null,
          }
        : null,
    );
  }
}
