import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-share-code-dialog',
  standalone: true,
  imports: [FormsModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>Share-Code eingeben</h2>
    <mat-dialog-content>
      <input
        class="code"
        type="text"
        placeholder="Code hier eingeben"
        aria-label="Share-Code"
        [ngModel]="code()"
        (ngModelChange)="code.set($event)"
        (keydown.enter)="submit()"
      />
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button type="button" class="btn-text" mat-dialog-close>Abbrechen</button>
      <button type="button" class="open" [disabled]="!code().trim()" (click)="submit()">Öffnen</button>
    </mat-dialog-actions>
  `,
  styles: `
    .code {
      width: 100%;
      padding: 14px;
      background: transparent;
      border: 1px solid var(--md-outline);
      border-radius: 4px;
      color: var(--md-on-surface);
      font: inherit;
    }

    .open {
      padding: 10px 20px;
      background: var(--md-primary);
      border: 0;
      border-radius: 12px;
      color: var(--md-on-primary);
      cursor: pointer;

      &:disabled {
        opacity: 0.5;
        cursor: default;
      }
    }
  `,
})
export class ShareCodeDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<ShareCodeDialogComponent, string>);
  protected readonly code = signal('');

  protected submit(): void {
    const code = this.code().trim();
    if (code) {
      this.dialogRef.close(code);
    }
  }
}
