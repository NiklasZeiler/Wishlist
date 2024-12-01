import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OverlayComponent } from "./overlay/overlay.component";
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, OverlayComponent, FormsModule, MatMenuModule, MatDialogModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'wishlist';




}
