import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { WishesComponent } from './wishes/wishes.component';
import { OverlayComponent } from './overlay/overlay.component';
import { RegistrationComponent } from './registration/registration.component';


// export const routes: Routes = [{ path: "login", component: LoginComponent }, { path: "wishes", component: WishesComponent }];
export const routes: Routes = [{
    path: "", component: OverlayComponent, children: [
        { path: "login", component: LoginComponent },
        { path: "wishes", component: WishesComponent },
        { path: "registration", component: RegistrationComponent }]
}];
