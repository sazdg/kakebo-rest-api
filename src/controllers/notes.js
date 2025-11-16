const conn = require('../config/connection')
const moment = require('moment')

const fetchNotes = (req, res) => {
    res.set('Access-Control-Allow-Origin','*')
    console.log('fetchNotes')
    let query = 'SELECT * FROM notes ORDER BY ultima_modifica DESC'

    try {
        conn.query(query, (err, rows, fields) => {
            if (rows == undefined) throw err
            
            var results = []
            if (rows.length >= 1){
                for(let i=0; i<rows.length; i++){
                    results.push({id: rows[i].id, descrizione: rows[i].descrizione, ultima_modifica: rows[i].ultima_modifica})
                }
            } 
            res.status(200).json({ok: 'true', dati: results})
            
        })
    } catch (errore) {
        res.status(500).json({ok: 'false', debug: errore})
        console.log(query)
    }
}

const newNote = (req, res) => {
    res.set('Access-Control-Allow-Origin','*')
    console.log('newNote')

    var body = req.body
    var right_now = moment.now.utcOffset(60).format('YYYY-MM-DD HH:mm:ss')
    var query = `INSERT INTO notes (descrizione, ultima_modifica) VALUES (${body.descrizione}, ${right_now})`

    try {
        conn.query(query, (err, rows, fields) => {
            if(err){
                console.log(err)
                res.status(400).json({ok: 'false'})
            } else {
                res.status(200).json({ok: 'true'})
            }
        })
    } catch(errore){
        res.status(500).json({ok: 'false', debug: errore})
        console.log(query)
    }


}

const deleteNote = (req, res) => {
    res.set('Access-Control-Allow-Origin','*')
    console.log('deleteNote')
    
    var query = `DELETE FROM notes WHERE id=${req.body.id}`
    try {
        conn.query(query, (err, rows, fields) => {
            if(err){
                console.log(err)
                res.status(400).json({ok: 'false'})
            } else {
                res.status(200).json({ok: 'true'})
            }
        })
    } catch(errore){
        res.status(500).json({ok: 'false', debug: errore})
        console.log(query)
    }
}

module.exports = {fetchNotes, newNote, deleteNote}