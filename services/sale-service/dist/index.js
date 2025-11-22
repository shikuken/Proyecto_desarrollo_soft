"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const database_1 = require("./config/database");
const sale_routes_1 = __importDefault(require("./routes/sale.routes"));
(0, database_1.initDatabase)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
app.use('/sales', sale_routes_1.default);
const port = process.env.PORT || 4003;
app.listen(Number(port), () => console.log(`Sale service running on port ${port}`));
exports.default = app;
