"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSpesa = exports.newSpesa = exports.fetchSpeseChart = exports.fetchSpeseGroup = exports.fetchSpese = void 0;
const connection_1 = __importDefault(require("../config/connection"));
const moment_1 = __importDefault(require("moment"));
const composeQuery = (req, group) => {
    // id_spese
    // data_ora
    // spesa
    // id_tipo
    // descrizione
    // tipo_movimento
    let idSpese = req.query.id_spese;
    let tipoMovimento = req.query.tipo_movimento;
    let descrizione = req.query.descrizione;
    let idTipo = req.query.id_tipo;
    let descrizioneTipo = req.query.descrizione_tipo;
    let dataDa = req.query.data_da;
    let dataA = req.query.data_a;
    let dataOraDa;
    let dataOraA;
    var query = "";
    if (group) {
        query = `SELECT ks.id_tipo, SUM(ks.spesa) AS spesa, ks.tipo_movimento 
        FROM kakebo_spese ks 
        LEFT JOIN kakebo_tipi ON (kt.id_tipo=ks.id_tipo `;
    }
    else {
        query = `SELECT ks.*, kt.tipo AS descrizione_tipo 
        FROM kakebo_spese ks 
        LEFT JOIN kakebo_tipi kt ON(kt.id_tipo = ks.id_tipo) `;
    }
    var condition = "";
    if (idSpese !== undefined) {
        condition += `ks.id_spese = "${idSpese}"`;
    }
    if (tipoMovimento !== undefined) {
        condition += condition !== "" ? " AND " : "";
        condition += `ks.tipo_movimento = "${tipoMovimento}"`;
    }
    if (descrizione !== undefined && descrizione !== "") {
        condition += condition !== "" ? " AND " : "";
        condition += `ks.descrizione LIKE "%${descrizione}%"`;
    }
    if (idTipo !== undefined) {
        condition += condition !== "" ? " AND " : "";
        condition += `ks.id_tipo = "${idTipo}"`;
    }
    if (descrizioneTipo !== undefined && String(descrizioneTipo).trim() !== "") {
        condition += condition !== "" ? " AND " : "";
        condition += `kt.tipo LIKE  "%${descrizioneTipo}%"`;
    }
    if (dataDa !== undefined) {
        condition += condition !== "" ? " AND " : "";
        dataOraDa = new Date(String(dataDa));
        condition += `ks.data_ora >= "${(0, moment_1.default)(String(dataDa)).utcOffset(60).format('YYYY-MM-DD')}"`;
    }
    if (dataA !== undefined) {
        condition += condition !== "" ? " AND " : "";
        dataOraA = new Date(String(dataA));
        condition += `ks.data_ora <= "${(0, moment_1.default)(String(dataA)).utcOffset(60).format('YYYY-MM-DD')}"`;
    }
    if (condition !== "") {
        query += ` WHERE ${condition}`;
    }
    if (group) {
        query += " GROUP BY ks.id_tipo, ks.tipo_movimento ORDER BY ks.id_tipo ASC";
    }
    else {
        query += " ORDER BY data_ora ASC";
    }
    console.log(query);
    return query;
};
const fetchSpeseGroup = async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    console.log('fetchSpeseGroup');
    const query = composeQuery(req, true);
    try {
        const [rows] = await connection_1.default.query(query);
        //array di rows
        res.status(200).json({ ok: 'true', dati: rows });
    }
    catch (errore) {
        res.status(500).json({
            ok: 'false',
            debug: errore instanceof Error ? errore.message : errore
        });
        console.log(query);
    }
};
exports.fetchSpeseGroup = fetchSpeseGroup;
const fetchSpese = async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    console.log('fetchSpese');
    const query = composeQuery(req, false);
    try {
        const [rows] = await connection_1.default.query(query);
        const result = rows.map(row => ({
            id_spesa: row.id_spese,
            data_ora: (0, moment_1.default)(row.data_ora).utcOffset(120).toDate(),
            spesa: row.spesa,
            descrizione_spesa: row.descrizione,
            id_tipo: row.id_tipo,
            descrizione_tipo: row.descrizione_tipo,
            tipo_movimento: row.tipo_movimento,
            is_regalo: row.is_regalo,
            metodo: row.metodo,
            prezzo_pieno: row.prezzo_pieno,
            sconto: row.sconto,
            id_viaggio: row.id_viaggio
        }));
        console.log(result);
        res.status(200).json({ ok: 'true', dati: result });
        //result.push({ id_spesa: rows[i].id_spese, data_ora: moment(rows[i].data_ora).utcOffset(120), spesa: rows[i].spesa, descrizione_spesa: rows[i].descrizione, id_tipo: rows[i].id_tipo, descrizione_tipo: rows[i].descrizione_tipo, tipo_movimento: rows[i].tipo_movimento, is_regalo: rows[i].is_regalo, metodo: rows[i].metodo, prezzo_pieno: rows[i].prezzo_pieno, sconto: rows[i].sconto, id_viaggio: rows[i].id_viaggio })
    }
    catch (errore) {
        console.error("Errore durante fetchSpese:", query, errore);
        res.status(500).json({
            ok: 'false',
            debug: errore instanceof Error ? errore.message : errore
        });
    }
};
exports.fetchSpese = fetchSpese;
const newSpesa = async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    console.log('newSpesa');
    //{"id":0, "data": "2024-04-13 21:00:00.000", "spesa": "72.0", "id_tipo": "10", "descrizione": "", "tipo_movimento": "0", "is_regalo":"0", "metodo":"0" }
    const body = req.body;
    const query = `INSERT INTO kakebo_spese (id_spese, data_ora, spesa, id_tipo, descrizione, tipo_movimento, is_regalo, metodo, prezzo_pieno, sconto) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
    ON DUPLICATE KEY UPDATE data_ora=VALUES(data_ora), spesa=VALUES(spesa), id_tipo=VALUES(id_tipo), descrizione=VALUES(descrizione), tipo_movimento=VALUES(tipo_movimento), is_regalo=VALUES(is_regalo), metodo=VALUES(metodo), prezzo_pieno=VALUES(prezzo_pieno), sconto=VALUES(sconto)`;
    console.log(query);
    try {
        const [result] = await connection_1.default.execute(query, [body.id_spesa, body.data_ora, body.spesa, body.id_tipo, body.descrizione_spesa, body.tipo_movimento, body.is_regalo, body.metodo, body.prezzo_pieno, body.sconto]);
        res.status(201).json({ ok: 'true' });
    }
    catch (errore) {
        console.error("Errore durante newSpesa:", query, errore);
        res.status(500).json({
            ok: 'false',
            debug: errore instanceof Error ? errore.message : errore
        });
    }
};
exports.newSpesa = newSpesa;
const deleteSpesa = async (req, res) => {
    console.log('deleteSpesa');
    res.set('Access-Control-Allow-Origin', '*');
    //{ "id": "4" }
    var body = req.body;
    try {
        var query = `DELETE FROM regali WHERE id_spese = ?`;
        const [del1] = await connection_1.default.execute(query, [body.id]);
        query = `DELETE FROM kakebo_spese WHERE id_spese = ?`;
        const [del2] = await connection_1.default.execute(query, [body.id]);
        res.status(200).json({ ok: 'true' });
    }
    catch (errore) {
        console.error("Errore durante deleteSpesa:", errore);
        res.status(500).json({
            ok: 'false',
            debug: errore instanceof Error ? errore.message : errore
        });
    }
};
exports.deleteSpesa = deleteSpesa;
const fetchSpeseChart = async (req, res) => {
    console.log('fetchSpeseChart');
    res.set('Access-Control-Allow-Origin', '*');
    var seiMesi = new Date();
    seiMesi.setMonth(seiMesi.getMonth() - 5);
    var treMesi = new Date();
    treMesi.setMonth(treMesi.getMonth() - 2);
    var lista = new Map();
    var results = [];
    var entrate = [];
    var uscite = [];
    var risparmio = [];
    var labels = [];
    var mediaEntrate = 0;
    var mediaUscite = 0;
    var mediaRisparmi = 0;
    var mediaEntrate03 = 0;
    var mediaUscite03 = 0;
    var mediaRisparmi03 = 0;
    const query = `SELECT year(data_ora) AS year, month(data_ora) AS month, ROUND(SUM(spesa),2) AS somma, tipo_movimento
FROM kakebo.kakebo_spese ks GROUP BY tipo_movimento, year(data_ora), month(data_ora)
ORDER BY year(data_ora), month(data_ora), tipo_movimento`;
    try {
        const [rows] = await connection_1.default.query(query);
        for (const row of rows) {
            const chiaveData = row.month + "/" + row.year;
            const movimento = row.tipo_movimento;
            const totale = Number(row.somma);
            if (!lista.has(chiaveData)) {
                lista.set(chiaveData, { entrate: 0, uscite: 0 });
                labels.push(chiaveData);
            }
            const dataCorrente = lista.get(chiaveData);
            if (movimento == 1) {
                dataCorrente.entrate += totale;
            }
            else if (movimento == 0) {
                dataCorrente.uscite += totale;
            }
        }
        let contaDodici = 0;
        let contaTre = 0;
        for (const [chiaveMese, datiMese] of lista) {
            let chiave = chiaveMese.split("/");
            let mese = Number(chiave[0]);
            let anno = Number(chiave[1]);
            entrate.push(datiMese.entrate);
            uscite.push(datiMese.uscite);
            let risp = 0;
            if (datiMese.entrate > 0) {
                risp = (datiMese.entrate - datiMese.uscite);
            }
            risparmio.push(Number(risp.toFixed(1)));
            if (anno >= seiMesi.getFullYear() && mese > seiMesi.getMonth()) {
                // ultimi 3 mesi
                mediaEntrate03 += datiMese.entrate;
                mediaUscite03 += datiMese.uscite;
                mediaRisparmi03 += risp;
                contaTre++;
                console.log("ultimi 3 mesi", mediaUscite03, mediaRisparmi03);
            }
            else {
                mediaEntrate += datiMese.entrate;
                mediaUscite += datiMese.uscite;
                mediaRisparmi += risp;
                contaDodici += 1;
                console.log("3 mesi precedenti", mediaUscite, mediaRisparmi);
            }
        }
        // Calcolo medie
        //let avgEntry12 = contaDodici !== 0 ? (mediaEntrate / contaDodici) : 0
        //let avgEntry03 = contaTre !== 0 ? (mediaEntrate03 / contaTre) : 0
        //let prcEntry = avgEntry12 !== 0 ? ((avgEntry03 - avgEntry12) / avgEntry12) * 100 : 0
        let avgExit12 = contaDodici !== 0 ? (mediaUscite / contaDodici) : 0;
        let avgExit03 = contaTre !== 0 ? (mediaUscite03 / contaTre) : 0;
        let prcExit = avgExit12 !== 0 ? ((avgExit03 - avgExit12) / avgExit12) * 100 : 0;
        let avgRisp12 = contaDodici !== 0 ? (mediaRisparmi / contaDodici) : 0;
        let avgRisp03 = contaTre !== 0 ? (mediaRisparmi03 / contaTre) : 0;
        let prcRisparmi = avgRisp12 !== 0 ? ((avgRisp03 - avgRisp12) / avgRisp12) * 100 : 0;
        const chartData = {
            entry: entrate,
            exit: uscite,
            savings: risparmio,
            etichette: labels,
            kpi_uscite: {
                titolo: "Expenses",
                media: avgExit03.toFixed(1),
                media_precedente: avgExit12.toFixed(1),
                percentuale: prcExit.toFixed(1)
            },
            kpi_risparmi: {
                titolo: "Savings",
                media: avgRisp03.toFixed(1),
                media_precedente: avgRisp12.toFixed(1),
                percentuale: prcRisparmi.toFixed(1)
            }
        };
        results.push(chartData);
        console.log(results);
        res.status(200).json({ ok: 'true', dati: results });
    }
    catch (errore) {
        res.status(500).json({
            ok: 'false',
            debug: errore instanceof Error ? errore.message : errore
        });
        console.log(query);
    }
};
exports.fetchSpeseChart = fetchSpeseChart;
