const conn = require('../config/connection')

const fetchViaggi = (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')
    console.log('fetchViaggi')

    var query = "SELECT * FROM viaggi"

    try {
        conn.query(query, (err, rows, fields) => {
            if (rows == undefined) throw err

            if (rows.length >= 1) {
                var result = [];
                for (let i = 0; i < rows.length; i++) {
                    result.push({ id_viaggio: rows[i].id_viaggio, da_quando: rows[i].da_quando, a_quando: rows[i].a_quando, descrizione: rows[i].descrizione })
                }
                res.status(200).json({ ok: 'true', dati: result })
            } else {
                res.status(200).json({ ok: 'true', dati: [] })
            }
        })

    } catch (errore) {
        res.status(400).json({ ok: 'false', debug: errore })
        console.log(query)
    }
}



const newViaggio = (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')
    console.log('newViaggio')

    var body = req.body
    var query = `INSERT INTO viaggi (da_quando, a_quando, descrizione) VALUES ("${body.da_quando}", "${body.a_quando}", "${body.descrizione}")`
    console.log(query)
    console.log(body)
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

module.exports = {fetchViaggi, newViaggio}