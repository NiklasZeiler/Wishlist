import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService, describeError } from '../../core/auth.service';
import { NotifierService } from '../../core/notifier.service';
import {
  passwordStrength,
  passwordStrengthLabel,
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validateUsername,
} from '../../core/validators';

const STRENGTH_SEGMENTS = [0, 1, 2, 3, 4, 5];

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, MatIconModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['../login/login.component.scss', './register.component.scss'],
})
export class RegisterComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notifier = inject(NotifierService);

  protected readonly username = signal('');
  protected readonly email = signal('');
  protected readonly password = signal('');
  protected readonly confirmPassword = signal('');

  protected readonly usernameError = signal<string | null>(null);
  protected readonly emailError = signal<string | null>(null);
  protected readonly passwordError = signal<string | null>(null);
  protected readonly confirmError = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly loading = signal(false);

  protected readonly strengthSegments = STRENGTH_SEGMENTS;
  protected readonly strength = computed(() => passwordStrength(this.password()));
  protected readonly strengthLabel = computed(() => passwordStrengthLabel(this.strength()));
  protected readonly strengthTone = computed(() => {
    const strength = this.strength();
    if (strength <= 1) return 'weak';
    return strength <= 3 ? 'medium' : 'strong';
  });

  protected readonly formValid = computed(
    () =>
      !validateUsername(this.username()) &&
      !validateEmail(this.email()) &&
      !validatePassword(this.password()) &&
      !validatePasswordMatch(this.password(), this.confirmPassword()),
  );

  protected async register(): Promise<void> {
    this.usernameError.set(validateUsername(this.username()));
    this.emailError.set(validateEmail(this.email()));
    this.passwordError.set(validatePassword(this.password()));
    this.confirmError.set(validatePasswordMatch(this.password(), this.confirmPassword()));

    if (!this.formValid()) {
      this.errorMessage.set('Bitte korrigiere die markierten Fehler');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);
    try {
      await this.auth.register(this.username().trim(), this.email().trim(), this.password());
      this.notifier.success(
        'Registrierung erfolgreich! Bitte verifiziere deine E-Mail-Adresse.',
        4000,
      );
      await this.router.navigate(['/verify-email']);
    } catch (error) {
      this.errorMessage.set(describeError(error));
    } finally {
      this.loading.set(false);
    }
  }
}
