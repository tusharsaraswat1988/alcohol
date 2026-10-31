export interface BottleOption {
  size: string; // e.g. "750 ML", "375 ML"
  volumeMl: number; // e.g. 750, 375
  price: number; // Price in INR
  originalPrice?: number;
  inStock: boolean;
  stockCount: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  bannerUrl?: string;
  featured?: boolean;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  origin: string;
  established?: number;
  description: string;
  logoUrl?: string;
  featured?: boolean;
}

export type ProductBadge = 
  | 'Bestseller' 
  | 'Trending' 
  | 'Staff Pick' 
  | 'New Arrival' 
  | 'Limited Edition' 
  | 'Award Winner' 
  | 'Rare Reserve';

export interface Product {
  id: string;
  name: string;
  brandId: string;
  brandName: string;
  categoryId: string;
  categoryName: string;
  subCategory: string; // e.g. "Single Malt", "Blended Scotch", "Bourbon", "London Dry Gin"
  alcoholType: string;
  abv: number; // Percentage e.g. 40, 42.8
  origin: string; // e.g. "Scotland", "Japan", "USA"
  description: string;
  tastingNotes: string[];
  servingSuggestion?: string;
  imageUrl: string;
  rating: number; // e.g. 4.8
  reviewCount: number;
  bottleSizes: BottleOption[];
  badges?: ProductBadge[];
  featured?: boolean;
  popular?: boolean;
  recentlyAdded?: boolean;
}

export interface CartItem {
  cartItemId: string; // `${productId}_${size}`
  productId: string;
  product: Product;
  selectedSize: string;
  price: number;
  volumeMl: number;
  quantity: number;
}

export type AddressType = 'Home' | 'Work' | 'Other';

export interface Address {
  id: string;
  fullName: string;
  mobile: string;
  flatNumber: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  addressType: AddressType;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  avatarUrl?: string;
  isAgeVerified: boolean;
  verifiedAt?: string;
  wishlistIds: string[];
}

export type OrderStatus = 
  | 'Confirmed' 
  | 'Packing' 
  | 'Agent Assigned' 
  | 'Out for Delivery' 
  | 'Delivered' 
  | 'Cancelled';

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  tax: number; // Excise & GST
  deliveryFee: number;
  packagingFee: number;
  discount: number;
  total: number;
  address: Address;
  deliverySlot: string;
  paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'COD';
  status: OrderStatus;
  estimatedDelivery: string;
  timeline: {
    status: OrderStatus;
    timestamp: string;
    completed: boolean;
    description: string;
  }[];
}

export interface FilterState {
  categories: string[];
  brands: string[];
  subCategories: string[];
  sizes: string[];
  priceRange: [number, number];
  abvRange: [number, number];
  origins: string[];
  inStockOnly: boolean;
  sortBy: 'recommended' | 'popularity' | 'price-asc' | 'price-desc' | 'new-arrivals' | 'brand-az';
  searchQuery: string;
}
