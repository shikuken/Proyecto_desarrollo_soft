import { db } from '../config/database';
import { Product } from '../models/Product';

export const getAll = (): Promise<Product[]> => new Promise((resolve, reject) => {
  db.all('SELECT * FROM products', [], (err, rows) => err ? reject(err) : resolve(rows as unknown as Product[]));
});

export const getById = (id: number): Promise<Product | undefined> => new Promise((resolve, reject) => {
  db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => err ? reject(err) : resolve(row as unknown as Product));
});

export const getByName = (name: string): Promise<Product | undefined> => new Promise((resolve, reject) => {
  db.get('SELECT * FROM products WHERE name = ?', [name], (err, row) => err ? reject(err) : resolve(row as unknown as Product));
});

export const create = (p: any): Promise<any> => new Promise((resolve, reject) => {
  db.run(`INSERT INTO products (name, price) VALUES (?, ?)`,
    [p.name, p.price || 0],
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

export const remove = (id: number): Promise<any> => new Promise((resolve, reject) => {
  db.run(`DELETE FROM products WHERE id = ?`, [id], function(err) {
    if (err) reject(err);
    else resolve({ changes: this.changes });
  });
});
