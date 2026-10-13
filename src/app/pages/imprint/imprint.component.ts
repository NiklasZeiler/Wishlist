import { Component } from '@angular/core';
import { IMPRINT_SECTIONS } from '../../core/legal-content';
import { LegalPageComponent } from '../../shared/legal-page/legal-page.component';

@Component({
  selector: 'app-imprint',
  standalone: true,
  imports: [LegalPageComponent],
  template: '<app-legal-page heading="Impressum" [sections]="sections" />',
})
export class ImprintComponent {
  protected readonly sections = IMPRINT_SECTIONS;
}
