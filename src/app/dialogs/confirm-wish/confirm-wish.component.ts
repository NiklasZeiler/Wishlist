import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FirebaseService } from '../../Service/firebase.service';

@Component({
  selector: 'app-confirm-wish',
  standalone: true,
  imports: [],
  templateUrl: './confirm-wish.component.html',
  styleUrl: './confirm-wish.component.scss'
})
export class ConfirmWishComponent {
  dialog: any;

  constructor(private dialogRef: MatDialogRef<ConfirmWishComponent>, private router: Router) { }

  confirm() {
    this.dialogRef.close('confirm');
  }

  cancel() {
    this.dialogRef.close('cancel');
  }



}
