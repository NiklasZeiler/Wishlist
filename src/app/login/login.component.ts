import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor(private router: Router) { }

  navigateToRegistration() {
    this.router.navigate(["/registration"]);
  }

  onLogin(form: any) {
    // const { email, password } = form.value;
    // this.loginService.login(email, password).subscribe(
    // response => {
    // Handle successful login
    // console.log('Login successful', response);
    this.router.navigate(['/wishes']);
    // },
    // error => {
    // Handle login error
    // console.error('Login failed', error);
    // alert('Login failed, please try again.');
    // }
    // );
  }

}
