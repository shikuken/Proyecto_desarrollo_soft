"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.list = exports.findByIdWithLines = exports.confirm = exports.create = void 0;
const repo = __importStar(require("../repositories/sale.repository"));
const create = (data) => repo.create(data).then(s => { return s; });
exports.create = create;
const confirm = (id, userId) => { throw new Error('Confirm not implemented in microservice skeleton'); };
exports.confirm = confirm;
const findByIdWithLines = (id) => repo.findByIdWithLines(id);
exports.findByIdWithLines = findByIdWithLines;
const list = () => repo.getAllWithClient();
exports.list = list;
const update = async (id, data) => {
    const r = await repo.update(id, data);
    return r;
};
exports.update = update;
const remove = async (id) => {
    const r = await repo.remove(id);
    return r;
};
exports.remove = remove;
