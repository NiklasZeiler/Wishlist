import { Component } from '@angular/core';
import { PRIVACY_SECTIONS, PRIVACY_UPDATED_AT } from '../../core/legal-content';
import { LegalPageComponent } from '../../shared/legal-page/legal-page.component';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [LegalPageComponent],
  template:
    '<app-legal-page heading="Datenschutzerklärung" [sections]="sections" [updatedAt]="updatedAt" />',
})
export class PrivacyComponent {
  protected readonly sections = PRIVACY_SECTIONS;
  protected readonly updatedAt = PRIVACY_UPDATED_AT;
}
