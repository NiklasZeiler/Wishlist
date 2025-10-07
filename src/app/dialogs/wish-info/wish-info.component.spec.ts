import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishInfoComponent } from './wish-info.component';

describe('WishInfoComponent', () => {
  let component: WishInfoComponent;
  let fixture: ComponentFixture<WishInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WishInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WishInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
