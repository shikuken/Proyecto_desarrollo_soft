export interface Product {
  id?: number;
  sku: string;
  name: string;
  category?: string;
  cost?: number;
  price?: number;
  unit?: string;
  stockMin?: number;
  stock?: number;
  active?: number;
  createdAt?: string;
}
