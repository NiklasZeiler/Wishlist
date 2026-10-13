import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { describeError } from '../../core/auth.service';
import { NotifierService } from '../../core/notifier.service';
import { validateUrl } from '../../core/validators';
import { PRIORITIES, Priority } from '../../core/wish.model';
import { WishService } from '../../core/wish.service';
import { MainLayoutComponent } from '../../shared/main-layout/main-layout.component';

const PRIORITY_DOT_COLORS: Record<Priority, string> = {
  niedrig: '#2196f3',
  mittel: '#ff9800',
  hoch: '#f44336',
};

@Component({
  selector: 'app-add-wish',
  standalone: true,
  imports: [FormsModule, MainLayoutComponent, MatIconModule],
  templateUrl: './add-wish.component.html',
  styleUrl: './add-wish.component.scss',
})
export class AddWishComponent {
  private readonly wishService = inject(WishService);
  private readonly router = inject(Router);
  private readonly notifier = inject(NotifierService);

  protected readonly priorities = PRIORITIES;
  protected readonly title = signal('');
  protected readonly description = signal('');
  protected readonly link = signal('');
  protected readonly priority = signal<Priority>('niedrig');
  protected readonly image = signal<File | null>(null);
  protected readonly submitted = signal(false);
  protected readonly saving = signal(false);

  protected readonly titleError = computed(() =>
    this.submitted() && !this.title().trim() ? 'Bitte einen Titel eingeben' : null,
  );
  protected readonly descriptionError = computed(() =>
    this.submitted() && !this.description().trim() ? 'Bitte eine Beschreibung eingeben' : null,
  );
  protected readonly linkError = computed(() => (this.submitted() ? validateUrl(this.link()) : null));

  protected readonly imagePreviewUrl = signal<string | null>(null);

  protected readonly dotColor = computed(() => PRIORITY_DOT_COLORS[this.priority()]);

  constructor() {
    inject(DestroyRef).onDestroy(() => this.releasePreview());
  }

  protected pickImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    input.value = '';
    if (file) {
      this.setImage(file);
    }
  }

  protected removeImage(): void {
    this.setImage(null);
  }

  private setImage(file: File | null): void {
    this.releasePreview();
    this.image.set(file);
    this.imagePreviewUrl.set(file ? URL.createObjectURL(file) : null);
  }

  private releasePreview(): void {
    const url = this.imagePreviewUrl();
    if (url) {
      URL.revokeObjectURL(url);
    }
  }

  protected async save(): Promise<void> {
    this.submitted.set(true);
    if (this.titleError() || this.descriptionError() || this.linkError()) {
      return;
    }

    this.saving.set(true);
    try {
      await this.wishService.addWish(
        {
          wish: this.title().trim(),
          description: this.description().trim(),
          link: this.link().trim(),
          priority: this.priority(),
        },
        this.image(),
      );
      await this.router.navigate(['/wishlist']);
      this.notifier.success('✓ Wunsch erfolgreich hinzugefügt!');
    } catch (error) {
      this.notifier.error(`Fehler: ${describeError(error)}`);
    } finally {
      this.saving.set(false);
    }
  }
}
