"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchSpeseViaggio = exports.deleteViaggio = exports.newViaggio = exports.fetchViaggi = void 0;
const connection_1 = __importDefault(require("../config/connection"));
const moment_1 = __importDefault(require("moment"));
const fetchViaggi = async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    console.log('fetchViaggi');
    const query = "SELECT * FROM viaggi ORDER BY da_quando ASC";
    try {
        const [rows] = await connection_1.default.query(query);
        // array di rows
        res.status(200).json({ ok: 'true', dati: rows });
    }
    catch (errore) {
        console.error("Errore durante newLog:", errore);
        res.status(500).json({
            ok: 'false',
            debug: errore instanceof Error ? errore.message : errore
        });
    }
};
exports.fetchViaggi = fetchViaggi;
const newViaggio = async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    console.log('newViaggio');
    var body = req.body;
    var data_da = "";
    var data_a = "";
    if (body.data_da !== undefined) {
        data_da = (0, moment_1.default)(body.data_da, 'ddd MMM DD HH:mm:ss z YYYY')
            .utcOffset(60)
            .add(1, 'days')
            .format('YYYY-MM-DD');
    }
    if (body.data_a !== undefined) {
        data_a = (0, moment_1.default)(body.data_a, 'ddd MMM DD HH:mm:ss z YYYY')
            .utcOffset(60)
            .add(1, 'days')
            .format('YYYY-MM-DD');
    }
    const query = `INSERT INTO viaggi (da_quando, a_quando, descrizione) VALUES (?, ?, ?)`;
    try {
        await connection_1.default.execute(query, [data_da, data_a, body.descrizione]);
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
exports.newViaggio = newViaggio;
const deleteViaggio = async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    console.log('deleteViaggio');
    const query = `DELETE FROM viaggi WHERE id_viaggio = ? `;
    try {
        const [result] = await connection_1.default.execute(query, [req.body.id]);
        res.status(200).json({ ok: 'true' });
    }
    catch (errore) {
        console.error("Errore durante newLog:", errore);
        res.status(500).json({
            ok: 'false',
            debug: errore instanceof Error ? errore.message : errore
        });
    }
};
exports.deleteViaggio = deleteViaggio;
const fetchSpeseViaggio = async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    console.log('fetchSpeseViaggio');
    var body = req.body;
    console.log(body);
    if (body === undefined) {
        res.status(400).json({ ok: 'false', dati: [] });
        console.log(res);
        return;
    }
    const query = `SELECT ks.id_spese AS id_spesa, ks.descrizione AS descrizione_spesa, ks.*, kt.tipo AS descrizione_tipo 
                FROM kakebo.kakebo_spese ks 
                JOIN kakebo.viaggi v ON ( v.id_viaggio = ${body.id_viaggio} )
                LEFT JOIN kakebo.kakebo_tipi kt ON ( kt.id_tipo = ks.id_tipo )
                WHERE ks.data_ora >= v.da_quando AND ks.data_ora <= DATE_ADD(v.a_quando, INTERVAL 1 DAY)
                UNION 
                SELECT ks.id_spese AS id_spesa, ks.descrizione AS descrizione_spesa, ks.*, kt.tipo AS descrizione_tipo 
                FROM kakebo.kakebo_spese ks 
                LEFT JOIN kakebo.kakebo_tipi kt ON ( kt.id_tipo = ks.id_tipo )
                WHERE ks.id_viaggio  = ${body.id_viaggio} 
                ORDER BY data_ora ASC`;
    try {
        console.log('fooooooo');
        console.log(query);
        const [rows] = await connection_1.default.query(query);
        console.log(rows);
        res.status(200).json({ ok: 'true', dati: rows });
    }
    catch (errore) {
        console.error("Errore durante newLog:", errore);
        res.status(500).json({
            ok: 'false',
            debug: errore instanceof Error ? errore.message : errore
        });
    }
};
exports.fetchSpeseViaggio = fetchSpeseViaggio;
