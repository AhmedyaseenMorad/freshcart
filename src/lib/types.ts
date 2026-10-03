export interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
}

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  image?: string;
}

export interface Product {
  _id: string;
  id?: string;
  title: string;
  slug: string;
  description: string;
imageCover: string;
  images?: string[];
  price: number;
  priceAfterDiscount?: number;
  quantity: number;
  sold?: number;
  ratingsAverage?: number;
  ratingsQuantity?: number;
  category: Category;
  subcategory?: { _id: string; name: string; slug: string }[];
  brand: Brand;
}

export interface Paginated<T> {
  data: T[];
  page: number;
  limit: number;
  totalDocs: number;
  totalPages: number;
  results: number;
  metadata?: {
    currentPage?: number;
    numberOfPages?: number;
    limit?: number;
    nextPage?: number | null;
    prev?: number;
  };
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role?: string;
}

export interface CartItem {
  count: number;
  _id: string;
  price?: number;
  product: Product & { id?: string; category?: { _id: string; name: string; slug: string } };
}

export interface Cart {
  _id?: string;
  cartItems?: CartItem[];
  products?: CartItem[];
  cartOwner?: string;
  totalCartPrice: number;
  totalAfterDiscount?: number;
  numOfCartItems: number;
  status?: string;
}

export interface Review {
  _id: string;
  user: { _id: string; name: string };
  product: string;
  review: string;
  rating: number;
  createdAt: string;
}

export interface OrderProduct {
  count: number;
  product: { _id: string; title: string; imageCover: string; price: number };
  price: number;
}

export interface Order {
  _id: string;
  user: string;
  cartItems: OrderProduct[];
  shippingAddress: Partial<{
    details: string;
    phone: string;
    city: string;
    fullName: string;
  }>;
  taxPrice: number;
  shippingPrice: number;
  totalOrderPrice: number;
  paymentMethodType: string;
  isPaid: boolean;
  isDelivered: boolean;
  paidAt?: string;
  deliveredAt?: string;
  createdAt: string;
  id: number;
}

export interface Address {
  _id: string;
  name: string;
  details: string;
  phone: string;
  city: string;
}