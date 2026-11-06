import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthResult, AuthService } from '../../../core/services/auth.service';

type AuthMode = 'login' | 'signup';
type AuthStep = 'mobile' | 'otp';

@Component({
  selector: 'app-login-page',
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly mode = signal<AuthMode>('login');
  protected readonly step = signal<AuthStep>('mobile');
  protected readonly name = signal('');
  protected readonly mobile = signal('');
  protected readonly otp = signal('');
  protected readonly message = signal('');
  protected readonly messageTone = signal<'info' | 'error'>('info');
  protected readonly busy = signal(false);

  protected setMode(mode: AuthMode): void {
    if (this.busy()) {
      return;
    }

    this.mode.set(mode);
    this.step.set('mobile');
    this.otp.set('');
    this.message.set('');
  }

  protected async continueWithMobile(): Promise<void> {
    this.busy.set(true);
    const result =
      this.mode() === 'signup'
        ? await this.auth.register(this.name(), this.mobile())
        : await this.auth.requestOtp(this.mobile());
    this.busy.set(false);

    this.applyResult(result);

    if (result.code !== 'invalid') {
      this.step.set('otp');
      this.otp.set('');
    }
  }

  protected async verifyOtp(): Promise<void> {
    this.busy.set(true);
    const result = await this.auth.verifyOtp(this.mobile(), this.otp());
    this.busy.set(false);
    this.applyResult(result);

    if (result.ok) {
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
      const destination = returnUrl && /^\/(?!\/)/.test(returnUrl) ? returnUrl : '/account';
      await this.router.navigateByUrl(destination);
    }
  }

  protected async resendOtp(): Promise<void> {
    this.busy.set(true);
    const result = await this.auth.requestOtp(this.mobile());
    this.busy.set(false);
    this.applyResult(result);
  }

  protected changeNumber(): void {
    this.step.set('mobile');
    this.otp.set('');
    this.message.set('');
  }

  protected updateMobile(value: string): void {
    this.mobile.set(value.replace(/\D/g, '').slice(0, 10));
  }

  protected updateOtp(value: string): void {
    this.otp.set(value.replace(/\D/g, '').slice(0, 6));
  }

  private applyResult(result: AuthResult): void {
    this.message.set(result.message ?? '');
    this.messageTone.set(result.code === 'invalid' ? 'error' : 'info');
  }
}
