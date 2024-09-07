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
  }

  getFeedback() {
    return this.firebase.feedbacks;
  }

  count() {
    let count = document.getElementById("counter") as HTMLElement;
    this.likes = this.likes + 1
    count.innerHTML = this.likes.toString();
  }

}
