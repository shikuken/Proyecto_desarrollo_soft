import * as repo from '../repositories/product.repository';
import { Product } from '../models/Product';

export const list = () => repo.getAll();
export const getById = (id: number) => repo.getById(id);
export const create = async (data: Product) => {
  // prevent duplicate product names
  if (!data.name) throw new Error('Name is required');
  const exists = await repo.getByName(data.name as string);
  if (exists) throw new Error('Nombre duplicado');
  const created = await repo.create(data);
  return created;
};
export const update = async (id: number, data: Partial<Product>, audit?: any) => {
  const updated = await repo.update(id, data);
  return updated;
};

export const remove = async (id: number) => {
  const r = await repo.remove(id);
  return r;
};
