"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newRegalo = exports.fetchRegaliChart = exports.fetchRegali = void 0;
const connection_1 = __importDefault(require("../config/connection"));
const fetchRegali = async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    console.log('fetchRegali');
    var query = "SELECT ks.id_spese, ks.data_ora, ks.spesa, ks.id_tipo, ks.descrizione, ks.tipo_movimento, ks.is_regalo, ks.metodo, IFNULL(r.id_regalo, 0) AS id_regalo, IFNULL(r.mittente_regalo, '') AS mittente_regalo, IFNULL(r.destinatario_regalo, '') AS destinatario_regalo, IFNULL(r.evento, '') AS evento FROM kakebo_spese ks LEFT JOIN regali r on (r.id_spese=ks.id_spese) WHERE is_regalo=1 ORDER BY ks.data_ora ASC";
    try {
        const [rows] = await connection_1.default.query(query);
        // array di rows
        res.status(200).json({ ok: 'true', dati: rows });
        // rows contiene già gli oggetti mappati
    }
    catch (errore) {
        res.status(400).json({ ok: 'false', debug: errore });
        console.log(query);
    }
};
exports.fetchRegali = fetchRegali;
const fetchRegaliChart = async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    console.log('fetchRegaliChart');
    var query = `SELECT year(ks.data_ora) AS anno, round(sum(ks.spesa),2) AS totale, r.is_entry AS regali_ricevuti, count(*) AS quanti
                FROM kakebo.regali r 
                LEFT JOIN kakebo.kakebo_spese ks on ks.id_spese = r.id_spese 
                GROUP BY year(ks.data_ora), r.is_entry`;
    try {
        const [rows] = await connection_1.default.query(query);
        res.status(200).json({ ok: 'true', dati: rows });
    }
    catch (errore) {
        res.status(400).json({ ok: 'false', debug: errore });
        console.log(query);
    }
};
exports.fetchRegaliChart = fetchRegaliChart;
const newRegalo = async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    console.log('newRegalo');
    //{"id_spese": "0", "data": "2024-04-13 00:00:00.000", "spesa":"0", "id_tipo":"16", "descrizione":"Orecchini pandora", "tipo_movimento":"1", "is_regalo":"1", "mittente_regalo":"Rosario Fiorella", "destinatario_regalo": "Sara", "evento": "Laurea"}
    const body = req.body;
    var lastId = 0;
    console.log(body);
    if (body.id_spese == 0) {
        console.log('new spesa');
        var querySpesa = `INSERT INTO kakebo_spese (data_ora, spesa, id_tipo, descrizione, tipo_movimento, is_regalo) VALUES (?, ?, ?, ?, ?, ?)`;
        try {
            const [result1] = await connection_1.default.execute(querySpesa, [body.data, body.spesa, body.id_tipo, body.descrizione, body.tipo_movimento, body.is_regalo]);
            res.status(201).json({ ok: 'true' });
            var queryIndex = `SELECT MAX(id_spese) AS id_regalo FROM kakebo.kakebo_spese`;
            const [newId] = await connection_1.default.query(queryIndex);
            console.log(newId);
            lastId = newId[0].id;
        }
        catch (errore) {
            console.log(querySpesa);
        }
    }
    else {
        lastId = body.id_spese;
    }
    console.log(lastId);
    try {
        if (lastId !== 0) {
            var queryRegalo = `INSERT INTO regali (mittente_regalo, destinatario_regalo, evento, id_spese, id_tipo) VALUES (?, ?, ?, ?, ?)`;
            try {
                const [result2] = await connection_1.default.execute(queryRegalo, [body.mittente_regalo, body.destinatario_regalo, body.evento, lastId, body.id_tipo]);
                res.status(200).json({ ok: 'true' });
            }
            catch (errore) {
                res.status(500).json({ ok: 'false', debug: errore });
            }
        }
        else {
            res.status(200).json({ ok: 'false', debug: `LastId: ${lastId}` });
        }
    }
    catch (errore) {
        res.status(500).json({ ok: 'false', debug: errore });
    }
};
exports.newRegalo = newRegalo;
