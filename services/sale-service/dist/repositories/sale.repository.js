"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.getAllWithClient = exports.findByIdWithLines = exports.create = void 0;
const database_1 = require("../config/database");
const create = (sale) => new Promise((resolve, reject) => {
    database_1.db.run(`INSERT INTO sales (clientId,number,total) VALUES (?, ?, ?)`, [sale.clientId || null, sale.number, sale.total], function (err) {
        if (err)
            return reject(err);
        const saleId = this.lastID;
        const lines = sale.saleLines || [];
        const insertLine = database_1.db.prepare(`INSERT INTO sale_lines (saleId,productId,qty,price) VALUES (?, ?, ?, ?)`);
        for (const ln of lines) {
            insertLine.run([saleId, ln.productId, ln.qty, ln.price]);
        }
        insertLine.finalize((err2) => {
            if (err2)
                reject(err2);
            else
                resolve({ id: saleId, ...sale });
        });
    });
});
exports.create = create;
const findByIdWithLines = (id) => new Promise((resolve, reject) => {
    database_1.db.get('SELECT * FROM sales WHERE id = ?', [id], (err, sale) => {
        if (err)
            return reject(err);
        database_1.db.all('SELECT * FROM sale_lines WHERE saleId = ?', [id], (err2, lines) => {
            if (err2)
                return reject(err2);
            resolve({ ...sale, saleLines: lines });
        });
    });
});
exports.findByIdWithLines = findByIdWithLines;
const getAllWithClient = () => new Promise((resolve, reject) => {
    database_1.db.all(`SELECT s.id, s.total, s.createdAt, s.clientId
          FROM sales s
          ORDER BY s.id DESC`, [], (err, rows) => err ? reject(err) : resolve(rows));
});
exports.getAllWithClient = getAllWithClient;
const update = (id, data) => new Promise((resolve, reject) => {
    const fields = Object.keys(data).map(k => `${k} = ?`).join(', ');
    const values = Object.values(data);
    database_1.db.run(`UPDATE sales SET ${fields} WHERE id = ?`, [...values, id], function (err) {
        if (err)
            reject(err);
        else
            resolve({ changes: this.changes });
    });
});
exports.update = update;
const remove = (id) => new Promise((resolve, reject) => {
    database_1.db.serialize(() => {
        database_1.db.run('DELETE FROM sale_lines WHERE saleId = ?', [id], function (err) {
            if (err)
                return reject(err);
            database_1.db.run('DELETE FROM sales WHERE id = ?', [id], function (err2) {
                if (err2)
                    reject(err2);
                else
                    resolve({ ok: true });
            });
        });
    });
});
exports.remove = remove;
