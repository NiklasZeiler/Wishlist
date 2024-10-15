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
  sharedLink: string = "";
  displayLink: string = "";
  isRestrictedRoute = false;
  userLoggedIn = true;


  constructor(private firebase: FirebaseService, private auth: AuthService, private router: Router) {
    this.savedDate = localStorage.getItem('formattedDate');

  }

  checkIfRouteIsView() {
    this.checkRoute()
  }

  waitForUser() {
    const interval = setInterval(() => {
      const user = this.auth.auth.currentUser;
      if (user) {
        console.log("User is authenticated");
        clearInterval(interval);
        this.sharedLink = `${window.location.origin}/viewWish/${user?.uid}`;
        this.displayLink = this.getShortLink(this.sharedLink)
        this.deleteOlderWishes();
      } else {
        console.log("Waiting for user to authenticate...");
      }
    }, 1000);
  }

  getShortLink(url: string): string {
    const maxLength = 30;
    return url.length > maxLength ? url.substring(0, maxLength) + "..." : url;
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.sharedLink).then(
      () => {
        console.log('URL copied to clipboard');
        alert('URL copied to clipboard');
      },
      (err) => {
        console.error('Error copying URL: ', err);
      }
    );
  }

  checkRoute() {
    this.isRestrictedRoute = this.router.url.startsWith("/viewWish/")
    console.log(this.isRestrictedRoute, " is route from copy link");

    if (this.isRestrictedRoute == true) {
      this.userLoggedIn = false
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
