import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareLinkComponent } from './share-link.component';

describe('ShareLinkComponent', () => {
  let component: ShareLinkComponent;
  let fixture: ComponentFixture<ShareLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShareLinkComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShareLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
