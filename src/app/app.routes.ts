import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { WishesComponent } from './wishes/wishes.component';
import { RegistrationComponent } from './registration/registration.component';
import { AddWishComponent } from './add-wish/add-wish.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { UserProfilComponent } from './user-profil/user-profil.component';


export const routes: Routes = [
    { path: "", redirectTo: "login", pathMatch: "full" },  // Redirect root to "wishes"
    { path: "login", component: LoginComponent },
    { path: "wishes", component: WishesComponent },
    { path: "registration", component: RegistrationComponent },
    { path: "addWishes", component: AddWishComponent },
    { path: "feedback", component: FeedbackComponent },
    { path: "userProfil", component: UserProfilComponent }
];

