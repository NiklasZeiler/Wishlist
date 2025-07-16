import { Component, Input } from '@angular/core';
import { Wish } from '../interfaces/wish.interface';
import { FirebaseService } from '../Service/firebase.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { HelperService } from '../Service/helper.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmWishComponent } from '../dialogs/confirm-wish/confirm-wish.component';

@Component({
  selector: 'app-view-wishes',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './view-wishes.component.html',
  styleUrl: './view-wishes.component.scss'
})
export class ViewWishesComponent {
  @Input() wish!: Wish

  noWishes: boolean = false;
  wishId: string = "";
  userName: any = ""
  wishes: any = []
  errorMessage: string | null = null;
  userIdFromShareCode: string = '';

  constructor(private firebase: FirebaseService, public dialog: MatDialog, public help: HelperService, private route: ActivatedRoute) {


  }

  private unsubscribeFn?: () => void; // zum Aufräumen später

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const shareCode = params['shareCode'];

      if (shareCode) {
        this.unsubscribeFn = this.firebase.subscribeToSharedWishes(
          shareCode,
          (wishes, owner, userId) => {
            this.wishes = wishes;
            this.userName = owner || 'Unbekannter Benutzer';
            this.userIdFromShareCode = userId ?? '';

            if (!wishes || wishes.length === 0) {
              this.errorMessage = 'Keine Wünsche gefunden.';
              this.noWishes = true;
            } else {
              this.errorMessage = '';
              this.noWishes = false;
            }
          }
        );
      } else {
        this.errorMessage = 'Kein Teilen-Code gefunden.';
      }
    });
  }


  ngOnDestroy(): void {
    if (this.unsubscribeFn) {
      this.unsubscribeFn();
    }
  }


  trackByWishId(wish: any): string {
    return wish.id;
  }

  wishDone(wish: Wish) {
    console.log("Dialog öffnen");

    this.dialog.open(ConfirmWishComponent, {
      width: '500px',
      disableClose: true,

    })
      .afterClosed().subscribe(result => {
        if (result === 'confirm') {
          wish.completed = true
          wish.completedAt = new Date()
          this.firebase.updateWish(this.userIdFromShareCode, wish)
        } else if (result === 'cancel') {
          wish.completed = false;
          wish.completedAt = null;
          this.firebase.updateWish(this.userIdFromShareCode, wish);
        }
      });

  }



  getPriorityStyle(priority: string): any {
    switch (priority) {
      case 'Hoch':
        return { color: 'red' };
      case 'Mittel':
        return { color: 'yellow' };
      case 'Niedrig':
        return { color: '#32CD32' };
      default:
        return {};
    }
  }


}
