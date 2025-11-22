import { db } from '../config/database';
import { Sale } from '../models/Sale';

export const create = (sale: Sale): Promise<Sale> => new Promise((resolve, reject) => {
  db.run(`INSERT INTO sales (clientId,number,total) VALUES (?, ?, ?)`, [sale.clientId || null, sale.number, sale.total], function(err) {
    if (err) return reject(err);
    const saleId = this.lastID;
    const lines = sale.saleLines || [];
    const insertLine = db.prepare(`INSERT INTO sale_lines (saleId,productId,qty,price) VALUES (?, ?, ?, ?)`);
    for (const ln of lines) {
      insertLine.run([saleId, ln.productId, ln.qty, ln.price]);
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
      resolve({ ...(sale as any), saleLines: lines });
    });
  });
});

export const getAllWithClient = (): Promise<any[]> => new Promise((resolve, reject) => {
  db.all(`SELECT s.id, s.total, s.createdAt, s.clientId
          FROM sales s
          ORDER BY s.id DESC`, [], (err, rows) => err ? reject(err) : resolve(rows as unknown as any[]));
});

export const update = (id: number, data: Partial<Sale>): Promise<any> => new Promise((resolve, reject) => {
  const fields = Object.keys(data).map(k => `${k} = ?`).join(', ');
  const values = Object.values(data);
  db.run(`UPDATE sales SET ${fields} WHERE id = ?`, [...values, id], function(err) {
    if (err) reject(err);
    else resolve({ changes: this.changes });
  });
});

export const remove = (id: number): Promise<any> => new Promise((resolve, reject) => {
  db.serialize(() => {
    db.run('DELETE FROM sale_lines WHERE saleId = ?', [id], function(err) {
      if (err) return reject(err);
      db.run('DELETE FROM sales WHERE id = ?', [id], function(err2) {
        if (err2) reject(err2);
        else resolve({ ok: true });
      });
    });
  });
});
