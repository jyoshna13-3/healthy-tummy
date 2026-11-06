import { Injectable, computed, signal } from '@angular/core';
import { Address, AddressDraft } from '../models/customer.models';

const STORAGE_KEY = 'healthy-tummy.addresses';

@Injectable({ providedIn: 'root' })
export class AddressService {
  private readonly addressesState = signal<Address[]>(this.loadAddresses());

  readonly addresses = this.addressesState.asReadonly();
  readonly count = computed(() => this.addressesState().length);

  addAddress(draft: AddressDraft): Address {
    const isFirstAddress = this.addressesState().length === 0;
    const address: Address = {
      ...draft,
      id: this.createId(),
      isDefault: isFirstAddress,
    };

    this.updateState([...this.addressesState(), address]);
    return address;
  }

  updateAddress(id: string, draft: AddressDraft): void {
    this.updateState(
      this.addressesState().map((address) =>
        address.id === id ? { ...address, ...draft } : address,
      ),
    );
  }

  removeAddress(id: string): void {
    const remaining = this.addressesState().filter((address) => address.id !== id);
    const hadDefault = this.addressesState().some(
      (address) => address.id === id && address.isDefault,
    );

    if (hadDefault && remaining.length > 0) {
      remaining[0] = { ...remaining[0], isDefault: true };
    }

    this.updateState(remaining);
  }

  setDefaultAddress(id: string): void {
    this.updateState(
      this.addressesState().map((address) => ({
        ...address,
        isDefault: address.id === id,
      })),
    );
  }

  private updateState(addresses: Address[]): void {
    this.addressesState.set(addresses);
    this.persistAddresses(addresses);
  }

  private loadAddresses(): Address[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? (JSON.parse(saved) as Address[]) : [];
    } catch {
      return [];
    }
  }

  private persistAddresses(addresses: Address[]): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
  }

  private createId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }

    return `address-${Date.now()}`;
  }
}
