import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordtoshortComponent } from './passwordtoshort.component';

describe('PasswordtoshortComponent', () => {
  let component: PasswordtoshortComponent;
  let fixture: ComponentFixture<PasswordtoshortComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordtoshortComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PasswordtoshortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
