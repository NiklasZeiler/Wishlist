import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders the router outlet', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('router-outlet')).not.toBeNull();
  });

  it('publishes the Material palette as CSS variables', () => {
    TestBed.createComponent(AppComponent);

    const primary = getComputedStyle(document.documentElement).getPropertyValue('--md-primary');
    expect(primary.trim()).toMatch(/^#[0-9a-f]{6}$/i);
  });
});
