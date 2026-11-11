export type PortionId = 'half' | 'full';

export interface FoodPortion {
  id: PortionId;
  label: string;
  weight: string;
  price: number;
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  alt: string;
  available: boolean;
  rating: number | null;
  reviewCount: number;
  preparationTime: string | null;
  portions: FoodPortion[];
  advanceOrderRequired: boolean;
  advanceOrderNotice: string;
}
