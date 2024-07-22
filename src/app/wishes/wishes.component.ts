import { Component } from '@angular/core';
import { FirebaseService } from '../Service/firebase.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wishes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wishes.component.html',
  styleUrl: './wishes.component.scss'
})
export class WishesComponent {
  constructor(public firebase: FirebaseService) {
  }

}
