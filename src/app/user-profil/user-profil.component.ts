import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../Service/auth.service';
import { FirebaseService } from '../Service/firebase.service';

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
  formattedDate: any

  constructor(private auth: AuthService, private firebase: FirebaseService) {
  }

  ngOnInit() {
    this.getUserInfo();
    this.auth.listenToAuthState();
    this.deleteOlderWishes()
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

  deleteOlderWishes() {
    const currentDate = new Date()
    if (this.formattedDate > currentDate) {
      this.firebase.deleteOldWishes(this.formattedDate)
    } else {
      return
    }

  }

  saveDate(selectedDate: string) {
    this.formattedDate = this.formatDate(selectedDate);
    console.log('Selected date:', this.formattedDate);
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';

    const date = new Date(dateString);
    const day = ('0' + date.getDate()).slice(-2); // Get day with leading zero
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Get month with leading zero
    const year = date.getFullYear(); // Get full year

    return `${day}.${month}.${year}`; // Format as dd.mm.yyyy
  }

}
