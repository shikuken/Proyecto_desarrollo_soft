import { db } from '../config/database';
import { User } from '../models/User';

export const create = (user: User): Promise<any> => new Promise((resolve, reject) => {
  db.run(`INSERT INTO users (username,password,role) VALUES (?, ?, ?)`, [user.username, user.password, user.role || 'OPERATOR'], function(err) {
    if (err) reject(err);
    else resolve({ id: this.lastID, username: user.username, role: user.role });
  });
});

export const findByUsername = (username: string): Promise<User | undefined> => new Promise((resolve, reject) => {
  db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, row) => err ? reject(err) : resolve(row));
});

export const findById = (id: number): Promise<User | undefined> => new Promise((resolve, reject) => {
  db.get(`SELECT id, username, role, createdAt FROM users WHERE id = ?`, [id], (err, row) => err ? reject(err) : resolve(row));
});
