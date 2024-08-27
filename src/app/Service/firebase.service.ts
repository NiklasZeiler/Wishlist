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

  prioDocRef = doc(this.firestore, "wishes", "priority")


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
    this.unsubWish();
  }

  subWishList() {
    this.wishes = [];
    return onSnapshot(this.getWishesRef(), (list) => {
      list.forEach((item) => {
        this.wishes.push(this.setWishObject(item.data(), item.id));
      });
    })
  }

  setPriority(priority: string) {
    this.selectedPriority = priority;
  }

  async updatePriority() {
    await updateDoc(this.prioDocRef, {
      "priority": this.selectedPriority,
    })
  }

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
}
