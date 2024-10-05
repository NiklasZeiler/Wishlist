import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class HelperService {


  savedDate: string | null = null;
  currentDate = new Date()

  constructor(private firebase: FirebaseService, private auth: AuthService) {
    this.savedDate = localStorage.getItem('formattedDate');
  }

  waitForUser() {
    const interval = setInterval(() => {
      const user = this.auth.auth.currentUser;
      if (user) {
        console.log("User is authenticated");
        clearInterval(interval);
        this.deleteOlderWishes();
      } else {
        console.log("Waiting for user to authenticate...");
      }
    }, 1000);
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
}
