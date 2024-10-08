import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewWishesComponent } from './view-wishes.component';

describe('ViewWishesComponent', () => {
  let component: ViewWishesComponent;
  let fixture: ComponentFixture<ViewWishesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewWishesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewWishesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
