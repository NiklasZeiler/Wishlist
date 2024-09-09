import { Injectable, inject } from '@angular/core';
import { Auth, getAuth, signInWithEmailAndPassword, onAuthStateChanged, createUserWithEmailAndPassword, User } from '@angular/fire/auth';
// import {  } from "firebase/auth";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  auth: Auth = inject(Auth)

  constructor() {

  }

  async createUserWithEmailAndPassword(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // Successfully created a new user
        console.log('User created:', userCredential.user);
        return userCredential.user;
      })
      .catch((error) => {
        // Handle errors here
        console.error('Error creating user:', error);
        throw error;
      });
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
