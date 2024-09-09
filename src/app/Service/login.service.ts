import { Injectable, inject } from '@angular/core';
import { Auth, getAuth, signInWithEmailAndPassword, onAuthStateChanged, createUserWithEmailAndPassword, User, updateProfile } from '@angular/fire/auth';
// import {  } from "firebase/auth";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  auth: Auth = inject(Auth)

  constructor() {

  }

  // async createUserWithEmailAndPassword(email: string, password: string, username:string) {
  //   return createUserWithEmailAndPassword(this.auth, email, password)
  //     .then((userCredential) => {
  //       // Successfully created a new user
  //       console.log('User created:', userCredential.user);
  //       return userCredential.user;
  //     })
  //     .catch((error) => {
  //       // Handle errors here
  //       console.error('Error creating user:', error);
  //       throw error;
  //     });
  // }

  async createUserWithEmailAndPassword(email: string, password: string, username: string) {
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      // Update user profile to set display name (username)
      await updateProfile(user, { displayName: username });
      console.log('User registered and profile updated:', user);
      return user;
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  }

  // async signInWithEmailAndPassword(email: string, password: string) {
  //   return signInWithEmailAndPassword(this.auth, email, password)
  //     .then((userCredential: any) => {
  //       // Signed in
  //       const user = userCredential.user;
  //       //...
  //       return user;
  //     })
  //     .catch((error) => {
  //       // Handle errors here
  //       console.error('Error signing in:', error);
  //       throw error;
  //     });
  // }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(this.auth, callback);
  }
}
