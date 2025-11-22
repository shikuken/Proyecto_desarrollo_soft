import { Request, Response } from 'express';
import * as service from '../services/client.service';

export const list = async (req: Request, res: Response) => {
  try {
    const clients = await service.list();
    const shaped = (clients || []).map((c:any) => ({ id: c.id, name: c.name, phone: c.phone, createdAt: c.createdAt }));
    res.json(shaped);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const client = await service.getById(Number(req.params.id));
    if (!client) return res.status(404).json({ error: 'No encontrado' });
    res.json({ id: client.id, name: client.name, phone: client.phone, createdAt: client.createdAt });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const payload = req.body || {};
    const created = await service.create(payload);
    const fresh = await service.getById(Number(created.id));
    res.status(201).json({ id: fresh?.id, name: fresh?.name, phone: fresh?.phone, createdAt: fresh?.createdAt });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    await service.update(Number(req.params.id), req.body);
    const fresh = await service.getById(Number(req.params.id));
    res.json({ id: fresh?.id, name: fresh?.name, phone: fresh?.phone, createdAt: fresh?.createdAt });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await service.remove(Number(req.params.id));
    res.status(200).json({
      mwessage: 'Cliente eliminado correctamente'
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
