import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotifierService {
  private readonly snackBar = inject(MatSnackBar);

  success(message: string, durationMs = 3000): void {
    this.snackBar.open(message, undefined, {
      duration: durationMs,
      panelClass: 'snack-success',
    });
  }

  error(message: string): void {
    this.snackBar.open(message, 'OK', { duration: 5000, panelClass: 'snack-error' });
  }
}
