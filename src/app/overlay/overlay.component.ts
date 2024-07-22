import { Component } from '@angular/core';
import { LoginComponent } from "../login/login.component";
import { WishesComponent } from "../wishes/wishes.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-overlay',
  standalone: true,
  imports: [LoginComponent, WishesComponent, RouterOutlet],
  templateUrl: './overlay.component.html',
  styleUrl: './overlay.component.scss'
})
export class OverlayComponent {

}
