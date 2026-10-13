import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

export interface ConfirmDialogData {
  title: string;
  content: string;
  confirmText: string;
  cancelText: string;
  tone: 'delete' | 'complete';
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>{{ data.content }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button type="button" class="btn-text" [mat-dialog-close]="false">{{ data.cancelText }}</button>
      <button
        type="button"
        class="btn-text confirm"
        [class.confirm--delete]="data.tone === 'delete'"
        [mat-dialog-close]="true"
      >
        {{ data.confirmText }}
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    .confirm {
      color: var(--md-primary);
      font-weight: 700;
    }

    .confirm--delete {
      color: var(--md-error);
    }
  `,
})
export class ConfirmDialogComponent {
  protected readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
}
