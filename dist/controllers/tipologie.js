"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newTipo = exports.fetchTipi = void 0;
const connection_1 = __importDefault(require("../config/connection"));
const fetchTipi = async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    console.log('fetchTipi');
    const query = "SELECT ks.* FROM kakebo_tipi ks";
    try {
        const [rows] = await connection_1.default.query(query);
        // awway di rows
        res.status(200).json({ ok: 'true', dati: rows });
        // rows contiene oggetti mappati
    }
    catch (errore) {
        console.error("Errore durante fetchTipi:", query, errore);
        res.status(500).json({
            ok: 'false',
            debug: errore instanceof Error ? errore.message : errore
        });
    }
};
exports.fetchTipi = fetchTipi;
const newTipo = async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    console.log('newTipo');
    var body = req.body;
    var query = `INSERT INTO kakebo_tipi (tipo, descrizione) VALUES (?, ?)`;
    try {
        await connection_1.default.execute(query, [body.tipo, body.descrizione]);
        res.status(201).json({ ok: 'true' });
    }
    catch (errore) {
        console.error("Errore durante newTipo:", errore);
        res.status(500).json({
            ok: 'false',
            debug: errore instanceof Error ? errore.message : errore
        });
    }
};
exports.newTipo = newTipo;
