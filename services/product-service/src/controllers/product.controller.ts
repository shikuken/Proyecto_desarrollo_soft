import { Request, Response } from 'express';
import * as service from '../services/product.service';

export const list = async (req: Request, res: Response) => {
  try {
    const rows = await service.list();
    const shaped = (rows || []).map((p:any) => ({ id: p.id, name: p.name, price: p.price, createdAt: p.createdAt }));
    res.json(shaped);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const p = await service.getById(Number(req.params.id));
    if (!p) return res.status(404).json({ error: 'No encontrado' });
    res.json({ id: p.id, name: p.name, price: p.price, createdAt: p.createdAt });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const payload = req.body || {};
    const p = await service.create(payload);
    const fresh = await service.getById(Number(p.id));
    res.status(201).json({ id: fresh?.id, name: fresh?.name, price: fresh?.price, createdAt: fresh?.createdAt });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    await service.update(Number(req.params.id), req.body);
    const fresh = await service.getById(Number(req.params.id));
    res.json({ id: fresh?.id, name: fresh?.name, price: fresh?.price, createdAt: fresh?.createdAt });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await service.remove(Number(req.params.id));
    res.status(204).send();
  } catch (err:any) {
    res.status(400).json({ error: err.message });
  }
};

