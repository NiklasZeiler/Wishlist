import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { WishesComponent } from "./wishes/wishes.component";
import { LoginComponent } from "./login/login.component";
import { OverlayComponent } from "./overlay/overlay.component";
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, WishesComponent, LoginComponent, OverlayComponent, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'wishlist';
}
