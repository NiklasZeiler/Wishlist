import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-exists',
  standalone: true,
  imports: [],
  templateUrl: './email-exists.component.html',
  styleUrl: './email-exists.component.scss'
})
export class EmailExistsComponent {


  constructor(public dialogRef: MatDialogRef<EmailExistsComponent>, private router: Router) { }


  close(): void {
    this.dialogRef.close();
    this.dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['/registration']);
    });
  }

}
