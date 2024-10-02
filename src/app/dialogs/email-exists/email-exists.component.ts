import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-email-exists',
  standalone: true,
  imports: [],
  templateUrl: './email-exists.component.html',
  styleUrl: './email-exists.component.scss'
})
export class EmailExistsComponent {


  constructor(public dialogRef: MatDialogRef<EmailExistsComponent>) { }


  close(): void {
    this.dialogRef.close();
  }

}
