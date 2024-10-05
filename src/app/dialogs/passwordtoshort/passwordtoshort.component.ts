import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-passwordtoshort',
  standalone: true,
  imports: [],
  templateUrl: './passwordtoshort.component.html',
  styleUrl: './passwordtoshort.component.scss'
})
export class PasswordtoshortComponent {

  constructor(public dialogRef: MatDialogRef<PasswordtoshortComponent>, private router: Router) { }

  close(): void {
    this.dialogRef.close();
    this.dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['/registration']);
    });
  }

}
