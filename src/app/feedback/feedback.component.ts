import { Component, Input } from '@angular/core';
import { Feedback } from '../interfaces/feedback.interface';
import { FirebaseService } from '../Service/firebase.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss'
})
export class FeedbackComponent {

  @Input() feedback!: Feedback

  constructor(private firebase: FirebaseService) {

  }

  likes = 0;
  text: string = "";

  ngOnInit() {
    this.getFeedback()
  }

  addFeedback() {
    const feedBack: Feedback = {
      feedback: this.text,
      type: "feedback",
      likes: 0
    };
    this.firebase.addFeedback(feedBack);
    this.text = "";
  }

  getFeedback() {
    return this.firebase.feedbacks;
  }

  count(feedback: Feedback) {
    this.firebase.updateLikes(feedback).then(() => {
      let count = document.getElementById(`conter-${feedback.id}`) as HTMLElement;
      if (count) {
        count.innerHTML = feedback.likes.toString();
      }
    }).catch(err => {
      console.error('Error updating likes in Firestore:', err);
    });
  }

}
