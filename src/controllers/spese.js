const conn = require('../config/connection')
const moment = require('moment')

const composeQuery = (req, group) => {

    // id_spese
    // data_ora
    // spesa
    // id_tipo
    // descrizione
    // tipo_movimento
    let idSpese = req.query.id_spese
    let tipoMovimento = req.query.tipo_movimento
    let descrizione = req.query.descrizione
    let idTipo = req.query.id_tipo
    let descrizioneTipo = req.query.descrizione_tipo
    let dataDa = req.query.data_da
    let dataA = req.query.data_a
    var query = ""
    if (group) {
        query = "SELECT ks.id_tipo, SUM(ks.spesa) AS spesa, ks.tipo_movimento FROM kakebo_spese ks LEFT JOIN kakebo_tipi ON (kt.id_tipo=ks.id_tipo) "
    } else {
        query = "SELECT ks.*, kt.tipo AS descrizione_tipo FROM kakebo_spese ks LEFT JOIN kakebo_tipi kt ON (kt.id_tipo=ks.id_tipo) "
    }
    var condition = ""
    if (idSpese !== undefined) {
        condition += `ks.id_spese = "${idSpese}"`
    }
    if (tipoMovimento !== undefined) {
        condition += condition !== "" ? " AND " : ""
        condition += `ks.tipo_movimento = "${tipoMovimento}"`
    }
    if (descrizione !== undefined) {
        condition += condition !== "" ? " AND " : ""
        condition += `ks.descrizione LIKE "%${descrizione}%"`
    }
    if (idTipo !== undefined) {
        condition += condition !== "" ? " AND " : ""
        condition += `ks.id_tipo = "${idTipo}"`
    }
    if (descrizioneTipo !== undefined) {
        condition += condition !== "" ? " AND " : ""
        condition += `kt.tipo LIKE  "%${descrizioneTipo}%"`
    }
    if (dataDa !== undefined) {
        condition += condition !== "" ? " AND " : ""
        dataDa = new Date(dataDa)
        condition += `ks.data_ora >= "${moment(dataDa).utcOffset(60).format('YYYY-MM-DD')}"`
    }
    if (dataA !== undefined) {
        condition += condition !== "" ? " AND " : ""
        dataA = new Date(dataA)
        condition += `ks.data_ora <= "${moment(dataA).utcOffset(60).format('YYYY-MM-DD')}"`
    }
    if (condition !== "") {
        query += ` WHERE ${condition}`
    }
    if (group) {
        query += " GROUP BY ks.id_tipo, ks.tipo_movimento ORDER BY ks.id_tipo ASC"
    } else {
        query += " ORDER BY data_ora ASC"
    }
    console.log(query)
    return query
}

const fetchSpeseGroup = (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')
    console.log('fetchSpeseGroup')
    let query = composeQuery(req, true)
    try {
        conn.query(query, (err, rows, fields) => {
            if (rows == undefined) throw err

            if (rows.length >= 1) {
                var result = [];
                for (let i = 0; i < rows.length; i++) {
                    result.push({ spesa: rows[i].spesa, id_tipo: rows[i].id_tipo, descrizione_tipo: rows[i].descrizione_tipo, tipo_movimento: rows[i].tipo_movimento })
                }
                res.status(200).json({ ok: 'true', dati: result })
            } else {
                res.status(200).json({ ok: 'true', dati: [] })
            }
        })

    } catch (errore) {
        res.status(500).json({ ok: 'false', debug: errore })
        console.log(query)
    }
}

const fetchSpese = (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')
    console.log('fetchSpese')
    let query = composeQuery(req, false)

    try {
        conn.query(query, (err, rows, fields) => {
            if (rows == undefined) throw err

            if (rows.length >= 1) {
                var result = [];
                for (let i = 0; i < rows.length; i++) {
                    result.push({ id_spesa: rows[i].id_spese, data_ora: moment(rows[i].data_ora).utcOffset(120), spesa: rows[i].spesa, descrizione_spesa: rows[i].descrizione, id_tipo: rows[i].id_tipo, descrizione_tipo: rows[i].descrizione_tipo, tipo_movimento: rows[i].tipo_movimento, is_regalo: rows[i].is_regalo, metodo: rows[i].metodo, prezzo_pieno: rows[i].prezzo_pieno, sconto: rows[i].sconto })
                }
                res.status(200).json({ ok: 'true', dati: result })
            } else {
                res.status(200).json({ ok: 'true', dati: [] })
            }
        })

    } catch (errore) {
        res.status(500).json({ ok: 'false', debug: errore })
    }
}

const newSpesa = (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')
    console.log('newSpesa')

    //{"id":0, "data": "2024-04-13 21:00:00.000", "spesa": "72.0", "id_tipo": "10", "descrizione": "", "tipo_movimento": "0", "is_regalo":"0", "metodo":"0" }
    var body = req.body
    var query = `INSERT INTO kakebo_spese (id_spese, data_ora, spesa, id_tipo, descrizione, tipo_movimento, is_regalo, metodo, prezzo_pieno, sconto) 
    VALUES ("${body.id}", "${body.data}", "${body.spesa}", "${body.id_tipo}", "${body.descrizione}", "${body.tipo_movimento}", "${body.is_regalo}", "${body.metodo}", "${body.prezzo_pieno}", "${body.sconto}") 
    ON DUPLICATE KEY UPDATE data_ora="${body.data}", spesa="${body.spesa}", id_tipo="${body.id_tipo}", descrizione="${body.descrizione}", tipo_movimento="${body.tipo_movimento}", is_regalo="${body.is_regalo}", metodo="${body.metodo}", prezzo_pieno="${body.prezzo_pieno}", sconto="${body.sconto}"`
    console.log(query)
    try {
        conn.query(query, (err, rows, fields) => {

            if (err) {
                console.log(err)
                res.status(400).json({ ok: 'false' })
            } else {
                res.status(201).json({ ok: 'true' })
            }
        })
    } catch (errore) {
        res.status(500).json({ ok: 'false', debug: errore })
        console.log(query)
    }
}

