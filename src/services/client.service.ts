import * as repo from '../repositories/client.repository';
import { Client } from '../models/Client';

export const list = () => repo.getAll();
export const getById = (id: number) => repo.getById(id);
export const create = async (data: Client) => {
  const exists = await repo.getByNIT(data.nit);
  if (exists) throw new Error('NIT duplicado');
  const created = await repo.create(data);
return created;
};
export const update = async (id: number, data: Partial<Client>, audit?: any) => {
  const updated = await repo.update(id, data);
return updated;
};
