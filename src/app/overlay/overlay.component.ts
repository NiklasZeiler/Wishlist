import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WishesComponent } from "../wishes/wishes.component";
import { Router, RouterOutlet } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { AddWishComponent } from '../add-wish/add-wish.component';
import { AuthService } from '../Service/auth.service';




@Component({
  selector: 'app-overlay',
  standalone: true,
  imports: [CommonModule, WishesComponent, RouterOutlet, MatMenuModule, MatIconModule, AddWishComponent],
  templateUrl: './overlay.component.html',
  styleUrl: './overlay.component.scss'
})
export class OverlayComponent {

  noUser = true;

  constructor(private router: Router, private auth: AuthService) {

  }


  ngOnInit() {
    this.auth.user$.subscribe(user => {
      console.log(user);
      if (user != null) {
        this.noUser = false
      }

    })
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
