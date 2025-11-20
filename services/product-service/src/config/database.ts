import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();
                                                                                                                                                                                                                                                                                                                                      
sqlite3.verbose();

const dbPath = path.resolve(process.cwd(), process.env.DB_PATH || './data/products.sqlite');
const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('SQLite connection error (products):', err.message);
  else console.log('Connected to SQLite (products) at', dbPath);
});

export const initDatabase = () => {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      price REAL DEFAULT 0,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )`);
  });
};
