import { Request, Response } from 'express';
import * as service from '../services/sale.service';
import axios from 'axios';

const PRODUCT_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:4001';
const CLIENT_URL = process.env.CLIENT_SERVICE_URL || 'http://localhost:4002';

export const create = async (req: Request, res: Response) => {
  try {
    const body = req.body || {};
    const clientId = body.client_id || body.clientId || null;
    const items = Array.isArray(body.products) ? body.products : [];
    const saleLines: any[] = [];
    let total = 0;

    for (const it of items) {
      const pid = it.product_id ?? it.productId;
      const qtyRaw = it.quantity ?? it.qty ?? 1;
      const qty = Number(qtyRaw);
      if (!Number.isFinite(qty) || qty <= 0) {
        return res.status(400).json({ error: `Cantidad inválida para producto ${pid}` });
      }
      // fetch product from product service
      let prod;
      try {
        const prodRes = await axios.get(`${PRODUCT_URL}/products/${pid}`);
        prod = prodRes.data;
      } catch (e:any) {
        return res.status(400).json({ error: `Producto ${pid} no existe` });
      }
      if (!prod) return res.status(400).json({ error: `Producto ${pid} no existe` });
      const price = parseFloat(String(prod.price ?? 0).replace(',', '.'));
      if (!Number.isFinite(price) || price < 0) {
        return res.status(400).json({ error: `Precio inválido para producto ${pid}` });
      }
      const subtotal = price * qty;
      total += subtotal;
      saleLines.push({ productId: Number(pid), qty, price });
    }
    // validate client existence if provided
    if (clientId) {
      try {
        await axios.get(`${CLIENT_URL}/clients/${clientId}`);
      } catch (e:any) {
        return res.status(400).json({ error: `Cliente ${clientId} no existe` });
      }
    }

    // round total to 2 decimals and ensure numeric
    total = Number((total || 0).toFixed(2));

    const salePayload: any = {
      clientId,
      number: `S-${Date.now()}`,
      total,
      saleLines
    };
    const sale = await service.create(salePayload);
    const full = await service.findByIdWithLines(Number(sale.id));
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

export const getById = async (req: Request, res: Response) => {
  try {
    const s: any = await service.findByIdWithLines(Number(req.params.id));
    if (!s) return res.status(404).json({ error: 'No encontrado' });
    // optionally fetch client name if remote
    let clientName = 'N/A';
    if (s.clientId) {
      try {
        const c = await axios.get(`${CLIENT_URL}/clients/${s.clientId}`);
        clientName = c.data?.name || clientName;
      } catch (e) {
        // ignore
      }
    }
    const prods = (s.saleLines || []).map((ln:any) => ({
      product_id: ln.productId,
      quantity: ln.qty,
      price: ln.price
    }));
    res.json({ id: s.id, client: clientName, products: prods, total: s.total });
  } catch (err:any) {
    res.status(500).json({ error: err.message });
  }
};

export const list = async (req: Request, res: Response) => {
  try {
    const rows = await service.list();
    const shaped = (rows || []).map((s:any) => ({ id: s.id, clientId: s.clientId, total: s.total, date: (s.createdAt || '').slice(0,10) }));
    res.json(shaped);
  } catch (err:any) {
    res.status(500).json({ error: err.message });
  }
};

export const confirm = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 0;
    const r = await service.confirm(Number(req.params.id), userId);
    res.json(r);
  } catch (err:any) {
    res.status(400).json({ error: err.message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    await service.update(Number(req.params.id), req.body);
    const s = await service.findByIdWithLines(Number(req.params.id));
    res.json(s);
  } catch (err:any) {
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
