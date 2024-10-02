import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../Service/auth.service';
import { FirebaseService } from '../Service/firebase.service';
import { HelperService } from '../Service/helper.service';

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


  constructor(private auth: AuthService, private firebase: FirebaseService, public help: HelperService) {
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

  saveDate(selectedDate: string) {
    let formattedDate = this.formatDate(selectedDate);
    localStorage.setItem('formattedDate', formattedDate);
    console.log('Selected date:', formattedDate);
    location.reload();
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';

    const date = new Date(dateString);
    const day = ('0' + date.getDate()).slice(-2); // Get day with leading zero
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Get month with leading zero
    const year = date.getFullYear(); // Get full year

    return `${day}.${month}.${year}`; // Format as dd.mm.yyyy
  }

  getFormattedDate() {
    return this.help.savedDate
  }
}
