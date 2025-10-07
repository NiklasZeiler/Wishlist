import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-wish-info',
  standalone: true,
  imports: [],
  templateUrl: './wish-info.component.html',
  styleUrl: './wish-info.component.scss'
})
export class WishInfoComponent {

  constructor(public dialogRef: MatDialogRef<WishInfoComponent>, @Inject(MAT_DIALOG_DATA) public data: string) { }


  close(): void {
    this.dialogRef.close();
  }
}
