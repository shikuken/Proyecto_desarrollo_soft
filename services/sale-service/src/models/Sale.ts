export interface SaleLine {
  id?: number;
  saleId?: number;
  productId: number;
  qty: number;
  price: number;
}

export interface Sale {
  id?: number;
  clientId?: number;
  number: string;
  total: number;
  createdAt?: string;
  saleLines?: SaleLine[];
}
