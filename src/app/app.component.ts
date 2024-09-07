import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { WishesComponent } from "./wishes/wishes.component";
import { LoginComponent } from "./login/login.component";
import { OverlayComponent } from "./overlay/overlay.component";
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, WishesComponent, LoginComponent, OverlayComponent, FormsModule, MatMenuModule, MatDialogModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'wishlist';
}
