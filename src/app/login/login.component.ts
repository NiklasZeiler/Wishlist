import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../Service/auth.service';
import { ForgotPasswordComponent } from '../dialogs/forgot-password/forgot-password.component';
import { MatDialog } from '@angular/material/dialog';

export interface DialogData {
  emailFor: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  readonly dialog = inject(MatDialog);



  email: string = '';
  password: string = '';

  constructor(private router: Router, private auth: AuthService) { }

  navigateToRegistration() {
    this.router.navigate(["/registration"]);
  }

  onLogin() {
    this.router.navigate(['/wishes']);
    this.auth.signInWithEmail(this.email, this.password)
    this.auth.listenToAuthState()

  }

  openDialog(): void {
    this.dialog.open(ForgotPasswordComponent);
  }

}
