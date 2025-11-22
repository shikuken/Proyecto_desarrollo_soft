import { db } from '../config/database';
import { Client } from '../models/Client';

export const getAll = (): Promise<Client[]> => new Promise((resolve, reject) => {
  db.all('SELECT * FROM clients', [], (err, rows) => err ? reject(err) : resolve(rows as unknown as Client[]));
});

export const getById = (id: number): Promise<Client | undefined> => new Promise((resolve, reject) => {
  db.get('SELECT * FROM clients WHERE id = ?', [id], (err, row) => err ? reject(err) : resolve(row as unknown as Client));
});

export const getByName = (name: string): Promise<Client | undefined> => new Promise((resolve, reject) => {
  db.get('SELECT * FROM clients WHERE name = ?', [name], (err, row) => err ? reject(err) : resolve(row as unknown as Client));
});

export const create = (data: any): Promise<any> => new Promise((resolve, reject) => {
  const { name, phone } = data;
  db.run(
    `INSERT INTO clients (name,phone) VALUES (?, ?)`,
    [name, phone || ''],
    function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, ...data });
    }
  );
});

export const update = (id: number, data: Partial<Client>): Promise<any> => new Promise((resolve, reject) => {
  const fields = Object.keys(data).map(k => `${k} = ?`).join(', ');
  const values = Object.values(data);
  db.run(`UPDATE clients SET ${fields} WHERE id = ?`, [...values, id], function(err) {
    if (err) reject(err);
    else resolve({ changes: this.changes });
  });
});

export const remove = (id: number): Promise<void> => new Promise((resolve, reject) => {
  db.run('DELETE FROM clients WHERE id = ?', [id], function(err) {
    if (err) reject(err);
    else resolve();
  });
});

