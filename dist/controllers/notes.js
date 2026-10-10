"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNote = exports.newNote = exports.fetchNotes = void 0;
const connection_1 = __importDefault(require("../config/connection"));
const fetchNotes = async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    console.log('fetchNotes');
    const query = 'SELECT id, descrizione, ultima_modifica FROM notes ORDER BY ultima_modifica DESC';
    try {
        const [rows] = await connection_1.default.query(query);
        res.status(200).json({ ok: 'true', dati: rows });
    }
    catch (errore) {
        console.error("Errore durante fetchNotes:", errore);
        res.status(500).json({
            ok: 'false',
            debug: errore instanceof Error ? errore.message : errore
        });
    }
};
exports.fetchNotes = fetchNotes;
const newNote = async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    console.log('newNote');
    try {
        var body = req.body;
        console.log(body);
        if (!body || // undefined o null
            Object.keys(body).length === 0 || // oggetto vuoto
            !body.descrizione ||
            !body.data) {
            res.status(400).json({ ok: 'false' });
            return;
        }
        var query = `INSERT INTO notes (descrizione, ultima_modifica) VALUES (?, ?);`; // (${body.descrizione}, ${body.data})`
        const [result] = await connection_1.default.query(query, [body.descrizione, body.data]);
        res.status(200).json({ ok: 'true' });
    }
    catch (errore) {
        console.error("Errore durante newNote:", errore);
        res.status(500).json({
            ok: 'false',
            debug: errore instanceof Error ? errore.message : errore
        });
    }
};
exports.newNote = newNote;
const deleteNote = async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    console.log('deleteNote');
    const query = `DELETE FROM notes WHERE id = ?`;
    try {
        const [result] = await connection_1.default.execute(query, [req.body.id]);
        res.status(200).json({ ok: 'true' });
    }
    catch (errore) {
        console.error("Errore durante deleteNote:", errore);
        res.status(500).json({
            ok: 'false',
            debug: errore instanceof Error ? errore.message : errore
        });
    }
};
exports.deleteNote = deleteNote;
