export interface SaleLine {
  id?: number;
  saleId?: number;
  productId: number;
  qty: number;
  price: number;
  discount?: number;
}

export interface Sale {
  id?: number;
  clientId?: number;
  number: string;
  total: number;
  confirmed?: number;
  createdAt?: string;
  confirmedAt?: string;
  saleLines?: SaleLine[];
}
