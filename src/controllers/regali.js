const conn = require('../config/connection')

const fetchRegali = (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')
    console.log('fetchRegali')

    var query = "SELECT * FROM regali"

    try {
        conn.query(query, (err, rows, fields) => {
            if (rows == undefined) throw err

            if (rows.length >= 1) {
                var result = [];
                for (let i = 0; i < rows.length; i++) {
                    result.push({ id_regalo: rows[i].id_regalo, id_tipo: rows[i].id_tipo, descrizione: rows[i].descrizione, destinatario_regalo: rows[i].destinatario_regalo, ricevuto_o_fatto: rows[i].ricevuto_o_fatto, quando: rows[i].quando, evento: rows[i].evento, id_spese: rows[i].id_spese })
                }
                res.status(201).json({ ok: 'true', dati: result })
            } else {
                res.status(201).json({ ok: 'true', dati: [] })
            }
        })

    } catch (errore) {
        res.status(400).json({ ok: 'false', debug: errore })
    }
}



const newRegalo = (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')
    console.log('newRegalo')

    var body = req.body
    var query = `INSERT INTO regali (id_tipo, descrizione, destinatario_regalo) VALUES ("${body.id_tipo}", "${body.descrizione}", "${body.destinatario_regalo}")`

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

module.exports = {fetchRegali, newRegalo}