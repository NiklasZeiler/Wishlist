import { Injectable, inject } from '@angular/core';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { updatePassword, updateProfile, verifyBeforeUpdateEmail } from '@angular/fire/auth';
import { AuthService } from './auth.service';

/** Profile data and account changes of the signed-in user. */
@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly firestore = inject(Firestore);
  private readonly auth = inject(AuthService);

  /** Event date in the format `dd.mm.yyyy`, or an empty string when none is saved. */
  async getSavedDate(): Promise<string> {
    const user = this.auth.requireUser();
    const snapshot = await getDoc(this.userDoc(user.uid));
    return (snapshot.data()?.['savedDate'] as string | undefined) ?? '';
  }

  async saveDate(date: string): Promise<void> {
    const user = this.auth.requireUser();
    await setDoc(this.userDoc(user.uid), { savedDate: date }, { merge: true });
  }

  async updateName(name: string): Promise<void> {
    const user = this.auth.requireUser();
    await setDoc(this.userDoc(user.uid), { displayName: name }, { merge: true });
    await updateProfile(user, { displayName: name });
    this.auth.refreshSession();
  }

  async updateEmail(email: string): Promise<void> {
    const user = this.auth.requireUser();
    await setDoc(this.userDoc(user.uid), { email }, { merge: true });
    await verifyBeforeUpdateEmail(user, email);
  }

  async updatePassword(password: string): Promise<void> {
    await updatePassword(this.auth.requireUser(), password);
  }

  private userDoc(uid: string) {
    return doc(this.firestore, `users/${uid}`);
  }
}
