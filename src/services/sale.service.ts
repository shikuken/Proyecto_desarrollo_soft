import * as repo from '../repositories/sale.repository';
import { Sale } from '../models/Sale';

export const create = (data: Sale) => repo.create(data).then(s => {
return s;
});

export const confirm = (id: number, userId: number) => repo.confirmSaleTx(id, userId);
export const findByIdWithLines = (id: number) => repo.findByIdWithLines(id);

export const list = () => repo.getAllWithClient();
