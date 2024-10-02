import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificateEmailComponent } from './verificate-email.component';

describe('VerificateEmailComponent', () => {
  let component: VerificateEmailComponent;
  let fixture: ComponentFixture<VerificateEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerificateEmailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerificateEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
