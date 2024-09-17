import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../Service/auth.service';

@Component({
  selector: 'app-user-profil',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-profil.component.html',
  styleUrl: './user-profil.component.scss'
})
export class UserProfilComponent {

  name: string = '';
  email: string = '';
  password: string = '';
  userName: any;
  userEmail: any;
  lastLogin: any;

  constructor(private auth: AuthService) {
  }

  ngOnInit() {
    this.getUserInfo();
    this.auth.listenToAuthState();
  }


  getUserInfo() {
    let loginTime: any;
    this.auth.user$.subscribe(user => {
      this.userName = user?.displayName;
      this.userEmail = user?.email;
      loginTime = user?.metadata.lastSignInTime
      this.lastLogin = new Date(loginTime).toLocaleString()

    })



  }



  updateName() {
    this.auth.updateUserName(this.name)
  }

  updateEmail() {
    this.auth.updateUserEmail(this.email)
  }

  changePassword() {
    this.auth.updateUserPassword(this.password)
  }



}
