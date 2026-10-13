import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthService, describeError } from '../../core/auth.service';
import { NotifierService } from '../../core/notifier.service';
import { UserService } from '../../core/user.service';
import { validateEmail, validatePassword } from '../../core/validators';
import { WishService } from '../../core/wish.service';
import { MainLayoutComponent } from '../../shared/main-layout/main-layout.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, MainLayoutComponent, MatIconModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  private readonly auth = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly wishService = inject(WishService);
  private readonly notifier = inject(NotifierService);

  protected readonly user = this.auth.user;
  protected readonly lastLogin = computed(() => {
    const time = this.user()?.lastSignInTime;
    return time ? new Date(time).toLocaleString('de-DE') : 'N/A';
  });

  protected readonly savedDate = signal('');
  protected readonly dateInput = signal('');
  protected readonly newName = signal('');
  protected readonly newEmail = signal('');
  protected readonly newPassword = signal('');
  protected readonly emailError = signal<string | null>(null);
  protected readonly passwordError = signal<string | null>(null);
  protected readonly sharing = signal(false);

  constructor() {
    void this.loadSavedDate();
  }

  protected async saveDate(): Promise<void> {
    const formatted = this.formatDate(this.dateInput());
    if (!formatted) {
      return;
    }
    await this.run(async () => {
      await this.userService.saveDate(formatted);
      this.savedDate.set(formatted);
      this.dateInput.set('');
      this.notifier.success('Datum gespeichert');
    });
  }

  protected async changeName(): Promise<void> {
    const name = this.newName().trim();
    if (!name) {
      return;
    }
    await this.run(async () => {
      await this.userService.updateName(name);
      this.newName.set('');
      this.notifier.success('Name geändert');
    });
  }

  protected async changeEmail(): Promise<void> {
    const email = this.newEmail().trim();
    this.emailError.set(validateEmail(email));
    if (this.emailError()) {
      return;
    }
    await this.run(async () => {
      await this.userService.updateEmail(email);
      this.newEmail.set('');
      this.notifier.success('Zur Bestätigung wurde eine E-Mail an die neue Adresse gesendet');
    });
  }

  protected async changePassword(): Promise<void> {
    const password = this.newPassword();
    this.passwordError.set(validatePassword(password));
    if (this.passwordError()) {
      return;
    }
    await this.run(async () => {
      await this.userService.updatePassword(password);
      this.newPassword.set('');
      this.notifier.success('Passwort geändert');
    });
  }

  protected async shareList(): Promise<void> {
    this.sharing.set(true);
    try {
      const code = await this.wishService.generateOrGetShareCode();
      if (!code) {
        this.notifier.error('Fehler beim Generieren des Share-Codes');
        return;
      }

      const link = `${location.origin}/share?code=${code}`;
      const text = `🎁 Schau dir meine Wunschliste an!\n\n${link}\n\nOder gib in der App den Code ein: ${code}`;

      if (navigator.share) {
        await navigator.share({ title: 'Meine Wunschliste', text });
      } else {
        await navigator.clipboard.writeText(text);
        this.notifier.success('Link in die Zwischenablage kopiert');
      }
    } catch (error) {
      // Dismissing the native share sheet rejects with an AbortError, which is not a failure.
      if ((error as { name?: string }).name !== 'AbortError') {
        this.notifier.error(`Fehler: ${describeError(error)}`);
      }
    } finally {
      this.sharing.set(false);
    }
  }

  private async loadSavedDate(): Promise<void> {
    try {
      this.savedDate.set(await this.userService.getSavedDate());
    } catch {
      this.savedDate.set('');
    }
  }

  private async run(action: () => Promise<void>): Promise<void> {
    try {
      await action();
    } catch (error) {
      this.notifier.error(`Fehler: ${describeError(error)}`);
    }
  }

  /** Converts the `yyyy-mm-dd` value of a date input to the stored `dd.mm.yyyy` format. */
  private formatDate(isoDate: string): string {
    const [year, month, day] = isoDate.split('-');
    return year && month && day ? `${day}.${month}.${year}` : '';
  }
}
