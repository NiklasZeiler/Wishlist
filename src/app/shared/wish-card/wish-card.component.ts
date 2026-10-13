import { Component, computed, inject, input, output, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { PRIORITIES, Priority, Wish } from '../../core/wish.model';
import { DescriptionDialogComponent } from '../dialogs/description-dialog.component';
import { ImageViewerDialogComponent } from '../dialogs/image-viewer-dialog.component';

const BADGE_COLORS: Record<Priority, string> = {
  hoch: '#f44336',
  mittel: '#ff9800',
  niedrig: '#4caf50',
};

const TITLE_COLORS: Record<Priority, string> = {
  hoch: 'var(--md-error)',
  mittel: 'var(--md-tertiary)',
  niedrig: 'var(--md-primary)',
};

@Component({
  selector: 'app-wish-card',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './wish-card.component.html',
  styleUrl: './wish-card.component.scss',
})
export class WishCardComponent {
  readonly wish = input.required<Wish>();
  /** Only the owner may change the priority; shared lists are read-only. */
  readonly editable = input(false);
  readonly priorityChange = output<Priority>();

  private readonly dialog = inject(MatDialog);

  protected readonly priorities = PRIORITIES;
  protected readonly dropdownOpen = signal(false);
  protected readonly imageFailed = signal(false);

  protected readonly badgeColor = computed(() => BADGE_COLORS[this.wish().priority]);
  protected readonly titleColor = computed(() => TITLE_COLORS[this.wish().priority]);
  protected readonly badgeText = computed(() => this.wish().priority.toUpperCase());

  protected titleColorFor(priority: Priority): string {
    return TITLE_COLORS[priority];
  }

  protected selectPriority(priority: Priority): void {
    this.dropdownOpen.set(false);
    this.priorityChange.emit(priority);
  }

  protected showDescription(): void {
    this.dialog.open(DescriptionDialogComponent, {
      data: this.wish().description,
      width: '400px',
      maxWidth: '90vw',
    });
  }

  protected openImage(): void {
    this.dialog.open(ImageViewerDialogComponent, {
      data: this.wish().image,
      panelClass: 'viewer-dialog',
      maxWidth: '100vw',
      width: '100vw',
      height: '100vh',
      autoFocus: false,
    });
  }
}
