import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

export interface ShareDialogData {
  shareLink: string;
}

@Component({
  selector: 'app-share-link',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './share-link.component.html',
  styleUrl: './share-link.component.scss'
})
export class ShareLinkComponent {

  constructor(
    public dialogRef: MatDialogRef<ShareLinkComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ShareDialogData
  ) { }

  closeDialog(): void {
    this.dialogRef.close();
  }

}
