import { inject, Injectable } from '@angular/core';
import { Firestore, addDoc, collection, doc, onSnapshot, updateDoc, deleteDoc, CollectionReference, getDoc, getDocs, setDoc, serverTimestamp, query, where } from '@angular/fire/firestore';
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

  // Alternative simplified version without a custom dialog component
  // Add this to your FirebaseService

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
            owner: user.displayName
          }
        );
      }

      // Generate the share link
      const shareLink = `http://wishlist-676f9.web.app/wishes/share?shareCode=${shareCode}`;

      return shareCode;
    } catch (error) {
      console.error("Error in generateOrGetShareCode:", error);
      return null;
    }
  }



  // async getWishesByShareCode(shareCode: string): Promise<{ owner?: string, wishes: any[] | null }> {
  //   // Look up the shareCode in the global collection first
  //   const shareCodeDoc = doc(this.firestore, 'shareCodes', shareCode);


  //   const shareCodeSnap = await getDoc(shareCodeDoc);


  //   if (!shareCodeSnap.exists()) {
  //     console.error('Kein Share-Code gefunden.');

  //     // DEBUGGING: Check if the shareCodes collection exists at all
  //     try {
  //       const allShareCodes = await getDocs(collection(this.firestore, 'shareCodes'));

  //       allShareCodes.forEach(doc => {
  //         ;
  //       });
  //     } catch (err) {
  //       console.error("Error listing all shareCodes:", err);
  //     }

  //     // DEBUGGING: Check the older method (user-specific collection)
  //     try {
  //       const usersCollection = collection(this.firestore, 'users');
  //       const userQuery = query(usersCollection);
  //       const userSnapshot = await getDocs(userQuery);

  //       for (const userDoc of userSnapshot.docs) {

  //         const sharedCodeQuery = query(
  //           collection(this.firestore, `users/${userDoc.id}/sharedCode`)
  //         );

  //         const sharedCodeSnapshot = await getDocs(sharedCodeQuery);
  //         sharedCodeSnapshot.forEach(doc => {

  //           if (doc.data()['shareCode'] === shareCode) {
  //             console.log("MATCH FOUND in user collection!");
  //           }
  //         });
  //       }
  //     } catch (err) {
  //       console.error("Error with fallback method:", err);
  //     }

  //     return { owner: undefined, wishes: [] };
  //   }

  //   // Get the userId associated with this shareCode
  //   const shareCodeData = shareCodeSnap.data();
  //   const userId = shareCodeData['userId'];
  //   const owner = shareCodeData['owner'] || null;

  //   if (!userId) {
  //     console.error('Share-Code enthält keine UserId.');
  //     return { owner: undefined, wishes: [] };
  //   }

  //   // Now fetch wishes directly with the userId
  //   const wishesCollection = collection(this.firestore, `users/${userId}/wishes`);
  //   const wishesSnapshot = await getDocs(wishesCollection);

  //   const wishes = wishesSnapshot.docs.map(doc => ({
  //     id: doc.id,
  //     ...doc.data()
  //   }));

  //   return {
  //     owner: owner,
  //     wishes
  //   };
  // }


  subscribeToSharedWishes(
    shareCode: string,
    callback: (wishes: any[], owner?: string) => void
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
        callback(wishes, owner);
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
