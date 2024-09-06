import { Component, Inject } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FirebaseService } from '../../Service/firebase.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select';
import { ButtonsService } from '../../Service/buttons.service';



@Component({
  selector: 'app-change-prio',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './change-prio.component.html',
  styleUrls: ['./change-prio.component.scss']
})
export class ChangePrioComponent {
  priorityOptions = ["Niedrig", "Mittel", "Hoch"]
  selectedPriority: string = "";


  constructor(
    public dialogRef: MatDialogRef<ChangePrioComponent>,
    public firebase: FirebaseService,
  ) { }




  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close({ priority: this.selectedPriority });
  }
}
