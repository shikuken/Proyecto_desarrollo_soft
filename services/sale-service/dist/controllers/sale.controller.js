"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.confirm = exports.list = exports.getById = exports.create = void 0;
const service = __importStar(require("../services/sale.service"));
const axios_1 = __importDefault(require("axios"));
const PRODUCT_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:4001';
const CLIENT_URL = process.env.CLIENT_SERVICE_URL || 'http://localhost:4002';
const create = async (req, res) => {
    var _a, _b, _c, _d;
    try {
        const body = req.body || {};
        const clientId = body.client_id || body.clientId || null;
        const items = Array.isArray(body.products) ? body.products : [];
        const saleLines = [];
        let total = 0;
        for (const it of items) {
            const pid = (_a = it.product_id) !== null && _a !== void 0 ? _a : it.productId;
            const qtyRaw = (_c = (_b = it.quantity) !== null && _b !== void 0 ? _b : it.qty) !== null && _c !== void 0 ? _c : 1;
            const qty = Number(qtyRaw);
            if (!Number.isFinite(qty) || qty <= 0) {
                return res.status(400).json({ error: `Cantidad inválida para producto ${pid}` });
            }
            // fetch product from product service
            let prod;
            try {
                const prodRes = await axios_1.default.get(`${PRODUCT_URL}/products/${pid}`);
                prod = prodRes.data;
            }
            catch (e) {
                return res.status(400).json({ error: `Producto ${pid} no existe` });
            }
            if (!prod)
                return res.status(400).json({ error: `Producto ${pid} no existe` });
            const price = parseFloat(String((_d = prod.price) !== null && _d !== void 0 ? _d : 0).replace(',', '.'));
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
                await axios_1.default.get(`${CLIENT_URL}/clients/${clientId}`);
            }
            catch (e) {
                return res.status(400).json({ error: `Cliente ${clientId} no existe` });
            }
        }
        // round total to 2 decimals and ensure numeric
        total = Number((total || 0).toFixed(2));
        const salePayload = {
            clientId,
            number: `S-${Date.now()}`,
            total,
            saleLines
        };
        const sale = await service.create(salePayload);
        const full = await service.findByIdWithLines(Number(sale.id));
        const details = ((full === null || full === void 0 ? void 0 : full.saleLines) || []).map((ln) => ({
            product_id: ln.productId,
            quantity: ln.qty,
            subtotal: (ln.price || 0) * (ln.qty || 0)
        }));
        res.status(201).json({
            id: full === null || full === void 0 ? void 0 : full.id,
            client_id: (full === null || full === void 0 ? void 0 : full.clientId) || clientId || null,
            total: total,
            details,
            created_at: (full === null || full === void 0 ? void 0 : full.createdAt) || new Date().toISOString()
        });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.create = create;
const getById = async (req, res) => {
    var _a;
    try {
        const s = await service.findByIdWithLines(Number(req.params.id));
        if (!s)
            return res.status(404).json({ error: 'No encontrado' });
        // optionally fetch client name if remote
        let clientName = 'N/A';
        if (s.clientId) {
            try {
                const c = await axios_1.default.get(`${CLIENT_URL}/clients/${s.clientId}`);
                clientName = ((_a = c.data) === null || _a === void 0 ? void 0 : _a.name) || clientName;
            }
            catch (e) {
                // ignore
            }
        }
        const prods = (s.saleLines || []).map((ln) => ({
            product_id: ln.productId,
            quantity: ln.qty,
            price: ln.price
        }));
        res.json({ id: s.id, client: clientName, products: prods, total: s.total });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getById = getById;
const list = async (req, res) => {
    try {
        const rows = await service.list();
        const shaped = (rows || []).map((s) => ({ id: s.id, clientId: s.clientId, total: s.total, date: (s.createdAt || '').slice(0, 10) }));
        res.json(shaped);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.list = list;
const confirm = async (req, res) => {
    var _a;
    try {
        const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || 0;
        const r = await service.confirm(Number(req.params.id), userId);
        res.json(r);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.confirm = confirm;
const update = async (req, res) => {
    try {
        await service.update(Number(req.params.id), req.body);
        const s = await service.findByIdWithLines(Number(req.params.id));
        res.json(s);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.update = update;
const remove = async (req, res) => {
    try {
        await service.remove(Number(req.params.id));
        res.status(204).send();
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.remove = remove;
