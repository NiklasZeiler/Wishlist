import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { WishesComponent } from './wishes/wishes.component';
import { RegistrationComponent } from './registration/registration.component';
import { AddWishComponent } from './add-wish/add-wish.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { UserProfilComponent } from './user-profil/user-profil.component';
import { ViewWishesComponent } from './view-wishes/view-wishes.component';
import { authGuard } from './Service/auth-guard.service';


export const routes: Routes = [
    { path: "", redirectTo: "login", pathMatch: "full" },  // Redirect root to "wishes"
    { path: "login", component: LoginComponent },
    { path: "wishes", component: WishesComponent,canActivate: [authGuard]},
    { path: "registration", component: RegistrationComponent },
    { path: "addWishes", component: AddWishComponent },
    { path: "feedback", component: FeedbackComponent },
    { path: "userProfil", component: UserProfilComponent },
    { path: 'viewWish/:userId', component: ViewWishesComponent },
];

