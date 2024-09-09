import { Component } from '@angular/core';
import { LoginService } from '../Service/login.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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

  constructor(private login: LoginService, private router: Router) { }

  register() {
    this.login.createUserWithEmailAndPassword(this.email, this.password)
    this.router.navigate(['/wishes']);
  }

}
