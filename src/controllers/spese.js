const conn = require('../config/connection')

const fetchSpese = (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')
    console.log('fetchSpese')

    var body = req.body
    // id_spese
    // data_ora
    // spesa
    // id_tipo
    // descrizione
    // tipo_movimento
    let idSpese = body.id_spese
    let tipoMovimento = body.tipo_movimento
    let descrizione = body.descrizione
    let idTipo = body.id_tipo
    let descrizioneTipo = body.descrizione_tipo
    let dataDa = body.data_da
    let dataA = body.data_a
    //TODO: testare filtri
    var query = "SELECT ks.*, kt.tipo AS descrizione_tipo FROM kakebo_spese ks LEFT JOIN kakebo_tipi kt ON (kt.id_tipo=ks.id_tipo)"
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
        condition += `ks.descrizione = "${descrizione}"`
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

    try {
        conn.query(query, (err, rows, fields) => {
            if (rows == undefined) throw err

            if (rows.length >= 1) {
                var result = [];
                for (let i = 0; i < rows.length; i++) {
                    result.push({ id_spesa: rows[i].id_spesa, data_ora: rows[i].data_ora, spesa: rows[i].spesa, descrizione_spesa: rows[i].descrizione, id_tipo: rows[i].id_tipo, descrizione_tipo: rows[i].descrizione_tipo, tipo_movimento: rows[i].tipo_movimento, is_regalo: rows[i].is_regalo })
                }
                res.status(200).json({ ok: 'true', dati: result })
            } else {
                res.status(200).json({ ok: 'true', dati: [] })
            }
        })

    } catch (errore) {
        res.status(400).json({ ok: 'false', debug: errore })
    }
    console.log(query)
}

const newSpesa = (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')
    console.log('newSpesa')

    //{ "data": "2024-04-13 21:00:00.000", "spesa": "72.0", "id_tipo": "10", "descrizione": "", "tipo_movimento": "0", "is_regalo":"0" }
    var body = req.body
    var query = `INSERT INTO kakebo_spese (data_ora, spesa, id_tipo, descrizione, tipo_movimento, is_regalo) VALUES ("${body.data}", "${body.spesa}", "${body.id_tipo}", "${body.descrizione}", "${body.tipo_movimento}", "${body.is_regalo}")`

    try {
        conn.query(query, (err, rows, fields) => {

            if (err) {
                console.log(err)
                res.status(201).json({ ok: 'false' })
            } else {
                res.status(201).json({ ok: 'true' })
            }
        })
    } catch (errore) {
        res.status(400).json({ ok: 'false', debug: errore })
    }
}

const deleteSpesa = (req, res) => {
    console.log('deleteSpesa')
    res.set('Access-Control-Allow-Origin', '*')
    //{ "id": "4" }
    var body = req.body
    var query = `DELETE FROM kakebo_spese WHERE id_spese = "${body.id}"`

    try {
        conn.query(query, (err, rows, fields) => {

            if (err) {
                console.log(err)
                res.status(200).json({ ok: 'false' })
            } else {
                res.status(200).json({ ok: 'true' })
            }
        })
    } catch (errore) {
        res.status(400).json({ ok: 'false', debug: errore })
    }
    
}
module.exports = { fetchSpese, newSpesa, deleteSpesa }