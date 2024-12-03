import { inject, Injectable } from '@angular/core';
import { Firestore, addDoc, collection, doc, onSnapshot, updateDoc, deleteDoc, CollectionReference, getDocs, setDoc, serverTimestamp, query, where } from '@angular/fire/firestore';
import { Wish } from '../interfaces/wish.interface';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { Feedback } from '../interfaces/feedback.interface';
import { AuthService } from './auth.service';
import { User } from 'firebase/auth';
import { Email } from '../interfaces/email.interface';
import { BehaviorSubject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';


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

    const sharedCodeRef = this.getSharedRef(user.uid);

    // Prüfe, ob bereits ein `shareCode` existiert
    const sharedCodeSnapshot = await getDocs(sharedCodeRef);

    if (!sharedCodeSnapshot.empty) {
      // Verwende den bestehenden `shareCode`
      const existingCode = sharedCodeSnapshot.docs[0].data()["shareCode"];
      console.log("Bestehender Teilungs-Link:", `http://localhost:4200/wishes/share?shareCode=${existingCode}`);
      return existingCode;
    }

    // Generiere einen neuen `shareCode`, wenn keiner existiert
    const newSharedCodeRef = doc(sharedCodeRef);
    const shareCode = uuidv4();

    // `serverTimestamp()` korrekt verwenden
    await setDoc(newSharedCodeRef, { shareCode, createdAt: serverTimestamp() });

    console.log("Neuer Teilungs-Link:", `http://localhost:4200/wishes/share?shareCode=${shareCode}`);
    return shareCode;
  }



  async getWishesByShareCode(shareCode: string): Promise<any[] | null> {

    const usersCollection = collection(this.firestore, 'users');
    const userQuery = query(usersCollection);
    const userSnapshot = await getDocs(userQuery);

    let userId: string | null = null;

    for (const userDoc of userSnapshot.docs) {
      const sharedCodeQuery = query(
        collection(this.firestore, `users/${userDoc.id}/sharedCode`),
        where('shareCode', '==', shareCode)
      );

      const sharedCodeSnapshot = await getDocs(sharedCodeQuery);
      if (!sharedCodeSnapshot.empty) {
        userId = userDoc.id;
        break;
      }
    }

    if (!userId) {
      console.error('Kein Benutzer mit diesem Share-Code gefunden.');
      return null;
    }

    // Wünsche abrufen
    const wishesCollection = collection(this.firestore, `users/${userId}/wishes`);
    const wishesSnapshot = await getDocs(wishesCollection);

    return wishesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  // Subscribe to the user's wish list
  subscribeToUserWishes(userId: string) {
    const wishRef = this.getWishesRef(userId);
    return onSnapshot(wishRef, (snapshot) => {
      this.wishes = [];
      snapshot.forEach((doc) => {
        this.wishes.push({ id: doc.id, ...doc.data() } as Wish);
      });
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

  async updateWish(wish: Wish) {
    const user = this.auth.authInstance.currentUser;

    if (user && wish.id) {
      const docRef = doc(this.getWishesRef(user.uid), wish.id);
      await updateDoc(docRef, this.getCleanJson(wish));
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
