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
    // Ensure autoincrement sequence starts at 1 when table is empty
    const resetSeqIfEmpty = (table: string) => {
      db.get(`SELECT COUNT(*) as c FROM ${table}`, [], (err, row: any) => {
        if (err) return;
        if ((row?.c ?? 0) === 0) {
          db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='sqlite_sequence'", [], (err2, r2: any) => {
            if (!err2 && r2) {
              db.run('DELETE FROM sqlite_sequence WHERE name = ?', [table], () => {});
            }
          });
        }
      });
    };

    resetSeqIfEmpty('clients');
  });
};
