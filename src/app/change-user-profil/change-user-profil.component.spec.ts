import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeUserProfilComponent } from './change-user-profil.component';

describe('ChangeUserProfilComponent', () => {
  let component: ChangeUserProfilComponent;
  let fixture: ComponentFixture<ChangeUserProfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeUserProfilComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChangeUserProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
