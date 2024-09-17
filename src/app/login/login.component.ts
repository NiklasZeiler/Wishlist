import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../Service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {


  email: string = '';
  password: string = '';

  constructor(private router: Router, private auth: AuthService) { }


  navigateToRegistration(event: TouchEvent) {
    event.preventDefault();
    this.router.navigate(["/registration"]);
  }

  onLogin() {
    this.router.navigate(['/wishes']);
    this.auth.signInWithEmailAndPassword(this.email, this.password)
    this.auth.listenToAuthState()

  }

  forgotPassword() {
    this.auth.forgotPassword(this.email);
  }

}
