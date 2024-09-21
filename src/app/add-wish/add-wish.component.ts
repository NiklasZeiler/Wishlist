import { Component } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../Service/firebase.service';
import { Wish } from '../interfaces/wish.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-wish',
  standalone: true,
  imports: [NgbDropdownModule, FormsModule],
  templateUrl: './add-wish.component.html',
  styleUrl: './add-wish.component.scss'
})
export class AddWishComponent {

  constructor(public firebase: FirebaseService, private router: Router) {
  }

  image: string = ""
  url: string = "";
  wish: string = ""
  completed: boolean = false



  setPriority(priority: string) {
    this.firebase.selectedPriority = priority;
  }

  addWish() {
    this.firebase.photoUrl = this.image

    console.log('Add wish');
    const wish: Wish = {
      type: "wish",
      wish: this.wish,
      link: this.url,
      priority: this.firebase.selectedPriority,
      image: this.image,
      completed: this.completed,
    };
    this.firebase.addWish(wish);
    this.router.navigate(['/wishes'])
  }

}
