import { inject, Injectable } from '@angular/core';
import { Firestore, addDoc, collection, doc, onSnapshot, setDoc, getFirestore } from '@angular/fire/firestore';
import { Wish } from '../interfaces/wish.interface';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";



@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  wishes: Wish[] = [];
  photoUrl: string = ""
  file: any;


  unsubWish;


  firestore: Firestore = inject(Firestore);


  constructor() {
    this.unsubWish = this.subWishList();
  }


  changePicture(event: any) {
    this.file = event.target.files[0];
    // const storageRef = ref(getStorage(), `wishes/${file.name}`);
    // const uploadTask = uploadBytesResumable(storageRef, file);
  }

  // async updateFirestore(documentUrl: string) {
  //   const db = getFirestore();
  //   let docRef = doc(db, "wishes")

  //   await setDoc(docRef, {
  //     wishes: this.wishes
  //   }).catch((error) => {
  //     console.error("Error writing document: ", error);
  //   });
  // }


  // async addWish(item: Wish) {
  //   this.photoUrl = "";
  //   if (this.file) {
  //     const storage = getStorage();
  //     let storageRef = ref(storage, `images/${this.file.name}`);
  //     uploadBytesResumable(storageRef, this.file, this.file).then(
  //       () => {
  //         getDownloadURL(storageRef).then((imageUrl) => {
  //           this.photoUrl = imageUrl;
  //         })
  //       }
  //     )
  //     // this.updateFirestore(this.photoUrl)
  //   }
  //   await addDoc(this.getWishesRef(), item).catch((err) => {
  //     console.error(err);
  //   }).then((docRef) => {
  //     console.log("Document written: ", docRef);
  //   });
  // }

  async addWish(item: Wish) {
    if (this.file) {
      const storage = getStorage();
      let storageRef = ref(storage, `images/${this.file.name}`);

      // Upload file and get download URL
      const uploadTaskSnapshot = await uploadBytesResumable(storageRef, this.file);
      this.photoUrl = await getDownloadURL(uploadTaskSnapshot.ref);

      // Add the photo URL to the item
      item.image = this.photoUrl;
    }

    // Save the wish with the image URL
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
