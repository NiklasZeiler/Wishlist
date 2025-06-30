import { inject, Injectable } from '@angular/core';
import { Firestore, addDoc, collection, doc, onSnapshot, updateDoc, deleteDoc, CollectionReference, getDoc, getDocs, setDoc, serverTimestamp, query, where, writeBatch } from '@angular/fire/firestore';
import { Wish } from '../interfaces/wish.interface';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { Feedback } from '../interfaces/feedback.interface';
import { AuthService } from './auth.service';
import { User } from 'firebase/auth';
import { Email } from '../interfaces/email.interface';
import { BehaviorSubject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { MatDialog } from '@angular/material/dialog';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  wishes: Wish[] = [];
  feedbacks: Feedback[] = [];
  private wishlistsSubject = new BehaviorSubject<any[]>([]);
  wishlists$ = this.wishlistsSubject.asObservable();
  emails: Email[] = [];
  photoUrl: string = ""
  file: any;
  selectedPriority: string = "";
  userName: string | null = "";
  unsubFeedback;


  firestore: Firestore = inject(Firestore);
  currentUser: User | null = null

  private dialog = inject(MatDialog);

  constructor(private auth: AuthService) {
    this.unsubFeedback = this.subFeedbackList();
    this.auth.user$.subscribe(user => {
      this.currentUser = user
      if (user) {
        this.subscribeToUserWishes(user.uid);
        this.userName = user.displayName
      }
    });
  }


  changePicture(event: any) {
    this.file = event.target.files[0];
  }

  async addWish(item: Wish) {
    const user = this.auth.authInstance.currentUser;
    // const user = this.auth.auth.currentUser;
    if (this.file) {
      const storage = getStorage();
      let storageRef = ref(storage, `images/${this.file.name}`);

      const uploadTaskSnapshot = await uploadBytesResumable(storageRef, this.file);
      this.photoUrl = await getDownloadURL(uploadTaskSnapshot.ref);
      item.image = this.photoUrl;
    }
    if (user) {
      await addDoc(this.getWishesRef(user.uid), item);
    }
  }

  async addFeedback(feedback: Feedback) {
    await addDoc(this.getFeedbackRef(), feedback).catch((err) => {
      console.error(err);
    }).then((docRef) => {
      console.log("Document written: ", docRef);
    });
  }

  ngOnDestroy() {
    if (this.unsubFeedback) {
      this.unsubFeedback();
    }
  }

  async generateOrGetShareCode(): Promise<string | null> {
    const user = this.auth.authInstance.currentUser;

    if (!user) {
      console.error("Kein angemeldeter Benutzer.");
      return null;
    }

    try {
      // First check if the user already has a shareCode in the user-specific collection
      const userSharedCodeRef = this.getSharedRef(user.uid);
      const userSharedCodeSnapshot = await getDocs(userSharedCodeRef);

      let shareCode: string;

      if (!userSharedCodeSnapshot.empty) {
        // Use existing code from user's collection
        shareCode = userSharedCodeSnapshot.docs[0].data()["shareCode"];
      } else {
        // Generate a new shareCode
        shareCode = uuidv4();

        // Create a reference to the global shareCodes collection
        const globalShareCodesRef = collection(this.firestore, 'shareCodes');

        // Create the record in both places - globally and in user's collection

        // 1. Create in global collection (for easy lookup)
        await setDoc(doc(globalShareCodesRef, shareCode), {
          userId: user.uid, // Store which user this code belongs to
          owner: user.displayName,
          createdAt: serverTimestamp()
        });

        // 2. Also store in user's collection (for backward compatibility)
        await setDoc(
          doc(userSharedCodeRef),
          {
            shareCode,
            createdAt: serverTimestamp(),
            owner: user.displayName,
            userId: user.uid,
          }
        );
      }

      const wishesRef = collection(this.firestore, `users/${user.uid}/wishes`);
      const wishesSnap = await getDocs(wishesRef);

      const batch = writeBatch(this.firestore);
      wishesSnap.forEach(docSnap => {
        const docRef = doc(this.firestore, `users/${user.uid}/wishes/${docSnap.id}`);
        batch.update(docRef, { public: true });
      });
      await batch.commit();

      // Generate the share link
      const shareLink = `http://wishlist-676f9.web.app/wishes/share?shareCode=${shareCode}`;

      return shareCode;
    } catch (error) {
      console.error("Error in generateOrGetShareCode:", error);
      return null;
    }
  }


  subscribeToSharedWishes(
    shareCode: string,
    callback: (wishes: any[], owner?: string, userId?: string) => void
  ): () => void {
    const shareCodeDoc = doc(this.firestore, 'shareCodes', shareCode);

    let innerUnsubscribe: () => void;

    const outerUnsubscribe = onSnapshot(shareCodeDoc, (shareCodeSnap) => {
      if (!shareCodeSnap.exists()) {
        callback([], undefined);
        return;
      }

      const shareCodeData = shareCodeSnap.data();
      const userId = shareCodeData['userId'];
      const owner = shareCodeData['owner'] || null;

      if (!userId) {
        callback([], undefined);
        return;
      }

      // Falls bereits ein Listener aktiv ist, entfernen:
      if (innerUnsubscribe) innerUnsubscribe();

      const wishesRef = collection(this.firestore, `users/${userId}/wishes`);

      innerUnsubscribe = onSnapshot(wishesRef, (snapshot) => {
        const wishes = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        callback(wishes, owner, userId);
      });
    });

    // Gibt die Funktion zurück, um beide Listener abzubrechen
    return () => {
      if (innerUnsubscribe) innerUnsubscribe();
      outerUnsubscribe();
    };
  }



  // Subscribe to the user's wish list
  subscribeToUserWishes(userId: string) {
    const wishRef = this.getWishesRef(userId);
    return onSnapshot(wishRef, (snapshot) => {
      this.wishes = [];
      snapshot.forEach((doc) => {
        this.wishes.push({ id: doc.id, ...doc.data() } as Wish);
      });
      this.wishlistsSubject.next(this.wishes);
    });
  }

  subFeedbackList() {
    return onSnapshot(this.getFeedbackRef(), (list) => {
      this.feedbacks = [];
      list.forEach((item) => {
        this.feedbacks.push(this.setFeedbackObject(item.data(), item.id));
      });
    })
  }

  setPriority(priority: string) {
    this.selectedPriority = priority;
  }

  async updateWish(userId: any, wish: Wish) {
    if (!userId || !wish.id) {
      console.warn('Update fehlgeschlagen – userId oder wish.id fehlt.');
      return;
    }

    const docRef = doc(this.getWishesRef(userId), wish.id);

    try {
      await updateDoc(docRef, this.getCleanJson(wish));
      console.log("Wunsch erfolgreich aktualisiert");
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Wunschs:", error);
    }
  }

  async updateLikes(feedback: Feedback) {
    if (feedback.id) {
      let docRef = this.getSingleDocRef(this.getColIdFromFeedback(feedback), feedback.id)
      await updateDoc(docRef, {
        likes: feedback.likes + 1
      })
    }
  }

  saveDate(setDate: any) {
    const user = this.auth.authInstance.currentUser; 
    if (user) {
      const userRef = doc(this.firestore, `users/${user.uid}`);
      setDoc(userRef, { savedDate: setDate }, { merge: true })
        .then(() => {
          console.log("Datum erfolgreich gespeichert");
        })
        .catch((error) => {
          console.error("Fehler beim Speichern des Datums:", error);
        });
    } else {
      console.warn("Kein angemeldeter Benutzer zum Speichern des Datums.");
    } 

  }

  async getSavedDate(): Promise<string | null> {
    const user = this.auth.authInstance.currentUser;
    if (user) {
      const userRef = doc(this.firestore, `users/${user.uid}`);
      return getDoc(userRef).then((docSnapshot) => {
        if (docSnapshot.exists()) {
          return docSnapshot.data()?.['savedDate'] || null;
        } else {
          console.warn("Dokument nicht gefunden.");
          return null;
        }
      }).catch((error) => {
        console.error("Fehler beim Abrufen des gespeicherten Datums:", error);
        return null;
      });
    } else {
      console.warn("Kein angemeldeter Benutzer zum Abrufen des gespeicherten Datums.");
      return Promise.resolve(null);
    }
  }

  async deleteOldWishes(setDate: any) {
    const currentDate = setDate
    const user = this.auth.authInstance.currentUser;

    if (user) {
      const wishesRef = this.getWishesRef(user.uid);
      const allWishesQuery = await getDocs(wishesRef)

      for (const doc of allWishesQuery.docs) {
        const wishData = doc.data();
        if (wishData["completed"] === true && wishData["completedAt"] < currentDate) {
          await deleteDoc(doc.ref);
        }
      }
    }
  }


  async deleteWish(wish: Wish) {
    const user = this.auth.authInstance.currentUser;
    if (user && wish.id) {
      const docRef = doc(this.getWishesRef(user.uid), wish.id);
      await deleteDoc(docRef);
    }
  }

  getCleanJson(wish: Wish): {} {
    return {
      type: wish.type,
      wish: wish.wish,
      link: wish.link,
      priority: wish.priority,
      image: wish.image,
      completedAt: wish.completedAt,
      completed: wish.completed,
      owener: wish.owener,
    }
  }

  getCleanFeedbackJson(feedback: Feedback) {
    return {
      type: feedback.type,
      feedback: feedback.feedback,
      likes: feedback.likes,
    }
  }

  getColIdFromWish(wish: Wish) {
    return wish.type === "wish" ? "wishes" : wish.type;
  }

  getColIdFromFeedback(feedback: Feedback) {
    return feedback.type === "feedback" ? "feedback" : feedback.type;
  }
  private getWishesRef(userId: string): CollectionReference {
    return collection(this.firestore, `users/${userId}/wishes`);
  }

  private getFeedbackRef() {
    return collection(this.firestore, 'feedback');
  }

  private getSharedRef(userId: string): CollectionReference {
    return collection(this.firestore, `users/${userId}/sharedCode`)
  }

  setFeedbackObject(obj: any, id: string): Feedback {
    return {
      id: id,
      feedback: obj.feedback || "",
      type: obj.type || "feedback",
      likes: obj.likes || 0,
    } as Feedback
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId)
  }
}
