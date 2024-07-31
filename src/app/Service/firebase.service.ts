import { inject, Injectable } from '@angular/core';
import { Firestore, addDoc, collection, doc, onSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Wish } from '../interfaces/wish.interface';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  wishes: Wish[] = [];

  unsubWish;


  firestore: Firestore = inject(Firestore);


  constructor() {
    this.unsubWish = this.subWishList();
  }

  async addWish(item: {}) {
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
