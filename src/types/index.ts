export type VehicleCategory = 'SUV' | 'Pickup' | 'Sedan' | 'Hatchback' | 'Van';

export interface VehicleModel {
  id: string;
  make: string;
  model: string;
  yearRange: [number, number];
  category: VehicleCategory;
  trims: string[];
  popular?: boolean;
}

export type ProductCategory = 'accessories' | 'tint' | 'wraps' | 'paint_ppf';

export interface ProductItem {
  id: string;
  name: string;
  category: ProductCategory;
  categoryLabel: string;
  subcategory: string;
  priceKes: number;
  priceUsd: number;
  rating: number;
  reviewCount: number;
  image: string;
  description: string;
  features: string[];
  specs: { [key: string]: string };
  fitmentType: 'universal' | 'specific';
  compatibleVehicles?: {
    make: string;
    model?: string;
    years?: [number, number];
  }[];
  badge?: string;
  inStock: boolean;
  installTime?: string;
  warranty?: string;
}

export interface SelectedVehicle {
  year: number;
  make: string;
  model: string;
  trim?: string;
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
  includeInstallation: boolean;
  selectedOptions?: {
    tintPercentage?: number;
    wrapFinish?: string;
    color?: string;
  };
}

export interface BookingDetails {
  serviceType: string;
  vehicle: SelectedVehicle;
  branch: string;
  date: string;
  timeSlot: string;
  customerName: string;
  phone: string;
  email: string;
  notes?: string;
}
