import { inject, Injectable } from '@angular/core';
import { Firestore, addDoc, collection, doc, onSnapshot, updateDoc, setDoc, deleteDoc, CollectionReference, getDocs, query, where } from '@angular/fire/firestore';
import { Wish } from '../interfaces/wish.interface';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { Feedback } from '../interfaces/feedback.interface';
import { AuthService } from './auth.service';
import { User } from 'firebase/auth';





@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  wishes: Wish[] = [];
  feedbacks: Feedback[] = [];
  photoUrl: string = ""
  file: any;
  selectedPriority: string = "";

  unsubFeedback;

  firestore: Firestore = inject(Firestore);
  currentUser: User | null = null

  constructor(private auth: AuthService) {
    this.unsubFeedback = this.subFeedbackList();
    this.auth.user$.subscribe(user => {
      this.currentUser = user
      if (user) {
        this.subscribeToUserWishes(user.uid);
      }
    });
  }


  changePicture(event: any) {
    this.file = event.target.files[0];
  }

  async addWish(item: Wish) {
    const user = this.auth.auth.currentUser;
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
    const user = this.auth.auth.currentUser;

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
    const user = this.auth.auth.currentUser

    if (user) {
      const wishesRef = this.getWishesRef(user.uid);
      const allWishesQuery = await getDocs(wishesRef);
      console.log('Total wishes found:', allWishesQuery.size);
      for (const doc of allWishesQuery.docs) {
        const wishData = doc.data();
        // Check if the wish is complete and completedAt is in the past
        if (wishData['completed'] === true && wishData['completedAt'] < currentDate) {
          console.log('Deleting wish ID:', doc.id); // Log the wish ID
          await deleteDoc(doc.ref); // Delete the document
        }
      }
    }
  }


  async deleteWish(wish: Wish) {
    const user = this.auth.auth.currentUser;
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

  getFeedbackRef() {
    return collection(this.firestore, 'feedback');
  }

  // setWishObject(obj: any, id: string): Wish {
  //   return {
  //     id: id,
  //     type: obj.type || 'wish',
  //     wish: obj.wish || "",
  //     link: obj.link || "",
  //     image: obj.image || "",
  //     altText: obj.altText || "",
  //     priority: obj.priority || "",
  //     completedAt: obj.completedAt || null,
  //   } as Wish;
  // }

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
