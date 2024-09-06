import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePrioComponent } from './change-prio.component';

describe('ChangePrioComponent', () => {
  let component: ChangePrioComponent;
  let fixture: ComponentFixture<ChangePrioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangePrioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChangePrioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
