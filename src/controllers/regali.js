const conn = require('../config/connection')
const speseController = require('./spese')

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
                    result.push({ id_regalo: rows[i].id_regalo, mittente_regalo: rows[i].mittente_regalo, destinatario_regalo: rows[i].destinatario_regalo, evento: rows[i].evento, id_spese: rows[i].id_spese })
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



const newRegalo = (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')
    console.log('newRegalo')

    //{"data": "2024-04-13 00:00:00.000", "spesa":"0", "id_tipo":"16", "descrizione":"Orecchini pandora", "tipo_movimento":"1", "is_regalo":"1", "mittente_regalo":"Rosario Fiorella", "destinatario_regalo": "Sara", "evento": "Laurea"}
    var body = req.body
    var querySpesa = `INSERT INTO kakebo_spese (data_ora, spesa, id_tipo, descrizione, tipo_movimento, is_regalo) VALUES ("${body.data}", "${body.spesa}", "${body.id_tipo}", "${body.descrizione}", "${body.tipo_movimento}", "${body.is_regalo}")`

    try{
        conn.query(querySpesa, (err, rows, fields) => {

            if (err) {
                console.log(err)
                res.status(201).json({ ok: 'false' })
            }
        })
    }catch(errore){

    }

    var queryIndex = `SELECT MAX(id_spese) AS id FROM kakebo.kakebo_spese`
    var lastId = 0;
    try{
        conn.query(queryIndex, (err, rows, fields) => {
            console.log("rows: " + rows[0].id)
            lastId = rows[0].id
            if (lastId !== 0) {
                var queryRegalo = `INSERT INTO regali ( mittente_regalo, destinatario_regalo, evento, id_spese) VALUES ("${body.mittente_regalo}", "${body.destinatario_regalo}", "${body.evento}", "${lastId}")`

                try {
                    conn.query(queryRegalo, (err, rows, fields) => {

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
            } else {
                res.status(200).json({ ok: 'false', debug: `LastId: ${lastId}` })
            }
        })
    }catch (errore) {
        res.status(400).json({ ok: 'false', debug: errore })
    }
   
    
}

module.exports = {fetchRegali, newRegalo}