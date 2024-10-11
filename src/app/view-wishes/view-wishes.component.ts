import { Component, Input } from '@angular/core';
import { Wish } from '../interfaces/wish.interface';
import { FirebaseService } from '../Service/firebase.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { HelperService } from '../Service/helper.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-view-wishes',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './view-wishes.component.html',
  styleUrl: './view-wishes.component.scss'
})
export class ViewWishesComponent {
  @Input() wish!: Wish

  noWishes: boolean = false;
  wishId: string = "";

  constructor(private firebase: FirebaseService, private router: Router, private route: ActivatedRoute, public dialog: MatDialog, public help: HelperService) {

  }

  getWishes(): Wish[] {
    console.log(this.firebase.wishes);

    return this.firebase.wishes;
  }

  trackByWishId(index: number, wish: any): string {
    return wish.id;
  }

  wishDone(wish: Wish) {
    wish.completed = true
    wish.completedAt = new Date()
    this.firebase.updateWish(wish)
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


}
