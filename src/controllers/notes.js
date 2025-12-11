const conn = require('../config/connection') 

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

    try {
        var body = req.body 
        console.log(body)
        if (!body ||                                 // undefined o null
            Object.keys(body).length === 0 ||        // oggetto vuoto
            !body.descrizione ||
            !body.data){
            res.status(400).json({ ok: 'false' })
            return
        } 
        var query = `INSERT INTO notes (descrizione, ultima_modifica) VALUES (?, ?);`// (${body.descrizione}, ${body.data})`
        
        conn.query(query, [body.descrizione, body.data], (err, rows, fields) => {
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
    
    var query = `DELETE FROM notes WHERE id=(?)`
    try {
        conn.query(query, [req.body.id], (err, rows, fields) => {
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