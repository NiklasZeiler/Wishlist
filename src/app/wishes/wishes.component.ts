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
  navigateToAddWish() {
    this.router.navigate(['/addWishes'])
  }


}
