import { Inject, Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Clipboard } from '@angular/cdk/clipboard';


export interface ShareLinkData {
  shareLink: string;
}


@Injectable({
  providedIn: 'root'
})
export class HelperService {


  savedDate: string | null = null;
  currentDate = new Date()
  showBigImg: boolean = false;
  previewImage: boolean = false;
  presentedImage: any;
  currentBigImage: any;
  wishLength: number = 0;

  displayLink: string = "";
  isRestrictedRoute = false;
  userLoggedIn = false;


  constructor(private firebase: FirebaseService, private auth: AuthService, private router: Router, private dialog: MatDialog,
    private clipboard: Clipboard) {
    this.savedDate = localStorage.getItem('formattedDate');

  }

  waitForUser() {
    const interval = setInterval(() => {
      const user = this.auth.authInstance.currentUser;
      if (user) {
        this.userLoggedIn = true
        console.log("User is authenticated");
        clearInterval(interval);
        this.deleteOlderWishes();
        this.getSavedDate().then(savedDate => {
          if (savedDate) {
            this.savedDate = savedDate;
            console.log("Saved date:", this.savedDate);
          } else {
            console.log("No saved date found, setting to current date.");
            this.savedDate = this.formatDate(this.currentDate);
            this.saveDate(this.savedDate);
          }
        });
      } else {
        console.log("Waiting for user to authenticate...");
      }
    }, 1000);
  }

  copyToClipboard(text: string): void {
    this.clipboard.copy(text);
  }

  // Method to handle share functionality
  async shareWishList(): Promise<void> {
    const shareCode = await this.firebase.generateOrGetShareCode();
    if (shareCode) {
      const shareLink = `http://wishlist-676f9.web.app/wishes/share?shareCode=${shareCode}`;

      // Copy to clipboard
      this.copyToClipboard(shareLink);

      // Import the dialog component dynamically to avoid circular dependencies
      const { ShareLinkComponent } = await import('../dialogs/share-link/share-link.component');

      // Open dialog with the share link
      this.dialog.open(ShareLinkComponent, {
        width: '500px',
        data: { shareLink }
      });
    }
  }


  deleteOlderWishes() {
    const currentDateFormatted = this.formatDate(this.currentDate)
    let savedDateFormatted = this.savedDate ? this.savedDate : null;

    if (savedDateFormatted) {
      const savedDateObject = this.parseDate(savedDateFormatted);
      const currentDateObject = this.parseDate(currentDateFormatted);
      console.log(currentDateObject);

      if (savedDateObject < currentDateObject) {
        this.firebase.deleteOldWishes(savedDateFormatted);
        localStorage.clear()
      } else {
        console.log("Saved date is newer or same.");
      }
    } 
  }

  saveDate(selectedDate: string) {
    // Save the formatted date on firebase
    this.firebase.saveDate(selectedDate);
  }

  async getSavedDate(): Promise<string | null> {
    return await this.firebase.getSavedDate();
  }



  formatDate(date: any) {
    let day = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let year = date.getFullYear();

    return `${day}.${month}.${year}`;
  }

  parseDate(dateString: string): Date {
    const [day, month, year] = dateString.split('.').map(Number);
    return new Date(year, month - 1, day);
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
