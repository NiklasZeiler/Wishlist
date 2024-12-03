import { CanActivateFn, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { WishesComponent } from './wishes/wishes.component';
import { RegistrationComponent } from './registration/registration.component';
import { AddWishComponent } from './add-wish/add-wish.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { UserProfilComponent } from './user-profil/user-profil.component';
import { ViewWishesComponent } from './view-wishes/view-wishes.component';
import { AuthGuardService } from './Service/auth-guard.service';
import { inject } from '@angular/core';


export const authGuard: CanActivateFn = () => {
    const authGuardService = inject(AuthGuardService);
    return authGuardService.checkAuth();
};


export const routes: Routes = [
    { path: "", redirectTo: "login", pathMatch: "full" },  // Redirect root to "wishes"
    { path: "login", component: LoginComponent },
    { path: "wishes", component: WishesComponent, canActivate: [authGuard] },
    { path: "registration", component: RegistrationComponent },
    { path: "addWishes", component: AddWishComponent },
    { path: "feedback", component: FeedbackComponent },
    { path: "userProfil", component: UserProfilComponent },
    { path: 'wishes/share', component: ViewWishesComponent },
    { path: '**', redirectTo: 'wishes', pathMatch: 'full' }
];

