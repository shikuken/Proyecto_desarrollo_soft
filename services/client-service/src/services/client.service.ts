import * as repo from '../repositories/client.repository';
import { Client } from '../models/Client';

export const list = () => repo.getAll();
export const getById = (id: number) => repo.getById(id);
export const create = async (data: any) => {
  if (!data.name) throw new Error('El nombre es requerido');
  const exists = await repo.getByName(data.name as string);
  if (exists) throw new Error('Nombre de cliente duplicado');
  const created = await repo.create(data);
  return created;
};
export const update = async (id: number, data: Partial<Client>, audit?: any) => {
  const updated = await repo.update(id, data);
  return updated;
};

export const remove = async (id: number) => {
  const r = await repo.remove(id);
  return r;
};
