import { Injectable, inject } from '@angular/core';
import { Auth, getAuth, signInWithEmailAndPassword, onAuthStateChanged, createUserWithEmailAndPassword, User, updateProfile, updateEmail, sendEmailVerification } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  auth: Auth = inject(Auth)
  // user = this.auth.currentUser
  // user: User | null = null
  // displayName: string | null = null
  // email: string | null = null
  // emailVerified: boolean | undefined
  // uid: string | undefined
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable(); // Expose as observable to subscribe



  constructor() {
    this.auth = getAuth();
    this.listenToAuthState();
  }

  // Method to get the latest user profile info
  private getUserProfil(user: User | null) {
    if (user !== null) {
      const { displayName, email, emailVerified, uid } = user;
      console.log('User profile:', { displayName, email, emailVerified, uid });
    }
  }

  async createUserWithEmailAndPassword(email: string, password: string, username: string) {
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
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

  async signInWithEmailAndPassword(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      this.userSubject.next(user); // Update user state
      return user;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
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

    if (currentUser) {
      try {
        await updateEmail(currentUser, email);

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

  // onAuthStateChanged(callback: (user: User | null) => void): () => void {
  //   return onAuthStateChanged(this.auth, callback);
  // }
}
