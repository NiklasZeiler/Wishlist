import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService, describeError } from '../../core/auth.service';
import { NotifierService } from '../../core/notifier.service';

const POLL_INTERVAL_MS = 3000;
const RESEND_COOLDOWN_SECONDS = 60;

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss',
})
export class VerifyEmailComponent {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notifier = inject(NotifierService);

  protected readonly canResend = signal(true);
  protected readonly resending = signal(false);
  protected readonly countdown = signal(0);

  constructor() {
    const destroyRef = inject(DestroyRef);

    // The verification happens in another tab or app, so the account is polled.
    const poll = setInterval(async () => {
      await this.auth.reloadUser();
      if (this.auth.isEmailVerified()) {
        clearInterval(poll);
        await this.router.navigate(['/wishlist']);
      }
    }, POLL_INTERVAL_MS);
    destroyRef.onDestroy(() => clearInterval(poll));
  }

  protected async resend(): Promise<void> {
    if (!this.canResend()) {
      return;
    }
    this.resending.set(true);
    this.canResend.set(false);

    try {
      await this.auth.resendVerificationEmail();
      this.notifier.success('Verifizierungs-E-Mail wurde erneut gesendet');
      this.startCooldown();
    } catch (error) {
      this.notifier.error(`Fehler: ${describeError(error)}`);
      this.canResend.set(true);
    } finally {
      this.resending.set(false);
    }
  }

  protected async logout(): Promise<void> {
    await this.auth.logout();
    await this.router.navigate(['/login']);
  }

  private startCooldown(): void {
    this.countdown.set(RESEND_COOLDOWN_SECONDS);
    const timer = setInterval(() => {
      this.countdown.update((seconds) => seconds - 1);
      if (this.countdown() <= 0) {
        clearInterval(timer);
        this.canResend.set(true);
      }
    }, 1000);
  }
}
