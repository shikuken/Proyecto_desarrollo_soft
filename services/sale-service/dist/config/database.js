"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDatabase = exports.db = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
sqlite3_1.default.verbose();
const dbPath = path_1.default.resolve(process.cwd(), process.env.DB_PATH || './data/sales.sqlite');
const dir = path_1.default.dirname(dbPath);
if (!fs_1.default.existsSync(dir))
    fs_1.default.mkdirSync(dir, { recursive: true });
exports.db = new sqlite3_1.default.Database(dbPath, (err) => {
    if (err)
        console.error('SQLite connection error (sales):', err.message);
    else
        console.log('Connected to SQLite (sales) at', dbPath);
});
const initDatabase = () => {
    exports.db.serialize(() => {
        exports.db.run(`CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      clientId INTEGER,
      number TEXT UNIQUE,
      total REAL,
      confirmed INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      confirmedAt TEXT
    )`);
        exports.db.run(`CREATE TABLE IF NOT EXISTS sale_lines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      saleId INTEGER,
      productId INTEGER,
      qty INTEGER,
      price REAL,
      discount REAL DEFAULT 0
    )`);
        // Ensure autoincrement sequences start at 1 when table is empty
        const resetSeqIfEmpty = (table) => {
            exports.db.get(`SELECT COUNT(*) as c FROM ${table}`, [], (err, row) => {
                var _a;
                if (err)
                    return;
                if (((_a = row === null || row === void 0 ? void 0 : row.c) !== null && _a !== void 0 ? _a : 0) === 0) {
                    exports.db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='sqlite_sequence'", [], (err2, r2) => {
                        if (!err2 && r2) {
                            exports.db.run('DELETE FROM sqlite_sequence WHERE name = ?', [table], () => { });
                        }
                    });
                }
            });
        };
        resetSeqIfEmpty('sales');
        resetSeqIfEmpty('sale_lines');
    });
};
exports.initDatabase = initDatabase;
