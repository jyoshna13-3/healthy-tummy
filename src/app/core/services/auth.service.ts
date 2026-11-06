import { Injectable, computed, signal } from '@angular/core';
import { CustomerProfile } from '../models/customer.models';

export type AuthResultCode = 'invalid' | 'not-configured';

export interface AuthResult {
  ok: boolean;
  code?: AuthResultCode;
  message?: string;
}

const NOT_CONFIGURED_MESSAGE =
  'Secure OTP login is not connected yet. This screen is ready for Supabase phone authentication, and no login has been created.';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly profileState = signal<CustomerProfile | null>(null);

  readonly profile = this.profileState.asReadonly();
  readonly isAuthenticated = computed(() => this.profileState() !== null);
  readonly loginAvailable = false;

  async requestOtp(mobile: string): Promise<AuthResult> {
    if (!this.isValidMobile(mobile)) {
      return {
        ok: false,
        code: 'invalid',
        message: 'Please enter a valid 10-digit mobile number.',
      };
    }

    return { ok: false, code: 'not-configured', message: NOT_CONFIGURED_MESSAGE };
  }

  async verifyOtp(mobile: string, token: string): Promise<AuthResult> {
    if (!this.isValidMobile(mobile)) {
      return {
        ok: false,
        code: 'invalid',
        message: 'Please enter a valid 10-digit mobile number.',
      };
    }

    if (!/^\d{6}$/.test(token)) {
      return {
        ok: false,
        code: 'invalid',
        message: 'Please enter the 6-digit verification code.',
      };
    }

    return { ok: false, code: 'not-configured', message: NOT_CONFIGURED_MESSAGE };
  }

  async register(name: string, mobile: string): Promise<AuthResult> {
    if (name.trim().length < 2) {
      return {
        ok: false,
        code: 'invalid',
        message: 'Please share your name so we know what to call you.',
      };
    }

    if (!this.isValidMobile(mobile)) {
      return {
        ok: false,
        code: 'invalid',
        message: 'Please enter a valid 10-digit mobile number.',
      };
    }

    return { ok: false, code: 'not-configured', message: NOT_CONFIGURED_MESSAGE };
  }

  async updateProfile(name: string, mobile: string): Promise<AuthResult> {
    if (name.trim().length < 2) {
      return {
        ok: false,
        code: 'invalid',
        message: 'Please share your name so we know what to call you.',
      };
    }

    if (!this.isValidMobile(mobile)) {
      return {
        ok: false,
        code: 'invalid',
        message: 'Please enter a valid 10-digit mobile number.',
      };
    }

    return { ok: false, code: 'not-configured', message: NOT_CONFIGURED_MESSAGE };
  }

  async signOut(): Promise<void> {
    this.profileState.set(null);
  }

  private isValidMobile(mobile: string): boolean {
    return /^[6-9]\d{9}$/.test(mobile.trim());
  }
}
