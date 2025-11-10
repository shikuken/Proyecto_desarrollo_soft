import { db } from '../config/database';
import { Client } from '../models/Client';

export const getAll = (): Promise<Client[]> => new Promise((resolve, reject) => {
  db.all('SELECT * FROM clients', [], (err, rows) => err ? reject(err) : resolve(rows));
});

export const getById = (id: number): Promise<Client | undefined> => new Promise((resolve, reject) => {
  db.get('SELECT * FROM clients WHERE id = ?', [id], (err, row) => err ? reject(err) : resolve(row));
});

export const getByNIT = (nit: string): Promise<Client | undefined> => new Promise((resolve, reject) => {
  db.get('SELECT * FROM clients WHERE nit = ?', [nit], (err, row) => err ? reject(err) : resolve(row));
});

export const create = (data: Client): Promise<Client> => new Promise((resolve, reject) => {
  const { nit, name, contact, email, phone, address } = data;
  db.run(
    `INSERT INTO clients (nit,name,contact,email,phone,address) VALUES (?, ?, ?, ?, ?, ?)`,
    [nit, name, contact, email, phone, address],
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
