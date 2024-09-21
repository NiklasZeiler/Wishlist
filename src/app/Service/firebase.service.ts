import { inject, Injectable } from '@angular/core';
import { Firestore, addDoc, collection, doc, onSnapshot, updateDoc, setDoc, deleteDoc, CollectionReference } from '@angular/fire/firestore';
import { Wish } from '../interfaces/wish.interface';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { Feedback } from '../interfaces/feedback.interface';
import { AuthService } from './auth.service';
import { getAuth } from "firebase/auth";




@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  wishes: Wish[] = [];
  feedbacks: Feedback[] = [];
  photoUrl: string = ""
  file: any;
  selectedPriority: string = "";


  // unsubWish;
  unsubFeedback;


  firestore: Firestore = inject(Firestore);
  authh = getAuth();

  constructor(private auth: AuthService) {
    // this.unsubWish = this.subWishList();
    this.unsubFeedback = this.subFeedbackList();
    this.auth.user$.subscribe(user => {
      if (user) {
        this.subscribeToUserWishes(user.uid);
      }
    });
  }


  changePicture(event: any) {
    this.file = event.target.files[0];
  }

  //alte funktion ohne user spezifische Liste
  // async addWish(item: Wish) {
  //   if (this.file) {
  //     const storage = getStorage();
  //     let storageRef = ref(storage, `images/${this.file.name}`);

  //     const uploadTaskSnapshot = await uploadBytesResumable(storageRef, this.file);
  //     this.photoUrl = await getDownloadURL(uploadTaskSnapshot.ref);
  //     item.image = this.photoUrl;
  //   }

  //   await addDoc(this.getWishesRef(), item).catch((err) => {
  //     console.error(err);
  //   }).then((docRef) => {
  //     console.log("Document written: ", docRef);
  //   });
  // }

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
    // if (this.unsubWish) {
    //   this.unsubWish();
    // }
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
  //alte funktion ohne user spezifische Liste
  // subWishList() {
  //   return onSnapshot(this.getWishesRef(), (list) => {
  //     this.wishes = [];
  //     list.forEach((item) => {
  //       this.wishes.push(this.setWishObject(item.data(), item.id));
  //     });
  //   })
  // }

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


  //alte funktion ohne user spezifische Liste
  // async updateWish(wish: Wish) {
  //   if (wish.id) {
  //     let docRef = this.getSingleDocRef(this.getColIdFromWish(wish), wish.id)
  //     await updateDoc(docRef, this.getCleanJson(wish))
  //   }
  // }

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
  //alte funktion ohne user spezifische Liste
  // async deleteWish(wish: Wish) {
  //   if (wish.id) {
  //     let docRef = this.getSingleDocRef(this.getColIdFromWish(wish), wish.id)
  //     await deleteDoc(docRef)
  //   }
  // }

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

  // getColIdFromWish(wish: Wish) {
  //   if (wish.type == "wish") {
  //     return "wishes";
  //   } else {
  //     return "wish.type";
  //   }
  // }
  //alte funktion ohne user spezifische Liste
  // getWishesRef() {
  //   return collection(this.firestore, 'wishes');
  // }
  private getWishesRef(userId: string): CollectionReference {
    return collection(this.firestore, `users/${userId}/wishes`);
  }

  getFeedbackRef() {
    return collection(this.firestore, 'feedback');
  }

  setWishObject(obj: any, id: string): Wish {
    return {
      id: id,
      type: obj.type || 'wish',
      wish: obj.wish || "",
      link: obj.link || "",
      image: obj.image || "",
      altText: obj.altText || "",
      priority: obj.priority || "",
      completed: obj.completed || false,
    } as Wish;
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
