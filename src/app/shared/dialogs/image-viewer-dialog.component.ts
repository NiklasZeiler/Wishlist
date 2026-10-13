import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-image-viewer-dialog',
  standalone: true,
  imports: [MatDialogModule, MatIconModule],
  template: `
    <button type="button" class="close" aria-label="Schließen" mat-dialog-close>
      <mat-icon>close</mat-icon>
    </button>
    @if (failed()) {
      <mat-icon class="broken">broken_image</mat-icon>
    } @else {
      <img [src]="imageUrl" alt="Wunschbild" (error)="failed.set(true)" mat-dialog-close />
    }
  `,
  styles: `
    :host {
      position: relative;
      display: grid;
      place-items: center;
      width: 100vw;
      height: 100vh;
      background: #000;
    }

    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      cursor: zoom-out;
    }

    .broken {
      width: 64px;
      height: 64px;
      font-size: 64px;
      color: rgba(255, 255, 255, 0.54);
    }

    .close {
      position: absolute;
      top: 8px;
      right: 8px;
      z-index: 1;
      display: grid;
      place-items: center;
      width: 48px;
      height: 48px;
      background: transparent;
      border: 0;
      color: #fff;
      cursor: pointer;
    }
  `,
})
export class ImageViewerDialogComponent {
  protected readonly imageUrl = inject<string>(MAT_DIALOG_DATA);
  protected readonly failed = signal(false);
}
