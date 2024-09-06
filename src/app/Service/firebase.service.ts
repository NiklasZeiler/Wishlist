import { inject, Injectable } from '@angular/core';
import { Firestore, addDoc, collection, doc, onSnapshot, updateDoc, setDoc } from '@angular/fire/firestore';
import { Wish } from '../interfaces/wish.interface';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";



@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  wishes: Wish[] = [];
  photoUrl: string = ""
  file: any;
  selectedPriority: string = "";


  unsubWish;


  firestore: Firestore = inject(Firestore);

  constructor() {
    this.unsubWish = this.subWishList();
  }


  changePicture(event: any) {
    this.file = event.target.files[0];
  }


  async addWish(item: Wish) {
    if (this.file) {
      const storage = getStorage();
      let storageRef = ref(storage, `images/${this.file.name}`);

      const uploadTaskSnapshot = await uploadBytesResumable(storageRef, this.file);
      this.photoUrl = await getDownloadURL(uploadTaskSnapshot.ref);
      item.image = this.photoUrl;
    }

    await addDoc(this.getWishesRef(), item).catch((err) => {
      console.error(err);
    }).then((docRef) => {
      console.log("Document written: ", docRef);
    });
  }

  ngOnDestroy() {
    if (this.unsubWish) {
      this.unsubWish();
    }
  }

  subWishList() {

    return onSnapshot(this.getWishesRef(), (list) => {
      this.wishes = [];
      list.forEach((item) => {
        this.wishes.push(this.setWishObject(item.data(), item.id));
      });
    })
  }

  setPriority(priority: string) {
    this.selectedPriority = priority;
  }

  async updatePriority(wish: Wish) {
    if (wish.id) {
      let docRef = this.getSingleDocRef(this.getColIdFromWish(wish), wish.id)
      await updateDoc(docRef, this.getCleanJson(wish)).catch((err) => {
        console.log(err);
      });
    }
  }

  getCleanJson(wish: Wish): {} {
    return {
      type: wish.type,
      wish: wish.wish,
      link: wish.link,
      priority: wish.priority,
      image: wish.image,
    }
  }

  getColIdFromWish(wish: Wish) {
    return wish.type === "wish" ? "wishes" : wish.type;
  }

  // getColIdFromWish(wish: Wish) {
  //   if (wish.type == "wish") {
  //     return "wishes";
  //   } else {
  //     return "wish.type";
  //   }
  // }

  getWishesRef() {
    return collection(this.firestore, 'wishes');
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
    } as Wish;
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId)
  }
}
