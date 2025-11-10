import { db } from '../config/database';
import { Sale } from '../models/Sale';

export const create = (sale: Sale): Promise<Sale> => new Promise((resolve, reject) => {
  db.run(`INSERT INTO sales (clientId,number,total) VALUES (?, ?, ?)`, [sale.clientId || null, sale.number, sale.total], function(err) {
    if (err) return reject(err);
    const saleId = this.lastID;
    const lines = sale.saleLines || [];
    const insertLine = db.prepare(`INSERT INTO sale_lines (saleId,productId,qty,price,discount) VALUES (?, ?, ?, ?, ?)`);
    for (const ln of lines) {
      insertLine.run([saleId, ln.productId, ln.qty, ln.price, ln.discount || 0]);
    }
    insertLine.finalize((err2) => {
      if (err2) reject(err2);
      else resolve({ id: saleId, ...sale });
    });
  });
});

export const findByIdWithLines = (id: number): Promise<any> => new Promise((resolve, reject) => {
  db.get('SELECT * FROM sales WHERE id = ?', [id], (err, sale) => {
    if (err) return reject(err);
    db.all('SELECT * FROM sale_lines WHERE saleId = ?', [id], (err2, lines) => {
      if (err2) return reject(err2);
      resolve({ ...sale, saleLines: lines });
    });
  });
});

export const confirmSaleTx = (saleId: number, userId: number): Promise<any> => new Promise((resolve, reject) => {
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    findByIdWithLines(saleId).then((sale) => {
      if (!sale) return reject(new Error('Sale not found'));
      if (sale.confirmed) return reject(new Error('Already confirmed'));
      const lines = sale.saleLines || [];
      const updateProduct = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?');
      const checkStock = db.prepare('SELECT stock FROM products WHERE id = ?');
      (async () => {
        try {
          for (const ln of lines) {
            const stock = await new Promise<number>((res, rej) => {
              checkStock.get([ln.productId], (e, row) => e ? rej(e) : res(row ? row.stock : 0));
            });
            if (stock < ln.qty) throw new Error('Stock insuficiente');
            await new Promise((res, rej) => updateProduct.run([ln.qty, ln.productId], function(e) { if(e) rej(e); else res(null); }));
            db.run(`INSERT INTO audit_log (entity, entityId, action, userId, payload) VALUES (?, ?, ?, ?, ?)`,
              ['Product', ln.productId, 'SALE_MOVEMENT', userId, JSON.stringify({ qty: ln.qty })]);
          }
          db.run('UPDATE sales SET confirmed = 1, confirmedAt = CURRENT_TIMESTAMP WHERE id = ?', [saleId], function(e) {
            if (e) throw e;
            db.run('COMMIT', (cErr) => {
              if (cErr) reject(cErr);
              else resolve({ ok: true });
            });
          });
        } catch (e) {
          db.run('ROLLBACK', () => reject(e));
        } finally {
          updateProduct.finalize();
          checkStock.finalize();
        }
      })();
    }).catch(err => {
      db.run('ROLLBACK', () => reject(err));
    });
  });
});


export const getAllWithClient = (): Promise<any[]> => new Promise((resolve, reject) => {
  db.all(`SELECT s.id, s.total, s.createdAt, c.name as clientName
          FROM sales s
          LEFT JOIN clients c ON c.id = s.clientId
          ORDER BY s.id DESC`, [], (err, rows) => err ? reject(err) : resolve(rows));
});
