import { Request, Response } from 'express';
import * as service from '../services/sale.service';
import * as productRepo from '../repositories/product.repository';
import * as clientRepo from '../repositories/client.repository';


export const create = async (req: Request, res: Response) => {
  try {
    const body = req.body || {};
    const clientId = body.client_id || body.clientId || null;
    const items = Array.isArray(body.products) ? body.products : [];
    // Build sale lines reading product price
    const saleLines: any[] = [];
    let total = 0;
    for (const it of items) {
      const pid = it.product_id ?? it.productId;
      const qty = Number(it.quantity ?? it.qty ?? 1);
      const prod = await productRepo.getById(Number(pid));
      if (!prod) return res.status(400).json({ error: `Producto ${pid} no existe` });
      const price = Number(prod.price || 0);
      const subtotal = price * qty;
      total += subtotal;
      saleLines.push({ productId: Number(pid), qty, price });
    }
    const salePayload: any = {
      clientId,
      number: `S-${Date.now()}`,
      total,
      saleLines
    };
    const sale = await service.create(salePayload);
    // Fetch the sale back with details
    const full = await service.findByIdWithLines(Number(sale.id));
    // Shape response as contract
    const details = (full?.saleLines || []).map((ln:any) => ({
      product_id: ln.productId,
      quantity: ln.qty,
      subtotal: (ln.price || 0) * (ln.qty || 0)
    }));
    res.status(201).json({
      id: full?.id,
      client_id: full?.clientId || clientId || null,
      total: total,
      details,
      created_at: full?.createdAt || new Date().toISOString()
    });
  } catch (err:any) {
    res.status(400).json({ error: err.message });
  }
};


export const confirm = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const r = await service.confirm(Number(req.params.id), userId);
    res.json(r);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};


export const getById = async (req: Request, res: Response) => {
  try {
    const s: any = await service.findByIdWithLines(Number(req.params.id));
    if (!s) return res.status(404).json({ error: 'No encontrado' });
    // Try to get client name
    const client = s.clientName || s.client || undefined;
    const prods = (s.saleLines || []).map((ln:any) => ({
      name: ln.name || ln.productName || ln.product_name || ln.product || `#${ln.productId}`,
      quantity: ln.qty
    }));
    res.json({
      id: s.id,
      client: client || 'N/A',
      products: prods,
      total: s.total
    });
  } catch (err:any) {
    res.status(500).json({ error: err.message });
  }
};



export const list = async (req: Request, res: Response) => {
  try {
    const rows = await service.list();
    const shaped = (rows || []).map((s:any) => ({
      id: s.id,
      client: s.clientName,
      total: s.total,
      date: (s.createdAt || '').slice(0,10)
    }));
    res.json(shaped);
  } catch (err:any) {
    res.status(500).json({ error: err.message });
  }
};
