import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  doc,
  increment,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FeedbackEntry } from './wish.model';

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  private readonly firestore = inject(Firestore);

  watchFeedback(): Observable<FeedbackEntry[]> {
    return new Observable<FeedbackEntry[]>((subscriber) =>
      onSnapshot(
        query(collection(this.firestore, 'feedback'), orderBy('timestamp', 'desc')),
        (snapshot) =>
          subscriber.next(
            snapshot.docs.map((document) => ({
              id: document.id,
              feedback: (document.data()['feedback'] as string) ?? '',
              likes: (document.data()['likes'] as number) ?? 0,
            })),
          ),
        (error) => subscriber.error(error),
      ),
    );
  }

  async addFeedback(text: string): Promise<void> {
    await addDoc(collection(this.firestore, 'feedback'), {
      feedback: text,
      timestamp: serverTimestamp(),
      likes: 0,
    });
  }

  async like(feedbackId: string): Promise<void> {
    await updateDoc(doc(this.firestore, 'feedback', feedbackId), { likes: increment(1) });
  }
}
