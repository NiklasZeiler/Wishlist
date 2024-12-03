import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../Service/auth.service';
import { HelperService } from '../Service/helper.service';




@Component({
  selector: 'app-overlay',
  standalone: true,
  imports: [CommonModule, MatMenuModule, MatIconModule],
  templateUrl: './overlay.component.html',
  styleUrl: './overlay.component.scss'
})
export class OverlayComponent {

  noUser = true;
  disable = false;


  constructor(private router: Router, private auth: AuthService, public help: HelperService) {

  }


  ngOnInit() {
    this.auth.user$.subscribe(user => {
      if (user != null) {
        this.noUser = false
      }
    })

    this.auth.getUsername()

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
