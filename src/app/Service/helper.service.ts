import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';


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


  constructor(private firebase: FirebaseService, private auth: AuthService, private router: Router) {
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
      } else {
        console.log("Waiting for user to authenticate...");
      }
    }, 1000);
  }

  copyToClipboard(): void {
    this.firebase.generateOrGetShareCode();
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
    } else {
      console.log("No saved date in localStorage.");
    }
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
