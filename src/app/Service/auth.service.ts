import { Injectable, inject } from '@angular/core';
// import { Auth, getAuth, signInWithEmailAndPassword, onAuthStateChanged, createUserWithEmailAndPassword, User, updateProfile, updateEmail, sendEmailVerification, updatePassword, sendPasswordResetEmail, signOut, setPersistence } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { browserLocalPersistence, getAuth, signInWithEmailAndPassword, onAuthStateChanged, createUserWithEmailAndPassword, fetchSignInMethodsForEmail, User, updateProfile, updateEmail, sendEmailVerification, updatePassword, sendPasswordResetEmail, signOut, setPersistence, signInAnonymously } from 'firebase/auth';
import { ChangePasswordComponent } from '../dialogs/change-password/change-password.component';
import { MatDialog } from '@angular/material/dialog';
import { EmailExistsComponent } from '../dialogs/email-exists/email-exists.component';
import { Router } from '@angular/router';
import { PasswordtoshortComponent } from '../dialogs/passwordtoshort/passwordtoshort.component';
import { Auth } from '@angular/fire/auth';



@Injectable({
  providedIn: 'root'
})
export class AuthService {


  auth: Auth;
  private userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();
  authState: any;
  displayName: any;




  constructor(public dialog: MatDialog, private router: Router) {
    this.auth = inject(Auth);
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    if (storedUser) {
      this.userSubject.next(storedUser);
    }

    onAuthStateChanged(this.auth, (user) => {
      this.userSubject.next(user);
    });
    this.listenToAuthState();
  }

  get authInstance() {
    return this.auth;
  }

  getUsername() {
    this.displayName = this.userSubject.subscribe(user => {
      this.displayName = user?.displayName;
    });

  }

  isLoggedIn(): boolean {
    // Check if user is authenticated
    return !!this.userSubject.value;
  }

  // Method to get the latest user profile info
  private getUserProfil(user: User | null) {
    if (user !== null) {
      const { displayName, email, emailVerified, uid, metadata } = user;
      console.log('User profile:', { displayName, email, emailVerified, uid, metadata });
    }
  }

  async createUser(email: string, password: string, username: string) {
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      this.auth.languageCode = "de"
      const user = userCredential.user;
      // Update user profile to set display name (username)
      await updateProfile(user, { displayName: username });
      await sendEmailVerification(user)
      this.userSubject.next(user);
      console.log('User registered and profile updated:', user);
      console.log('Verification email sent to:', user.email);
      this.router.navigate(['/wishes']);
      return user;
    } catch (error) {
      console.error('Error during registration:', error);
      if (error = "auth/email-already-in-use") {
        this.dialog.open(EmailExistsComponent, {
          width: '350px',
          height: '200px',
          disableClose: true,
        });
        return
      }

      if (error = "auth/weak-password") {
        this.dialog.open(PasswordtoshortComponent, {
          width: '350px',
          height: '200px',
          disableClose: true,
        });
        return
      }
      throw error;
    }
  }

  // Listen for authentication state changes
  listenToAuthState() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.userSubject.next(user); // Update user state
        this.getUserProfil(user); // Fetch and log user info
      } else {
        this.userSubject.next(null); // User signed out
      }
    });

  }

  async signInWithEmail(email: string, password: string) {
    try {
      await setPersistence(this.auth, browserLocalPersistence)
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      this.userSubject.next(user);// Update user state
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    }
    catch (error) {
      // Dialog öffnen das dieser User nicht existiert

      console.error('Error signing in:', error);
      throw error;
    }
  }

  forgotPassword(email: string) {
    sendPasswordResetEmail(this.auth, email).then(() => {
      this.auth.languageCode = "de"
      //Dialog öffnen, das eine Email zum zurücksetzen des Passworts verschickt wurde
      console.log('Password reset email sent to:', email);
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("Error: ", errorCode, errorMessage);

    })
  }

  async updateUserName(name: string) {
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      try {
        await updateProfile(currentUser, { displayName: name });

        this.userSubject.next(currentUser); // Update user state
        console.log('User profile updated:', currentUser);
      } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
      }
    } else {
      console.error('No user signed in.');
      throw new Error('No user signed in.');
    }
  }

  async updateUserEmail(email: string) {
    const currentUser = this.auth.currentUser;
    this.auth.languageCode = "de"

    if (currentUser) {
      try {
        await updateEmail(currentUser, email);
        await sendEmailVerification(currentUser)


        this.userSubject.next(currentUser); // Update user state
        console.log('User profile updated:', currentUser);
        //Dialog öffnen das man die neue Email Adresse verifiziern muss
      } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
      }
    } else {
      console.error('No user signed in.');
      throw new Error('No user signed in.');
    }
  }

  async updateUserPassword(password: string) {
    const currentUser = this.auth.currentUser;
    const newPassword = password;

    if (currentUser) {
      try {
        await updatePassword(currentUser, newPassword);
        console.log('Password updated successfully');
        this.dialog.open(ChangePasswordComponent)
        //Dialog öffnen das man das Passwort erfolgreich geändert hat
      } catch (error) {
        console.error('Error updating password:', error);
        throw error;
      }
    }

  }

  logOut() {
    signOut(this.auth).then(() => {
      this.userSubject.next(null); // Clear user state
      console.log('User signed out');
      localStorage.removeItem('user');
    }).catch(() => {
      console.error('Error signing out');
    });
  }
}
