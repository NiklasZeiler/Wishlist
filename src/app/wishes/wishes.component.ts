import { Component, Input, OnInit } from '@angular/core';
import { FirebaseService } from '../Service/firebase.service';
import { CommonModule } from '@angular/common';
import { Wish } from '../interfaces/wish.interface';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ChangePrioComponent } from '../dialogs/change-prio/change-prio.component';
import { HelperService } from '../Service/helper.service';
import { Observable } from 'rxjs';
import { AuthService } from '../Service/auth.service';
import { AuthGuardService } from '../Service/auth-guard.service';

@Component({
  selector: 'app-wishes',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './wishes.component.html',
  styleUrl: './wishes.component.scss'
})
export class WishesComponent implements OnInit {

  test: boolean = true;
  wishes$: Observable<Wish[]>
  // wishes: any[] = [];



  constructor(private firebase: FirebaseService, private auth: AuthService, private router: Router, public dialog: MatDialog, public help: HelperService) {
    this.wishes$ = this.firebase.wishlists$;
  }

  ngOnInit() {
    this.help.waitForUser()
  }

  trackByWishId(index: number, wish: any): string {
    return wish.id;
  }

  deleteWish(wish: Wish) {
    this.firebase.deleteWish(wish)
  }
  navigateToAddWish() {
    this.router.navigate(['/addWishes'])
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

  changePriority(wish: Wish): void {
    const dialogRef = this.dialog.open(ChangePrioComponent, {
      width: '250px',
      data: { wish: wish }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        wish.priority = result.priority;

        const user = this.auth.authInstance.currentUser;
        const userId = user?.uid;

        if (userId) {
          this.firebase.updateWish(userId, wish);
        } else {
          console.error("Kein angemeldeter Benutzer gefunden.");
        }
      }
    });
  }

}
