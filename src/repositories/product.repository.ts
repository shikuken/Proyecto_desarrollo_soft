import { db } from '../config/database';
import { Product } from '../models/Product';

export const getAll = (): Promise<Product[]> => new Promise((resolve, reject) => {
  db.all('SELECT * FROM products', [], (err, rows) => err ? reject(err) : resolve(rows));
});

export const getById = (id: number): Promise<Product | undefined> => new Promise((resolve, reject) => {
  db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => err ? reject(err) : resolve(row));
});

export const getBySKU = (sku: string): Promise<Product | undefined> => new Promise((resolve, reject) => {
  db.get('SELECT * FROM products WHERE sku = ?', [sku], (err, row) => err ? reject(err) : resolve(row));
});

export const create = (p: Product): Promise<Product> => new Promise((resolve, reject) => {
  db.run(`INSERT INTO products (sku,name,category,cost,price,unit,stockMin,stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [p.sku,p.name,p.category||'',p.cost||0,p.price||0,p.unit||'',p.stockMin||0,p.stock||0],
    function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, ...p });
    });
});

export const update = (id: number, data: Partial<Product>): Promise<any> => new Promise((resolve, reject) => {
  const fields = Object.keys(data).map(k => `${k} = ?`).join(', ');
  const values = Object.values(data);
  db.run(`UPDATE products SET ${fields} WHERE id = ?`, [...values, id], function(err) {
    if (err) reject(err);
    else resolve({ changes: this.changes });
  });
});
