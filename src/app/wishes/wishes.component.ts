import { Component, Input } from '@angular/core';
import { FirebaseService } from '../Service/firebase.service';
import { CommonModule } from '@angular/common';
import { Wish } from '../interfaces/wish.interface';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ChangePrioComponent } from '../dialogs/change-prio/change-prio.component';
import { HelperService } from '../Service/helper.service';

@Component({
  selector: 'app-wishes',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './wishes.component.html',
  styleUrl: './wishes.component.scss'
})
export class WishesComponent {
  @Input() wish!: Wish

  test: boolean = true;
  showBigImg: boolean = false;
  previewImage: boolean = false;
  presentedImage: any;
  currentBigImage: any;

  constructor(private firebase: FirebaseService, private router: Router, public dialog: MatDialog, private help: HelperService) {

  }

  ngOnInit() {
    this.help.waitForUser()
  }
  getWishes(): Wish[] {
    return this.firebase.wishes;
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
        this.firebase.updateWish(wish)
      }
    });
  }

  handleButton(wish: Wish) {
    // Wenn der User angemeldet ist und auf seiner eigenen Wunschliste ist
    if (this.test == true) {
      this.deleteWish(wish)
    } else {

      // Wenn der User nicht angemeldet ist oder auf einer anderen Wunschliste ist
      wish.completed = true
      wish.completedAt = new Date()
      this.firebase.updateWish(wish)
    }
  }

  openImage(image: any): void {
    this.showBigImg = true;
    this.previewImage = true;
    this.currentBigImage = image;
    this.presentedImage = image;
  }


  /**
   * close big image
   */
  closeImage() {
    this.showBigImg = false;
    this.previewImage = false;

  }




}
