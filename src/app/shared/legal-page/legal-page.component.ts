import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CONTACT_EMAIL, LegalSection } from '../../core/legal-content';
import { MainLayoutComponent } from '../main-layout/main-layout.component';

@Component({
  selector: 'app-legal-page',
  standalone: true,
  imports: [MainLayoutComponent, MatIconModule],
  templateUrl: './legal-page.component.html',
  styleUrl: './legal-page.component.scss',
})
export class LegalPageComponent {
  readonly heading = input.required<string>();
  readonly sections = input.required<LegalSection[]>();
  readonly updatedAt = input<string>();

  protected readonly contactLink = `mailto:${CONTACT_EMAIL}`;
}
