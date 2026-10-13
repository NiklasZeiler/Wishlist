import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { describeError } from '../../core/auth.service';
import { NotifierService } from '../../core/notifier.service';
import { Wish } from '../../core/wish.model';
import { WishService } from '../../core/wish.service';
import { ConfirmActionButtonComponent } from '../../shared/confirm-action-button/confirm-action-button.component';
import { ShareCodeDialogComponent } from '../../shared/dialogs/share-code-dialog.component';
import { MainLayoutComponent } from '../../shared/main-layout/main-layout.component';
import { WishCardComponent } from '../../shared/wish-card/wish-card.component';

type ShareStatus = 'no-code' | 'loading' | 'invalid' | 'error' | 'ready';

@Component({
  selector: 'app-share',
  standalone: true,
  imports: [ConfirmActionButtonComponent, MainLayoutComponent, MatIconModule, WishCardComponent],
  templateUrl: './share.component.html',
  styleUrl: './share.component.scss',
})
export class ShareComponent {
  private readonly wishService = inject(WishService);
  private readonly notifier = inject(NotifierService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  protected readonly status = signal<ShareStatus>('no-code');
  protected readonly errorMessage = signal('');
  protected readonly ownerId = signal('');
  protected readonly wishes = signal<Wish[] | null>(null);
  protected readonly listError = signal<string | null>(null);

  private wishSubscription?: Subscription;

  constructor() {
    const destroyRef = inject(DestroyRef);
    destroyRef.onDestroy(() => this.wishSubscription?.unsubscribe());

    // `code` is used by new links, `shareCode` by links created before the redesign.
    inject(ActivatedRoute)
      .queryParamMap.pipe(takeUntilDestroyed(destroyRef))
      .subscribe((params) => {
        const code = params.get('code') ?? params.get('shareCode');
        if (code) {
          void this.resolveOwner(code);
        } else {
          this.wishSubscription?.unsubscribe();
          this.status.set('no-code');
        }
      });
  }

  protected openCodeDialog(): void {
    this.dialog
      .open<ShareCodeDialogComponent, void, string>(ShareCodeDialogComponent, {
        panelClass: 'dialog-adaptive',
        width: '360px',
        maxWidth: '90vw',
      })
      .afterClosed()
      .subscribe((code) => {
        if (code) {
          void this.router.navigate(['/share'], { queryParams: { code } });
        }
      });
  }

  protected async complete(wish: Wish): Promise<void> {
    try {
      await this.wishService.markAsComplete(wish.id, this.ownerId());
      this.notifier.success('✓ Wunsch als erledigt markiert!');
    } catch (error) {
      this.notifier.error(`Fehler: ${describeError(error)}`);
    }
  }

  protected back(): void {
    void this.router.navigate(['/share']);
  }

  private async resolveOwner(code: string): Promise<void> {
    this.wishSubscription?.unsubscribe();
    this.status.set('loading');
    try {
      const ownerId = await this.wishService.getOwnerIdFromShareCode(code);
      if (!ownerId) {
        this.status.set('invalid');
        return;
      }
      this.ownerId.set(ownerId);
      this.status.set('ready');
      this.watchWishes(ownerId);
    } catch (error) {
      this.errorMessage.set(describeError(error));
      this.status.set('error');
    }
  }

  private watchWishes(ownerId: string): void {
    this.wishes.set(null);
    this.listError.set(null);
    this.wishSubscription = this.wishService.watchSharedWishes(ownerId).subscribe({
      next: (wishes) => this.wishes.set(wishes),
      error: (error) => this.listError.set(describeError(error)),
    });
  }
}
