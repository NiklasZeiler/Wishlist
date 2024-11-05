import { inject, Injectable } from '@angular/core';
import { Firestore, addDoc, collection, doc, onSnapshot, updateDoc, setDoc, deleteDoc, CollectionReference, getDocs, query, where } from '@angular/fire/firestore';
import { Wish } from '../interfaces/wish.interface';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { Feedback } from '../interfaces/feedback.interface';
import { AuthService } from './auth.service';
import { User } from 'firebase/auth';
import { Email } from '../interfaces/email.interface';
import { Wishlist } from '../interfaces/wishlist.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  wishes: Wish[] = [];
  feedbacks: Feedback[] = [];
  // wishlists: Wishlist[] = [];
  private wishlistsSubject = new BehaviorSubject<any[]>([]);
  wishlists$ = this.wishlistsSubject.asObservable();
  emails: Email[] = [];
  photoUrl: string = ""
  file: any;
  selectedPriority: string = "";
  userName: string | null = "";

  unsubFeedback;
  // unsubWishlist;

  firestore: Firestore = inject(Firestore);
  currentUser: User | null = null

  constructor(private auth: AuthService) {
    this.unsubFeedback = this.subFeedbackList();
    // this.unsubWishlist = this.subSharedWishlist();
    this.auth.user$.subscribe(user => {
      this.currentUser = user
      if (user) {
        this.subscribeToUserWishes(user.uid);
        this.loadWishlists(user.uid)
        this.userName = user.displayName
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

  async addWishlist(item: Wishlist) {
    console.log(item);
    const user = this.auth.auth.currentUser;
    if (user) {
      item.displayName = user.displayName;
      if (this.file) {
        const storage = getStorage();
        let storageRef = ref(storage, `images/${this.file.name}`);

        const uploadTaskSnapshot = await uploadBytesResumable(storageRef, this.file);
        this.photoUrl = await getDownloadURL(uploadTaskSnapshot.ref);
        item.wishes.forEach(element => {
          element.image = this.photoUrl;
        });

      }

      await addDoc(this.getSharedWishlistRef(user.uid), item);
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
    // if (this.unsubWishlist) {
    //   this.unsubWishlist();
    // }
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

  // subSharedWishlist() {
  //   return onSnapshot(this.getSharedWishlistRef(), (list) => {
  //     this.wishlists = []
  //     list.forEach((item) => {
  //       this.wishlists.push(this.setWishlistsObject(item.data(), item.id));
  //     });
  //   })
  // }

  loadWishlists(userId: string) {
    onSnapshot(this.getSharedWishlistRef(userId), (snapshot) => {
      const wishlists = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      this.wishlistsSubject.next(wishlists);
    });
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

  async updateWishlist(wishlist: Wishlist) {

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

  getColIdFromWishlists(wishlists: Wishlist) {
    return wishlists.type === "shared" ? "wishlists" : wishlists.type;
  }
  private getWishesRef(userId: string): CollectionReference {
    return collection(this.firestore, `users/${userId}/wishes`);
  }

  private getFeedbackRef() {
    return collection(this.firestore, 'feedback');
  }

  private getSharedWishlistRef(userId: string) {
    return collection(this.firestore, `wishlists/${userId}/wishes`);
  }

  setFeedbackObject(obj: any, id: string): Feedback {
    return {
      id: id,
      feedback: obj.feedback || "",
      type: obj.type || "feedback",
      likes: obj.likes || 0,
    } as Feedback
  }


  setWishlistsObject(obj: any, id: string): Wishlist {
    return {
      id: id,
      name: obj.name || "",
      type: obj.type || "shared",
      displayName: obj.displayName || null,
      wishes: obj.wishes?.map((wish: any) => ({
        wishName: wish.wishName || "",
        link: wish.link || "",
        image: wish.image || "",
        priority: wish.priority || "low",
        completedAt: wish.completedAt || null,
        completed: wish.completed || false,
      })) || [],
    } as Wishlist
  }


  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId)
  }
}
