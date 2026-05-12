const conn = require('../config/connection')
const moment = require('moment')

const fetchViaggi = (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')
    console.log('fetchViaggi')

    var query = "SELECT * FROM viaggi ORDER BY da_quando ASC"

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
    var data_da, data_a
    
    if (body.data_da !== undefined) {  
        data_da = moment(body.data_da, 'ddd MMM DD HH:mm:ss z YYYY')
        .utcOffset(60)
        .add(1, 'days')
        .format('YYYY-MM-DD')
        }
    if (body.data_a !== undefined) {  
        data_a = moment(body.data_a, 'ddd MMM DD HH:mm:ss z YYYY')
        .utcOffset(60)
        .add(1, 'days')
        .format('YYYY-MM-DD')
    }
    var query = `INSERT INTO viaggi (da_quando, a_quando, descrizione) VALUES ("${data_da}", "${data_a}", "${body.descrizione}")` 

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


const deleteViaggio = (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')
    console.log('deleteViaggio')

    var body = req.body
    var query = `DELETE FROM viaggi WHERE id_viaggio = "${body.id}"`
    try {
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

const fetchSpeseViaggio = (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')
    console.log('fetchSpeseViaggio')

    var body = req.body
    console.log(body)

    if (body === undefined){
        res.status(400).json({ ok: 'false', dati: [] })
        return
    }
    
 
    var query = `SELECT ks.*, kt.tipo AS descrizione_tipo 
                FROM kakebo.kakebo_spese ks 
                JOIN kakebo.viaggi v ON ( v.id_viaggio = ${body.id_viaggio} )
                LEFT JOIN kakebo.kakebo_tipi kt ON ( kt.id_tipo = ks.id_tipo )
                WHERE ks.data_ora >= v.da_quando AND ks.data_ora < v.a_quando

                UNION 

                SELECT ks.*, kt.tipo AS descrizione_tipo 
                FROM kakebo.kakebo_spese ks 
                LEFT JOIN kakebo.kakebo_tipi kt ON ( kt.id_tipo = ks.id_tipo )
                WHERE ks.id_viaggio  = ${body.id_viaggio} 

                ORDER BY data_ora ASC`

    try {
        conn.query(query, (err, rows, fields) => {

            if (rows == undefined) throw err

            if (rows.length >= 1){
                var result = [];
                for (let i = 0; i < rows.length; i++) {
                     result.push({ id_spesa: rows[i].id_spese, data_ora: moment(rows[i].data_ora).utcOffset(120), spesa: rows[i].spesa, descrizione_spesa: rows[i].descrizione, id_tipo: rows[i].id_tipo, descrizione_tipo: rows[i].descrizione_tipo, tipo_movimento: rows[i].tipo_movimento, is_regalo: rows[i].is_regalo, metodo: rows[i].metodo, prezzo_pieno: rows[i].prezzo_pieno, sconto: rows[i].sconto, id_viaggio: rows[i].id_viaggio })   
                    }

                res.status(200).json({ ok: 'true', dati: result })
            } else {
                res.status(200).json({ ok: 'true', dati: [] })
            }
 
        })

    } catch (errore) {
        res.status(500).json({ok: 'false'})
        console.log(query)
    }


}



module.exports = { fetchViaggi, newViaggio, deleteViaggio, fetchSpeseViaggio }
