import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../Service/auth.service';

@Component({
  selector: 'app-change-user-profil',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './change-user-profil.component.html',
  styleUrl: './change-user-profil.component.scss'
})
export class ChangeUserProfilComponent {

  name: string = '';
  email: string = '';
  password: string = '';

  constructor(private auth: AuthService) { }

  updateName() {
    this.auth.updateUserName(this.name)
  }

  updateEmail() {
    this.auth.updateUserEmail(this.email)
  }

  changePassword() {}



}
