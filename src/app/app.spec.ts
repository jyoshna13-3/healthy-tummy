import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the hero heading', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Where Every Bite Feels');
  });

  it('should keep the homepage visible on a hash link', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await fixture.whenStable();
    await router.navigateByUrl('/#about');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.hero')).toBeTruthy();
  });

  it('should show the homepage again after leaving an account page', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await fixture.whenStable();

    await router.navigateByUrl('/account/orders');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.hero')).toBeNull();

    await router.navigateByUrl('/');
    fixture.detectChanges();
    expect(compiled.querySelector('.hero')).toBeTruthy();
  });

  it('should open the account menu from the header', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const toggle = compiled.querySelector('.profile-toggle') as HTMLButtonElement;
    expect(toggle).toBeTruthy();

    toggle.click();
    fixture.detectChanges();

    expect(compiled.querySelector('.account-dropdown')?.classList).toContain('is-open');
  });

  it('should render the account pages and login page', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await fixture.whenStable();

    const pages = [
      ['/account/orders', 'app-orders-page'],
      ['/account/addresses', 'app-addresses-page'],
      ['/account/wishlist', 'app-wishlist-page'],
      ['/account/profile', 'app-profile-page'],
      ['/login', 'app-login-page'],
    ] as const;

    for (const [path, selector] of pages) {
      await router.navigateByUrl(path);
      fixture.detectChanges();
      await fixture.whenStable();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector(selector), `Expected ${path} to render`).toBeTruthy();
    }
  });

  it('should send guests to login before checkout', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await fixture.whenStable();

    await router.navigateByUrl('/checkout');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(router.url).toContain('/login');
  });
});
