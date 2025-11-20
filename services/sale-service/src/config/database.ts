import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

sqlite3.verbose();

const dbPath = path.resolve(process.cwd(), process.env.DB_PATH || './data/sales.sqlite');
const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('SQLite connection error (sales):', err.message);
  else console.log('Connected to SQLite (sales) at', dbPath);
});

export const initDatabase = () => {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      clientId INTEGER,
      number TEXT UNIQUE,
      total REAL,
      confirmed INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      confirmedAt TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS sale_lines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      saleId INTEGER,
      productId INTEGER,
      qty INTEGER,
      price REAL,
      discount REAL DEFAULT 0
    )`);

  });
};
