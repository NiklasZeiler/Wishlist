import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailExistsComponent } from './email-exists.component';

describe('EmailExistsComponent', () => {
  let component: EmailExistsComponent;
  let fixture: ComponentFixture<EmailExistsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailExistsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmailExistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
