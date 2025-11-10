import * as repo from '../repositories/product.repository';
import { Product } from '../models/Product';

export const list = () => repo.getAll();
export const getById = (id: number) => repo.getById(id);
export const create = async (data: Product) => {
  const exists = await repo.getBySKU(data.sku);
  if (exists) throw new Error('SKU duplicado');
  const created = await repo.create(data);
return created;
};
export const update = async (id: number, data: Partial<Product>, audit?: any) => {
  const updated = await repo.update(id, data);
return updated;
};
