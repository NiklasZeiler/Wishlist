import { Component } from '@angular/core';
import { WishesComponent } from "../wishes/wishes.component";
import { Router, RouterOutlet } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { AddWishComponent } from '../add-wish/add-wish.component';
import { AuthService } from '../Service/auth.service';




@Component({
  selector: 'app-overlay',
  standalone: true,
  imports: [WishesComponent, RouterOutlet, MatMenuModule, MatIconModule, AddWishComponent],
  templateUrl: './overlay.component.html',
  styleUrl: './overlay.component.scss'
})
export class OverlayComponent {

  constructor(private router: Router, private auth: AuthService) {

  }


  navigateToFeedback() {
    this.router.navigate(["/feedback"])
  }

  navigateToLogin() {
    this.router.navigate(["/login"])
  }

  navigateToWish() {
    this.router.navigate(["/wishes"])
  }

  openUserMenu() {
    this.router.navigate(["/userProfil"])
  }

  getUserName() {
    let userName;
    this.auth.user$.subscribe(user => {
      userName = user?.displayName;

    })

    return userName;
  }

  logOut() {
    this.auth.logOut();
  }

}
