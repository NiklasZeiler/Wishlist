import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { AuthService, describeError } from '../../core/auth.service';
import { validateEmail } from '../../core/validators';

@Component({
  selector: 'app-forgot-password-dialog',
  standalone: true,
  imports: [FormsModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>Passwort zurücksetzen</h2>

    @if (sent()) {
      <mat-dialog-content>
        Falls ein Konto mit dieser E-Mail-Adresse existiert, haben wir dir einen Link zum
        Zurücksetzen gesendet. Prüfe auch deinen Spam-Ordner.
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button type="button" class="send" mat-dialog-close>Schließen</button>
      </mat-dialog-actions>
    } @else {
      <mat-dialog-content>
        <p class="hint">Wir senden dir einen Link, mit dem du ein neues Passwort festlegen kannst.</p>
        <div class="field" [class.field--invalid]="error()">
          <label class="field__label" for="reset-email">E-Mail</label>
          <div class="field__control">
            <input
              id="reset-email"
              type="email"
              autocomplete="email"
              [ngModel]="email()"
              (ngModelChange)="email.set($event); error.set(null)"
              (keydown.enter)="send()"
            />
          </div>
          @if (error()) {
            <p class="field__error">{{ error() }}</p>
          }
        </div>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button type="button" class="btn-text" mat-dialog-close>Abbrechen</button>
        <button type="button" class="send" [disabled]="sending()" (click)="send()">
          {{ sending() ? 'Wird gesendet…' : 'Link senden' }}
        </button>
      </mat-dialog-actions>
    }
  `,
  styles: `
    .hint {
      margin: 0 0 16px;
      color: var(--md-on-surface-variant);
    }

    .send {
      padding: 10px 20px;
      background: var(--md-primary);
      border: 0;
      border-radius: 12px;
      color: var(--md-on-primary);
      cursor: pointer;

      &:disabled {
        opacity: 0.6;
        cursor: default;
      }
    }
  `,
})
export class ForgotPasswordDialogComponent {
  private readonly auth = inject(AuthService);

  protected readonly email = signal(inject<string>(MAT_DIALOG_DATA, { optional: true }) ?? '');
  protected readonly error = signal<string | null>(null);
  protected readonly sending = signal(false);
  protected readonly sent = signal(false);

  protected async send(): Promise<void> {
    const email = this.email().trim();
    const validationError = validateEmail(email);
    if (validationError) {
      this.error.set(validationError);
      return;
    }

    this.sending.set(true);
    try {
      await this.auth.sendPasswordReset(email);
      this.sent.set(true);
    } catch (error) {
      this.error.set(describeError(error));
    } finally {
      this.sending.set(false);
    }
  }
}
