import { inject, Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  items$;
  firestore: Firestore = inject(Firestore);

  constructor() {
    this.items$ = collectionData(this.getWishesRef());
  }

  getWishesRef() {
    return collection(this.firestore, 'wishes');
  }

  getImagesRef() {
    return collection(this.firestore, 'images');
  }

  getLinksRef() {
    return collection(this.firestore, 'links');
  }
}
