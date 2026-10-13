import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ThemeService } from '../../core/theme.service';

@Component({
  selector: 'app-color-picker-dialog',
  standalone: true,
  imports: [MatDialogModule],
  template: `
    <h2 mat-dialog-title>Wähle deine Akzentfarbe</h2>
    <mat-dialog-content>
      <input
        class="picker"
        type="color"
        aria-label="Akzentfarbe"
        [value]="theme.seedColor()"
        (input)="preview($event)"
      />
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button type="button" class="btn-text" (click)="cancel()">Abbrechen</button>
      <button type="button" class="save" (click)="save()">Speichern</button>
    </mat-dialog-actions>
  `,
  styles: `
    .picker {
      display: block;
      width: 100%;
      height: 160px;
      padding: 0;
      background: transparent;
      border: 0;
      border-radius: 12px;
      cursor: pointer;
    }

    .save {
      padding: 10px 20px;
      background: var(--md-primary);
      border: 0;
      border-radius: 12px;
      color: var(--md-on-primary);
      cursor: pointer;
    }
  `,
})
export class ColorPickerDialogComponent {
  protected readonly theme = inject(ThemeService);
  private readonly dialogRef = inject(MatDialogRef<ColorPickerDialogComponent>);

  private selectedColor = this.theme.seedColor();

  protected preview(event: Event): void {
    this.selectedColor = (event.target as HTMLInputElement).value;
    this.theme.previewColor(this.selectedColor);
  }

  protected cancel(): void {
    this.theme.restoreSavedColor();
    this.dialogRef.close();
  }

  protected save(): void {
    this.theme.saveColor(this.selectedColor);
    this.dialogRef.close();
  }
}
