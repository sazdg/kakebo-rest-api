const conn = require('../config/connection')
const speseController = require('./spese')

const fetchRegali = (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')
    console.log('fetchRegali')
    
    var query = "SELECT ks.id_spese, ks.data_ora, ks.spesa, ks.id_tipo, ks.descrizione, ks.tipo_movimento, ks.is_regalo, ks.metodo, IFNULL(r.id_regalo, 0) AS id_regalo, IFNULL(r.mittente_regalo, '') AS mittente_regalo, IFNULL(r.destinatario_regalo, '') AS destinatario_regalo, IFNULL(r.evento, '') AS evento FROM kakebo_spese ks LEFT JOIN regali r on (r.id_spese=ks.id_spese) WHERE is_regalo=1 ORDER BY ks.data_ora ASC"

    try {
        conn.query(query, (err, rows, fields) => {
            if (rows == undefined) throw err

            if (rows.length >= 1) {
                var result = [];
                for (let i = 0; i < rows.length; i++) {
                    result.push({ id_regalo: rows[i].id_regalo, mittente_regalo: rows[i].mittente_regalo, destinatario_regalo: rows[i].destinatario_regalo, evento: rows[i].evento, id_spese: rows[i].id_spese, data_ora:rows[i].data_ora, spesa:rows[i].spesa, descrizione: rows[i].descrizione, metodo:rows[i].metodo })
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

    //{"id_spese": "0", "data": "2024-04-13 00:00:00.000", "spesa":"0", "id_tipo":"16", "descrizione":"Orecchini pandora", "tipo_movimento":"1", "is_regalo":"1", "mittente_regalo":"Rosario Fiorella", "destinatario_regalo": "Sara", "evento": "Laurea"}
   
    var body = req.body
    var lastId = 0
    console.log(body.id_spese)
    
    if (body.id_spese == 0){
        console.log('new spesa')
        var querySpesa = `INSERT INTO kakebo_spese (data_ora, spesa, id_tipo, descrizione, tipo_movimento, is_regalo) VALUES ("${body.data}", "${body.spesa}", "${body.id_tipo}", "${body.descrizione}", "${body.tipo_movimento}", "${body.is_regalo}")`
        try{
            conn.query(querySpesa, (err, rows, fields) => {

                if (err) {
                    console.log(err)
                    res.status(201).json({ ok: 'false' })
                }
            })
            var queryIndex = `SELECT MAX(id_spese) AS id FROM kakebo.kakebo_spese`

            conn.query(queryIndex, (err, rows, fields) => {
                console.log("rows: " + rows[0].id)
                lastId = rows[0].id
            })
        }catch(errore){

        }
    } else {
        
        lastId = body.id_spese
    }
    console.log(lastId)
    try{
        if (lastId !== 0) {
            var queryRegalo = `INSERT INTO regali (mittente_regalo, destinatario_regalo, evento, id_spese, id_tipo) VALUES ("${body.mittente_regalo}", "${body.destinatario_regalo}", "${body.evento}", "${lastId}", "${body.id_tipo}")`

            try {
                conn.query(queryRegalo, (err, rows, fields) => {

                    if (err) {
                        console.log(err)
                        res.status(400).json({ ok: 'false' })
                    } else {
                        res.status(200).json({ ok: 'true' })
                    }
                })
            } catch (errore) {
                res.status(500).json({ ok: 'false', debug: errore })
            }
        } else {
            res.status(200).json({ ok: 'false', debug: `LastId: ${lastId}` })
        }
    }catch (errore) {
        res.status(500).json({ ok: 'false', debug: errore })
    }
   
    
}

module.exports = {fetchRegali, newRegalo}