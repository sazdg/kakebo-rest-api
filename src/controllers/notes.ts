import { Request, Response } from 'express'
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise'
import db from '../config/connection'


interface Notes extends RowDataPacket {
    id: number;
    descrizione: string;
    ultima_modifica: string;
}

const fetchNotes = async (req: Request, res: Response) => {
    res.set('Access-Control-Allow-Origin','*')
    console.log('fetchNotes')

    const query = 'SELECT id, descrizione, ultima_modifica FROM notes ORDER BY ultima_modifica DESC'

    try {

        const [rows] = await db.query<Notes[]>(query)

        res.status(200).json({ ok: 'true', dati: rows})

     
    } catch (errore) {
        console.error("Errore durante fetchNotes:", errore)
        res.status(500).json({
            ok: 'false',
            debug: errore instanceof Error ? errore.message : errore
        })
    }
}

const newNote = async (req: Request, res: Response) => {
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
        
        const [result] = await db.query<ResultSetHeader>(query, [body.descrizione, body.data])

        res.status(200).json({ok: 'true'})
        
    } catch(errore){
        console.error("Errore durante newNote:", errore)
        res.status(500).json({
            ok: 'false',
            debug: errore instanceof Error ? errore.message : errore
        })
    }


}

const deleteNote = async (req: Request, res: Response) => {
    res.set('Access-Control-Allow-Origin','*')
    console.log('deleteNote')
    
    const query = `DELETE FROM notes WHERE id = ?`
    try {

        const [result] = await db.execute<ResultSetHeader>(query, [req.body.id])

        res.status(200).json({ ok: 'true' })
       
    } catch(errore){
        console.error("Errore durante deleteNote:", errore)
        res.status(500).json({
            ok: 'false',
            debug: errore instanceof Error ? errore.message : errore
        })
    }
}

export {fetchNotes, newNote, deleteNote}