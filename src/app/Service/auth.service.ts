import { Injectable, inject } from '@angular/core';
// import { Auth, getAuth, signInWithEmailAndPassword, onAuthStateChanged, createUserWithEmailAndPassword, User, updateProfile, updateEmail, sendEmailVerification, updatePassword, sendPasswordResetEmail, signOut, setPersistence } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { browserLocalPersistence, getAuth, signInWithEmailAndPassword, onAuthStateChanged, createUserWithEmailAndPassword, fetchSignInMethodsForEmail, User, updateProfile, updateEmail, sendEmailVerification, updatePassword, sendPasswordResetEmail, signOut, setPersistence } from 'firebase/auth';
import { Auth } from '@angular/fire/auth';
import { ChangePasswordComponent } from '../dialogs/change-password/change-password.component';
import { MatDialog } from '@angular/material/dialog';
import { EmailExistsComponent } from '../dialogs/email-exists/email-exists.component';
import { environment } from '../../environments/environments';
import { initializeApp } from 'firebase/app';


@Injectable({
  providedIn: 'root'
})
export class AuthService {


  auth: Auth = inject(Auth)
  public userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable(); // Expose as observable to subscribe




  constructor(public dialog: MatDialog) {

    this.auth = getAuth();
    this.listenToAuthState();
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
      return user;
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
    // }



    // ) {
    //   console.error('Error during registration:', error);
    //   throw error;
    // }
    // }

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

  async checkIfEmailExists(email: string) {
    // TO DO: Neue Sammlung für emails erstellen im firebase service
    // - Email addressen die benutzt werden in der Sammlung speichern
    // - Diese Sammlung überprüfen ob die angegebene Email bereits verwendet wird
    // - Wenn ja, return true, ansonsten false
    // return false; // Placeholder for actual implementation
  }

  async signInWithEmail(email: string, password: string) {
    try {
      await setPersistence(this.auth, browserLocalPersistence)
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      this.userSubject.next(user); // Update user state
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
    }).catch(() => {
      console.error('Error signing out');
    });
  }
}
