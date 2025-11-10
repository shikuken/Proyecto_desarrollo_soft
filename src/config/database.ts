import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import { config } from './env';

sqlite3.verbose();

const dbPath = path.resolve(process.cwd(), config.DB_PATH || 'database.sqlite');

const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('SQLite connection error:', err.message);
  else console.log('Connected to SQLite at', dbPath);
});

export const initDatabase = () => {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT DEFAULT 'OPERATOR',
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nit TEXT UNIQUE,
      name TEXT,
      contact TEXT,
      email TEXT,
      phone TEXT,
      address TEXT,
      active INTEGER DEFAULT 1,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sku TEXT UNIQUE,
      name TEXT,
      category TEXT,
      cost REAL DEFAULT 0,
      price REAL DEFAULT 0,
      unit TEXT,
      stockMin INTEGER DEFAULT 0,
      stock INTEGER DEFAULT 0,
      active INTEGER DEFAULT 1,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      clientId INTEGER,
      number TEXT UNIQUE,
      total REAL,
      confirmed INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      confirmedAt TEXT,
      FOREIGN KEY (clientId) REFERENCES clients(id)
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS sale_lines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      saleId INTEGER,
      productId INTEGER,
      qty INTEGER,
      price REAL,
      discount REAL DEFAULT 0,
      FOREIGN KEY (saleId) REFERENCES sales(id),
      FOREIGN KEY (productId) REFERENCES products(id)
    )`);
    });
};
