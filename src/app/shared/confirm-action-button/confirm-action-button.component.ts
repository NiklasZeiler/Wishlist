import { Component, inject, input, output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { ConfirmDialogComponent, ConfirmDialogData } from '../dialogs/confirm-dialog.component';

/** Full-width button that asks for confirmation before it emits `confirmed`. */
@Component({
  selector: 'app-confirm-action-button',
  standalone: true,
  template: `
    <button
      type="button"
      class="action"
      [class.action--delete]="tone() === 'delete'"
      [class.action--complete]="tone() === 'complete'"
      (click)="ask()"
    >
      {{ label() }}
    </button>
  `,
  styles: `
    .action {
      width: 100%;
      padding: 10px 16px;
      border: 0;
      border-radius: 8px;
      font: inherit;
      cursor: pointer;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
    }

    .action--delete {
      background: var(--md-error-container);
      color: var(--md-on-error-container);
    }

    .action--complete {
      background: var(--md-primary-container);
      color: var(--md-on-primary-container);
    }
  `,
})
export class ConfirmActionButtonComponent {
  readonly label = input.required<string>();
  readonly tone = input.required<'delete' | 'complete'>();
  readonly dialogTitle = input.required<string>();
  readonly dialogContent = input.required<string>();
  readonly confirmText = input.required<string>();
  readonly confirmed = output<void>();

  private readonly dialog = inject(MatDialog);

  protected async ask(): Promise<void> {
    const data: ConfirmDialogData = {
      title: this.dialogTitle(),
      content: this.dialogContent(),
      confirmText: this.confirmText(),
      cancelText: 'Abbrechen',
      tone: this.tone(),
    };
    const dialogRef = this.dialog.open<ConfirmDialogComponent, ConfirmDialogData, boolean>(
      ConfirmDialogComponent,
      { data, panelClass: 'dialog-adaptive', width: '360px', maxWidth: '90vw' },
    );

    if (await firstValueFrom(dialogRef.afterClosed())) {
      this.confirmed.emit();
    }
  }
}
