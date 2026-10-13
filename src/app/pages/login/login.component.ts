import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService, describeError } from '../../core/auth.service';
import { validateEmail, validatePassword } from '../../core/validators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatIconModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly email = signal('');
  protected readonly password = signal('');
  protected readonly emailError = signal<string | null>(null);
  protected readonly passwordError = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly loading = signal(false);

  protected async login(): Promise<void> {
    this.emailError.set(validateEmail(this.email()));
    this.passwordError.set(validatePassword(this.password()));
    if (this.emailError() || this.passwordError()) {
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);
    try {
      await this.auth.login(this.email().trim(), this.password());
      await this.router.navigate(['/wishlist']);
    } catch (error) {
      this.errorMessage.set(describeError(error));
    } finally {
      this.loading.set(false);
    }
  }
}
