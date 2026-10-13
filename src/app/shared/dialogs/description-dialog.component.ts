import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-description-dialog',
  standalone: true,
  imports: [MatDialogModule],
  template: `
    <h2 mat-dialog-title>Wunsch Beschreibung</h2>
    <mat-dialog-content class="text">{{ description }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button type="button" class="close" mat-dialog-close>Schließen</button>
    </mat-dialog-actions>
  `,
  styles: `
    .text {
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }

    .close {
      padding: 8px 12px;
      background: transparent;
      border: 0;
      color: var(--md-light-primary);
      cursor: pointer;
    }
  `,
})
export class DescriptionDialogComponent {
  protected readonly description = inject<string>(MAT_DIALOG_DATA);
}
