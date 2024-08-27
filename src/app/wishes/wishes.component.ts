import { Component } from '@angular/core';
import { FirebaseService } from '../Service/firebase.service';
import { CommonModule } from '@angular/common';
import { Wish } from '../interfaces/wish.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wishes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wishes.component.html',
  styleUrl: './wishes.component.scss'
})
export class WishesComponent {

  constructor(private firebase: FirebaseService, private router: Router) {
  }


  getWishes(): Wish[] {
    return this.firebase.wishes;
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




}
