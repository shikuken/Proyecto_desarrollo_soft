import * as repo from '../repositories/sale.repository';
import { Sale } from '../models/Sale';

export const create = (data: Sale) => repo.create(data).then(s => { return s; });
export const confirm = (id: number, userId: number) => { throw new Error('Confirm not implemented in microservice skeleton'); };
export const findByIdWithLines = (id: number) => repo.findByIdWithLines(id);
export const list = () => repo.getAllWithClient();
export const update = async (id: number, data: Partial<Sale>) => {
	const r = await repo.update(id, data as any);
	return r;
};
export const remove = async (id: number) => {
	const r = await repo.remove(id);
	return r;
};
