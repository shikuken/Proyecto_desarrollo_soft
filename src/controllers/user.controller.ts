import { Request, Response } from 'express';
import * as service from '../services/user.service';

export const register = async (req: Request, res: Response) => {
  try {
    const user = await service.register(req.body);
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const r = await service.login(req.body);
    res.json(r);
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
};
