import { Component, Input } from '@angular/core';
import { Wish } from '../interfaces/wish.interface';
import { FirebaseService } from '../Service/firebase.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { HelperService } from '../Service/helper.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

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
  constructor(private firebase: FirebaseService, public dialog: MatDialog, public help: HelperService, private route: ActivatedRoute) {

  }


  ngOnInit(): void {
    this.route.queryParams.subscribe(async (params) => {
      const shareCode = params['shareCode'];

      if (shareCode) {
        try {
          this.wishes = await this.firebase.getWishesByShareCode(shareCode);
          console.log(this.wishes);
          this.userName = this.wishes[0].owener
          if (!this.wishes || this.wishes.length === 0) {
            this.errorMessage = 'Keine Wünsche gefunden.';
          }
        } catch (error) {
          console.error('Fehler beim Laden der Wunschliste:', error);
          this.errorMessage = 'Fehler beim Laden der Wunschliste.';
        }
      } else {
        this.errorMessage = 'Kein Teilen-Code gefunden.';
      }
    });
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
