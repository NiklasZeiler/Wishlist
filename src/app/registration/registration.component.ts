import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../Service/auth.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {


  name: string = '';
  email: string = '';
  password: string = '';

  constructor(private auth: AuthService, private router: Router) { }

  register() {
    this.auth.createUser(this.email, this.password, this.name)
  }

}
