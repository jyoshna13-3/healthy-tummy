import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class ProfilePage {
  protected readonly auth = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly message = signal('');
  protected readonly messageTone = signal<'info' | 'error'>('info');
  protected readonly busy = signal(false);

  protected readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    mobile: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
  });

  constructor() {
    effect(() => {
      const profile = this.auth.profile();
      if (profile) {
        this.form.patchValue({ name: profile.name, mobile: profile.mobile });
      }
    });
  }

  protected initials(name: string): string {
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  }

  protected async saveProfile(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, mobile } = this.form.getRawValue();
    this.busy.set(true);
    const result = await this.auth.updateProfile(name, mobile);
    this.busy.set(false);

    this.message.set(result.message ?? '');
    this.messageTone.set(result.code === 'invalid' ? 'error' : 'info');
  }
}
