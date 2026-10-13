import { Component, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/auth.service';
import { ThemeService } from '../../core/theme.service';
import { ColorPickerDialogComponent } from '../dialogs/color-picker-dialog.component';

interface MenuLink {
  icon: string;
  title: string;
  route: string;
}

const NAVIGATION_LINKS: MenuLink[] = [
  { icon: 'home', title: 'Wunschliste', route: '/wishlist' },
  { icon: 'person', title: 'Profil', route: '/profile' },
  { icon: 'feedback', title: 'Feedback', route: '/feedback' },
];

const LEGAL_LINKS: MenuLink[] = [
  { icon: 'privacy_tip', title: 'Datenschutz', route: '/privacy' },
  { icon: 'info', title: 'Impressum', route: '/imprint' },
];

/** App bar with the end drawer that wraps every page after sign-in. */
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [MatIconModule, RouterLink],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  readonly title = input.required<string>();

  protected readonly auth = inject(AuthService);
  protected readonly theme = inject(ThemeService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  protected readonly drawerOpen = signal(false);
  protected readonly navigationLinks = NAVIGATION_LINKS;
  protected readonly legalLinks = LEGAL_LINKS;

  protected openColorPicker(): void {
    this.drawerOpen.set(false);
    this.dialog.open(ColorPickerDialogComponent, {
      width: '340px',
      panelClass: 'dialog-adaptive',
      autoFocus: false,
    });
  }

  protected async logout(): Promise<void> {
    this.drawerOpen.set(false);
    await this.auth.logout();
    await this.router.navigate(['/login']);
  }
}
