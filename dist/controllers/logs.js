"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newLog = exports.fetchLogs = void 0;
const connection_1 = __importDefault(require("../config/connection"));
const fetchLogs = async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    console.log('fetchLogs');
    const query = "SELECT id, data_ora, commento FROM logs";
    try {
        const [rows] = await connection_1.default.query(query);
        //array di rows
        res.status(200).json({ ok: 'true', dati: rows });
        // rows contiene già gli oggetti mappati
    }
    catch (errore) {
        console.error("Errore durante fetchLogs:", query, errore);
        res.status(500).json({
            ok: 'false',
            debug: errore instanceof Error ? errore.message : errore
        });
    }
};
exports.fetchLogs = fetchLogs;
const newLog = async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    console.log('newLog');
    const body = req.body;
    const query = `INSERT INTO logs (data_ora, commento) VALUES (?, ?)`;
    try {
        await connection_1.default.execute(query, [body.data_ora, body.commento]);
        res.status(201).json({ ok: 'true' });
    }
    catch (errore) {
        console.error("Errore durante newLog:", errore);
        res.status(500).json({
            ok: 'false',
            debug: errore instanceof Error ? errore.message : errore
        });
    }
};
exports.newLog = newLog;
