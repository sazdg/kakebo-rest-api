const conn = require('../config/connection')

const fetchTipi = (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')
    console.log('fetchTipi')

    var query = "SELECT ks.* FROM kakebo_tipi ks"

    try {
        conn.query(query, (err, rows, fields) => {
            if (rows == undefined) throw err

            if (rows.length >= 1) {
                var result = [];
                for (let i = 0; i < rows.length; i++) {
                    result.push({ id_tipo: rows[i].id_tipo, tipo: rows[i].tipo, descrizione: rows[i].descrizione })
                }
                res.status(200).json({ ok: 'true', dati: result })
            } else {
                res.status(200).json({ ok: 'true', dati: [] })
            }
        })

    } catch (errore) {
        res.status(400).json({ ok: 'false', debug: errore })
    }
}



const newTipo = (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')
    console.log('newTipo')

    var body = req.body
    var query = `INSERT INTO kakebo_tipi (tipo, descrizione) VALUES ("${body.tipo}", "${body.descrizione}")`

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

module.exports = {fetchTipi, newTipo}