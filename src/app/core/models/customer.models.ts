export interface CustomerProfile {
  id: string;
  name: string;
  mobile: string;
  email?: string;
}

export type AddressLabel = 'Home' | 'Office' | 'Other';

export interface Address {
  id: string;
  label: AddressLabel;
  houseNumber: string;
  street: string;
  area: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export type AddressDraft = Omit<Address, 'id' | 'isDefault'>;

export type OrderStatus = 'Delivered' | 'Preparing' | 'Out for delivery' | 'Cancelled';

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  amount: number;
  date: string;
  status: OrderStatus;
}

export interface WishlistItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface CartItem {
  id: string;
  lineId?: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  portionId?: 'half' | 'full';
  portionLabel?: string;
  portionWeight?: string;
}
