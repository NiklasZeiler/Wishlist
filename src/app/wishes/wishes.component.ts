import { Component } from '@angular/core';
import { FirebaseService } from '../Service/firebase.service';
import { CommonModule } from '@angular/common';
import { Wish } from '../interfaces/wish.interface';

@Component({
  selector: 'app-wishes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wishes.component.html',
  styleUrl: './wishes.component.scss'
})
export class WishesComponent {

  constructor(private firebase: FirebaseService) {
  }

  getWishes(): Wish[] {
    return this.firebase.wishes;
  }

  deleteWish() {

  }


}
