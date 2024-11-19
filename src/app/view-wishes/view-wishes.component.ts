import { Component, Input } from '@angular/core';
import { Wish } from '../interfaces/wish.interface';
import { FirebaseService } from '../Service/firebase.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { HelperService } from '../Service/helper.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../Service/auth.service';
import { User } from 'firebase/auth';

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
  constructor(private firebase: FirebaseService, private auth: AuthService, public dialog: MatDialog, public help: HelperService, private route: ActivatedRoute) {

  }

  ngOnInit() {
    // Abrufen des `shareCode` aus der URL
    const shareCode = this.route.snapshot.paramMap.get('shareCode');

    if (shareCode) {
      // Lade Wünsche basierend auf `shareCode`
      this.firebase.loadSharedWishListByShareCode(shareCode)
        .then(wishes => {
          if (wishes) {
            this.wishes = wishes;
          } else {
            this.errorMessage = 'Ungültiger Teilungslink oder keine Wunschliste gefunden.';
          }
        })
        .catch(err => {
          console.error(err);
          this.errorMessage = 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.';
        });
    } else {
      this.errorMessage = 'Ungültige URL. Teilungscode fehlt.';
    }
  }

  // // this.help.checkRoute()
  // this.firebase.wishlists$.subscribe(wishlists => {
  //   this.wishes = wishlists;
  // });
  // // this.auth.createAnonymosUser()
  // this.getUserName()
  // }

  getUserName() {
    console.log(this.wishes);


  }

  trackByWishId(wish: any): string {
    return wish.id;
  }

  wishDone(wish: Wish) {
    wish.completed = true
    wish.completedAt = new Date()
    this.firebase.updateWish(wish)
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
