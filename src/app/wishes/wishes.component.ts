import { Component, Input } from '@angular/core';
import { FirebaseService } from '../Service/firebase.service';
import { CommonModule } from '@angular/common';
import { Wish } from '../interfaces/wish.interface';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ChangePrioComponent } from '../dialogs/change-prio/change-prio.component';

@Component({
  selector: 'app-wishes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wishes.component.html',
  styleUrl: './wishes.component.scss'
})
export class WishesComponent {
  @Input() wish!: Wish

  constructor(private firebase: FirebaseService, private router: Router, public dialog: MatDialog) {
  }


  getWishes(): Wish[] {
    return this.firebase.wishes;
  }

  trackByWishId(index: number, wish: any): string {
    return wish.id; // or whatever unique identifier you have
  }

  deleteWish() {

  }
  navigateToAddWish(event: TouchEvent) {
    event.preventDefault();
    this.router.navigate(['/addWishes'])
  }

  getPriorityStyle(priority: string): any {
    switch (priority) {
      case 'Hoch':
        return { color: 'red' };
      case 'Mittel':
        return { color: 'yellow' };
      case 'Niedrig':
        return { color: '#32CD32' };
      default:
        return {};
    }
  }

  changePriority(wish: Wish): void {
    const dialogRef = this.dialog.open(ChangePrioComponent, {
      width: '250px',
      data: { wish: wish }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        wish.priority = result.priority;
        this.firebase.updatePriority(wish)
      }
    });
  }




}
