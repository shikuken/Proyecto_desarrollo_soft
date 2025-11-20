import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

sqlite3.verbose();

const dbPath = path.resolve(process.cwd(), process.env.DB_PATH || './data/clients.sqlite');
const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('SQLite connection error (clients):', err.message);
  else console.log('Connected to SQLite (clients) at', dbPath);
});

export const initDatabase = () => {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      phone TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )`);
  });
};
