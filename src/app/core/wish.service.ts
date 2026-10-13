import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  addDoc,
  deleteDoc,
  where,
  writeBatch,
} from '@angular/fire/firestore';
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from './auth.service';
import { NewWish, Wish, normalizePriority } from './wish.model';

const ALLOWED_IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg'];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

@Injectable({ providedIn: 'root' })
export class WishService {
  private readonly firestore = inject(Firestore);
  private readonly auth = inject(AuthService);
  private readonly storage = getStorage();

  /** Live list of the signed-in user's wishes. */
  watchOwnWishes(): Observable<Wish[]> {
    return new Observable<Wish[]>((subscriber) => {
      const user = this.auth.user();
      if (!user) {
        subscriber.next([]);
        return undefined;
      }

      void this.deleteExpiredWishes();

      return onSnapshot(
        collection(this.firestore, `users/${user.uid}/wishes`),
        async (snapshot) => {
          const wishes = await Promise.all(
            snapshot.docs.map(async (document) =>
              this.toWish(document.id, document.data(), await this.resolveImageUrl(document.data()['image'])),
            ),
          );
          subscriber.next(wishes);
        },
        (error) => subscriber.error(error),
      );
    });
  }

  /** Live list of the public, not yet completed wishes of another user. */
  watchSharedWishes(ownerId: string): Observable<Wish[]> {
    return new Observable<Wish[]>((subscriber) =>
      onSnapshot(
        query(
          collection(this.firestore, `users/${ownerId}/wishes`),
          where('public', '==', true),
          where('completed', '==', false),
        ),
        (snapshot) =>
          subscriber.next(
            snapshot.docs.map((document) => {
              const image = document.data()['image'];
              return this.toWish(document.id, document.data(), typeof image === 'string' ? image : '');
            }),
          ),
        (error) => subscriber.error(error),
      ),
    );
  }

  async addWish(input: NewWish, imageFile: File | null): Promise<void> {
    const user = this.auth.requireUser();

    let imageUrl: string | null = null;
    if (imageFile) {
      imageUrl = await this.uploadImage(user.uid, imageFile);
    }

    await addDoc(collection(this.firestore, `users/${user.uid}/wishes`), {
      userId: user.uid,
      wish: input.wish,
      description: input.description,
      link: input.link || null,
      image: imageUrl,
      priority: input.priority,
      createdAt: serverTimestamp(),
      completed: false,
      public: true,
      owener: user.displayName ?? '',
    });
  }

  async deleteWish(wish: Wish): Promise<void> {
    const user = this.auth.requireUser();
    await this.deleteImage(wish.image);
    await deleteDoc(doc(this.firestore, `users/${user.uid}/wishes/${wish.id}`));
  }

  async updatePriority(wishId: string, priority: string): Promise<void> {
    const user = this.auth.requireUser();
    await updateDoc(doc(this.firestore, `users/${user.uid}/wishes/${wishId}`), {
      priority: normalizePriority(priority),
    });
  }

  /** Marks a wish as done. `ownerId` is the list owner, who is not the signed-in user on shared lists. */
  async markAsComplete(wishId: string, ownerId: string): Promise<void> {
    this.auth.requireUser();
    await updateDoc(doc(this.firestore, `users/${ownerId}/wishes/${wishId}`), {
      completed: true,
      completedAt: serverTimestamp(),
    });
  }

  /** Returns the existing share code of the signed-in user or creates one, and publishes all wishes. */
  async generateOrGetShareCode(): Promise<string | null> {
    const user = this.auth.user();
    if (!user) {
      return null;
    }

    try {
      const ownCodes = collection(this.firestore, `users/${user.uid}/sharedCode`);
      const existing = await getDocs(query(ownCodes, limit(1)));

      let shareCode: string;
      if (!existing.empty) {
        shareCode = existing.docs[0].data()['shareCode'] as string;
      } else {
        shareCode = uuidv4();
        const owner = user.displayName || 'Unbekannt';
        await setDoc(doc(this.firestore, 'shareCodes', shareCode), {
          userId: user.uid,
          owner,
          createdAt: serverTimestamp(),
        });
        await addDoc(ownCodes, { shareCode, createdAt: serverTimestamp(), owner, userId: user.uid });
      }

      const wishes = await getDocs(collection(this.firestore, `users/${user.uid}/wishes`));
      const batch = writeBatch(this.firestore);
      wishes.forEach((wish) => batch.update(wish.ref, { public: true }));
      await batch.commit();

      return shareCode;
    } catch {
      return null;
    }
  }

  async getOwnerIdFromShareCode(code: string): Promise<string | null> {
    const snapshot = await getDoc(doc(this.firestore, 'shareCodes', code));
    return snapshot.exists() ? ((snapshot.data()['userId'] as string | undefined) ?? null) : null;
  }

  /** Removes completed wishes (and their images) once the saved event date has passed. */
  private async deleteExpiredWishes(): Promise<void> {
    const user = this.auth.user();
    if (!user) {
      return;
    }

    const userDoc = await getDoc(doc(this.firestore, `users/${user.uid}`));
    const eventDate = this.parseGermanDate(userDoc.data()?.['savedDate']);
    if (!eventDate || eventDate >= new Date()) {
      return;
    }

    const completed = await getDocs(
      query(collection(this.firestore, `users/${user.uid}/wishes`), where('completed', '==', true)),
    );
    for (const wish of completed.docs) {
      await this.deleteImage(wish.data()['image']);
      await deleteDoc(wish.ref);
    }
  }

  private parseGermanDate(value: unknown): Date | null {
    if (typeof value !== 'string') {
      return null;
    }
    const [day, month, year] = value.split('.').map(Number);
    if (!day || !month || !year) {
      return null;
    }
    return new Date(year, month - 1, day);
  }

  private async uploadImage(uid: string, file: File): Promise<string> {
    const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
    if (!ALLOWED_IMAGE_EXTENSIONS.includes(extension)) {
      throw new Error('Nur Bilder im Format PNG, JPG oder JPEG sind erlaubt');
    }
    if (file.size >= MAX_IMAGE_BYTES) {
      throw new Error('Das Bild darf höchstens 5 MB groß sein');
    }

    const imageRef = ref(this.storage, `users/${uid}/wishes/${Date.now()}_${file.name}`);
    await uploadBytes(imageRef, file, { contentType: file.type });
    return getDownloadURL(imageRef);
  }

  private async deleteImage(value: unknown): Promise<void> {
    if (typeof value !== 'string' || !value) {
      return;
    }
    try {
      await deleteObject(ref(this.storage, value));
    } catch {
      // Best effort: the object may already be gone or not belong to the user.
    }
  }

  /** Wishes created by older versions stored a storage path instead of a download URL. */
  private async resolveImageUrl(value: unknown): Promise<string> {
    if (typeof value !== 'string' || !value) {
      return '';
    }
    if (value.startsWith('https://')) {
      return value;
    }
    try {
      return await getDownloadURL(ref(this.storage, value));
    } catch {
      return '';
    }
  }

  private toWish(id: string, data: Record<string, unknown>, image: string): Wish {
    return {
      id,
      wish: (data['wish'] as string) ?? '',
      description: (data['description'] as string) ?? '',
      priority: normalizePriority(data['priority']),
      link: (data['link'] as string) ?? '',
      image,
      completed: (data['completed'] as boolean) ?? false,
      public: (data['public'] as boolean) ?? true,
      owener: (data['owener'] as string) ?? '',
    };
  }
}
