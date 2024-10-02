import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {

  constructor(public dialogRef: MatDialogRef<ChangePasswordComponent>) { }

  close(): void {
    this.dialogRef.close();
  }

}
