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
  portionSize: string | null;
  advanceOrderRequired: boolean;
  advanceOrderNotice: string;
}
