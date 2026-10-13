import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { describeError } from '../../core/auth.service';
import { NotifierService } from '../../core/notifier.service';
import { Priority, Wish } from '../../core/wish.model';
import { WishService } from '../../core/wish.service';
import { ConfirmActionButtonComponent } from '../../shared/confirm-action-button/confirm-action-button.component';
import { MainLayoutComponent } from '../../shared/main-layout/main-layout.component';
import { WishCardComponent } from '../../shared/wish-card/wish-card.component';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [
    ConfirmActionButtonComponent,
    MainLayoutComponent,
    MatIconModule,
    RouterLink,
    WishCardComponent,
  ],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss',
})
export class WishlistComponent {
  private readonly wishService = inject(WishService);
  private readonly notifier = inject(NotifierService);

  /** `null` until the first snapshot arrives. */
  protected readonly wishes = signal<Wish[] | null>(null);
  protected readonly loadError = signal<string | null>(null);

  constructor() {
    this.wishService
      .watchOwnWishes()
      .pipe(takeUntilDestroyed(inject(DestroyRef)))
      .subscribe({
        next: (wishes) => this.wishes.set(wishes),
        error: (error) => this.loadError.set(describeError(error)),
      });
  }

  protected async changePriority(wish: Wish, priority: Priority): Promise<void> {
    try {
      await this.wishService.updatePriority(wish.id, priority);
      this.notifier.success('Priorität aktualisiert', 1000);
    } catch {
      this.notifier.error('Fehler beim Aktualisieren der Priorität');
    }
  }

  protected async deleteWish(wish: Wish): Promise<void> {
    try {
      await this.wishService.deleteWish(wish);
    } catch (error) {
      this.notifier.error(`Fehler: ${describeError(error)}`);
    }
  }
}
