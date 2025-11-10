import { Request, Response } from 'express';
import * as service from '../services/client.service';

export const list = async (req: Request, res: Response) => {
  try {
    
    const clients = await service.list();
    const shaped = (clients || []).map((c:any) => ({ id: c.id, name: c.name, email: c.email }));
    res.json(shaped);
    
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    
    const client = await service.getById(Number(req.params.id));
    if (!client) return res.status(404).json({ error: 'No encontrado' });
    res.json({ id: client.id, name: client.name, email: client.email, phone: client.phone });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    
    const payload = req.body || {};
    if (!payload.nit) payload.nit = `NIT-${Date.now()}`;
    const created = await service.create(payload);
    const fresh = await service.getById(Number(created.id));
    res.status(201).json({ id: fresh?.id, name: fresh?.name, email: fresh?.email, phone: fresh?.phone, created_at: fresh?.createdAt });
    
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    
    await service.update(Number(req.params.id), req.body);
    const fresh = await service.getById(Number(req.params.id));
    res.json({ id: fresh?.id, name: fresh?.name, email: fresh?.email, phone: fresh?.phone });
    
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
