import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Address, AddressLabel } from '../../../core/models/customer.models';
import { AddressService } from '../../../core/services/address.service';

@Component({
  selector: 'app-addresses-page',
  imports: [ReactiveFormsModule],
  templateUrl: './addresses.html',
  styleUrl: './addresses.scss',
})
export class AddressesPage {
  protected readonly addressService = inject(AddressService);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly addresses = this.addressService.addresses;
  protected readonly formOpen = signal(false);
  protected readonly editingId = signal<string | null>(null);

  protected readonly form = this.formBuilder.nonNullable.group({
    label: ['Home' as AddressLabel, Validators.required],
    houseNumber: ['', Validators.required],
    street: ['', Validators.required],
    area: ['', Validators.required],
    landmark: [''],
    city: ['', Validators.required],
    state: ['', Validators.required],
    pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
  });

  protected openAddForm(): void {
    this.editingId.set(null);
    this.form.reset({
      label: 'Home',
      houseNumber: '',
      street: '',
      area: '',
      landmark: '',
      city: '',
      state: '',
      pincode: '',
    });
    this.formOpen.set(true);
  }

  protected editAddress(address: Address): void {
    this.editingId.set(address.id);
    this.form.setValue({
      label: address.label,
      houseNumber: address.houseNumber,
      street: address.street,
      area: address.area,
      landmark: address.landmark,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
    });
    this.formOpen.set(true);
  }

  protected saveAddress(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const editingId = this.editingId();
    if (editingId) {
      this.addressService.updateAddress(editingId, this.form.getRawValue());
    } else {
      this.addressService.addAddress(this.form.getRawValue());
    }

    this.closeForm();
  }

  protected removeAddress(id: string): void {
    this.addressService.removeAddress(id);

    if (this.editingId() === id) {
      this.closeForm();
    }
  }

  protected makeDefault(id: string): void {
    this.addressService.setDefaultAddress(id);
  }

  protected closeForm(): void {
    this.formOpen.set(false);
    this.editingId.set(null);
    this.form.reset();
  }

  protected hasError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }
}
