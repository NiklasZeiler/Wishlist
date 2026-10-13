import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { describeError } from '../../core/auth.service';
import { FeedbackService } from '../../core/feedback.service';
import { NotifierService } from '../../core/notifier.service';
import { FeedbackEntry } from '../../core/wish.model';
import { MainLayoutComponent } from '../../shared/main-layout/main-layout.component';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [FormsModule, MainLayoutComponent, MatIconModule],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss',
})
export class FeedbackComponent {
  private readonly feedbackService = inject(FeedbackService);
  private readonly notifier = inject(NotifierService);

  protected readonly text = signal('');
  protected readonly entries = signal<FeedbackEntry[] | null>(null);
  protected readonly loadFailed = signal(false);

  constructor() {
    this.feedbackService
      .watchFeedback()
      .pipe(takeUntilDestroyed(inject(DestroyRef)))
      .subscribe({
        next: (entries) => this.entries.set(entries),
        error: () => this.loadFailed.set(true),
      });
  }

  protected async send(): Promise<void> {
    const feedback = this.text().trim();
    if (!feedback) {
      this.notifier.error('Bitte gib ein Feedback ein');
      return;
    }

    try {
      await this.feedbackService.addFeedback(feedback);
      this.text.set('');
      this.notifier.success('Feedback erfolgreich gesendet!');
    } catch (error) {
      this.notifier.error(`Fehler: ${describeError(error)}`);
    }
  }

  protected async like(entry: FeedbackEntry): Promise<void> {
    try {
      await this.feedbackService.like(entry.id);
    } catch (error) {
      this.notifier.error(`Fehler: ${describeError(error)}`);
    }
  }
}