const deleteSpesa = (req, res) => {
    console.log('deleteSpesa')
    res.set('Access-Control-Allow-Origin', '*')
    //{ "id": "4" }
    var body = req.body
    var query = `DELETE FROM regali WHERE id_spese = "${body.id}"`

    try {
        conn.query(query, (err, rows, fields) => {
            if (err) {
                console.log(err)
            }
        })

        query = `DELETE FROM kakebo_spese WHERE id_spese = "${body.id}"`
        conn.query(query, (err, rows, fields) => {

            if (err) {
                console.log(err)
                res.status(400).json({ ok: 'false' })
            } else {
                res.status(200).json({ ok: 'true' })
            }
        })
    } catch (errore) {
        res.status(500).json({ ok: 'false', debug: errore })
        console.log(query)
    }

}

const fetchSpeseChart = (req, res) => {
    console.log('fetchSpeseChart')
    res.set('Access-Control-Allow-Origin', '*')

    var seiMesi = new Date()
    seiMesi.setMonth(seiMesi.getMonth() - 5)
    var treMesi = new Date()
    treMesi.setMonth(treMesi.getMonth() - 2)
    var lista = new Map
    var results = []
    var entrate = []
    var uscite = []
    var risparmio = []
    var labels = []
    var mediaEntrate = 0
    var mediaUscite = 0
    var mediaRisparmi = 0
    var mediaEntrate03 = 0
    var mediaUscite03 = 0
    var mediaRisparmi03 = 0


    var query = `SELECT year(data_ora) AS year, month(data_ora) AS month, ROUND(SUM(spesa),2) AS somma, tipo_movimento
FROM kakebo.kakebo_spese ks GROUP BY tipo_movimento, year(data_ora), month(data_ora)
ORDER BY year(data_ora), month(data_ora), tipo_movimento`

    try {
        conn.query(query, (err, rows, fields) => {

            if (err) {
                console.log(err)
                res.status(400).json({ ok: 'false', dati: [] })
            } else {

                for (let i = 0; i < rows.length; i++) {
                    // TODO: capire se is_regalo può influire nella condizione

                    let chiaveData = rows[i].month + "/" + rows[i].year
                    let movimento = rows[i].tipo_movimento
                    let totale = rows[i].somma

                    if (!lista.has(chiaveData)) {
                        lista.set(chiaveData, { entrate: 0, uscite: 0 });
                        labels.push(chiaveData);
                    }
                    let dataCorrente = lista.get(chiaveData)

                    if (movimento == 1) {
                        dataCorrente.entrate += totale
                    } else if (movimento == 0) {
                        dataCorrente.uscite += totale
                    }
                }

                let risp = 0
                let contaDodici = 0
                let contaTre = 0
                for (const [chiaveMese, datiMese] of lista) {
                    let chiave = chiaveMese.split("/")
                    let mese = chiave[0]
                    let anno = chiave[1]

                    entrate.push(datiMese.entrate)
                    uscite.push(datiMese.uscite)
                    risp = datiMese.entrate - datiMese.uscite
                    if (datiMese.entrate > 0) {
                        risp = (datiMese.entrate - datiMese.uscite)
                    } else {
                        risp = 0
                    }
                    risparmio.push(risp.toFixed(1))

                    // andamento 3 mesi precedenti mesi
                    if (anno >= seiMesi.getFullYear() && mese > seiMesi.getMonth()) {
                        // andamento ultimi 3 mesi
                        if (anno >= treMesi.getFullYear() && mese > treMesi.getMonth()) {
                            mediaEntrate03 += datiMese.entrate
                            mediaUscite03 += datiMese.uscite
                            mediaRisparmi03 += risp
                            contaTre += 1

                            console.log("ultimi 3 mesi", mediaUscite03, mediaRisparmi03)
                        } else {
                            // 3 mesi precedenti
                            mediaEntrate += datiMese.entrate
                            mediaUscite += datiMese.uscite
                            mediaRisparmi += risp
                            contaDodici += 1

                            console.log("3 mesi precedenti", mediaUscite, mediaRisparmi)
                        }
                    } 
                }
 
                //let avgEntry12 = contaDodici !== 0 ? (mediaEntrate / contaDodici) : 0
                //let avgEntry03 = contaTre !== 0 ? (mediaEntrate03 / contaTre) : 0
                //let prcEntry = avgEntry12 !== 0 ? ((avgEntry03 - avgEntry12) / avgEntry12) * 100 : 0

                let avgExit12 = contaDodici !== 0 ? (mediaUscite / contaDodici) : 0
                let avgExit03 = contaTre !== 0 ? (mediaUscite03 / contaTre) : 0
                let prcExit = avgExit12 !== 0 ? ((avgExit03 - avgExit12) / avgExit12) * 100 : 0

                let avgRisp12 = contaDodici !== 0 ? (mediaRisparmi / contaDodici) : 0
                let avgRisp03 = contaTre !== 0 ? (mediaRisparmi03 / contaTre) : 0 
                let prcRisparmi = avgRisp12 !== 0 ? ((avgRisp03 - avgRisp12) / avgRisp12) * 100 : 0
 
                results.push({
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
                })

                console.log(results)
                res.status(200).json({ ok: 'true', dati: results })
            }
        })
    } catch (errore) {
        res.status(500).json({ ok: 'false', debug: errore })
        console.log(query)
    }
}

module.exports = { fetchSpese, fetchSpeseGroup, fetchSpeseChart, newSpesa, deleteSpesa }