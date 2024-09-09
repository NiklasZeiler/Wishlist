import { Component } from '@angular/core';
import { LoginComponent } from "../login/login.component";
import { WishesComponent } from "../wishes/wishes.component";
import { Router, RouterOutlet } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { AddWishComponent } from '../add-wish/add-wish.component';



@Component({
  selector: 'app-overlay',
  standalone: true,
  imports: [LoginComponent, WishesComponent, RouterOutlet, MatMenuModule, MatIconModule, AddWishComponent],
  templateUrl: './overlay.component.html',
  styleUrl: './overlay.component.scss'
})
export class OverlayComponent {

  constructor(private router: Router) {

  }


  navigateToFeedback() {
    this.router.navigate(["/feedback"])
  }

  navigateToLogin() {
    this.router.navigate(["/login"])
  }

}
