import { Component } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../Service/firebase.service';
import { Wish } from '../interfaces/wish.interface';

@Component({
  selector: 'app-add-wish',
  standalone: true,
  imports: [NgbDropdownModule, FormsModule],
  templateUrl: './add-wish.component.html',
  styleUrl: './add-wish.component.scss'
})
export class AddWishComponent {

  constructor(public firebase: FirebaseService) {
  }

  image: string = ""
  url: string = "";
  wish: string = ""



  setPriority(priority: string) {
    this.firebase.selectedPriority = priority;
  }


  // addWish(event: TouchEvent) {
  //   this.firebase.photoUrl = this.image

  //   event.preventDefault();
  //   console.log('Add wish');
  //   let wish: Wish = {
  //     type: "wish",
  //     wish: this.wish,
  //     link: this.url,
  //     priority: this.selectedPriority,
  //     image: this.image,
  //   }
  //   console.log(wish);
  //   this.firebase.addWish(wish);

  // }

  addWish(event: TouchEvent) {
    this.firebase.photoUrl = this.image

    event.preventDefault();
    console.log('Add wish');
    const wish: Wish = {
      type: "wish",
      wish: this.wish,
      link: this.url,
      priority: this.firebase.selectedPriority,
      image: this.image,
    };
    this.firebase.addWish(wish);
  }

}
