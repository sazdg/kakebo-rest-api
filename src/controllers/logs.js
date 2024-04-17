const conn = require('../config/connection')

const fetchLogs = (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')
    console.log('fetchLogs')

    var query = "SELECT * FROM logs"

    try {
        conn.query(query, (err, rows, fields) => {
            if (rows == undefined) throw err

            if (rows.length >= 1) {
                var result = [];
                for (let i = 0; i < rows.length; i++) {
                    result.push({ id: rows[i].id, data_ora: rows[i].data_ora, commento: rows[i].commento })
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



const newLog = (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')
    console.log('newLog')
    
    var body = req.body
    var query = `INSERT INTO logs (data_ora, commento) VALUES ("${body.data_ora}", "${body.commento}")`

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

module.exports = {fetchLogs, newLog}