import {Request, Response} from 'express'
import {RowDataPacket, ResultSetHeader} from 'mysql2/promise'
import db from '../config/connection'

interface Log extends RowDataPacket {
    id: number;
    data_ora: string;
    commento: string;
}

interface NewLogBody {
    data_ora: string;
    commento: string;
}

const fetchLogs = async (req: Request, res: Response) => {
    res.set('Access-Control-Allow-Origin', '*')
    console.log('fetchLogs')

    const query: string = "SELECT id, data_ora, commento FROM logs"

    try {

        const [rows] = await db.query<Log[]>(query)
        //array di rows

        res.status(200).json({ ok: 'true', dati: rows })
        // rows contiene già gli oggetti mappati

    } catch (errore) {
        console.error("Errore durante fetchLogs:",query, errore)
        res.status(500).json({ 
            ok: 'false', 
            debug: errore instanceof Error ? errore.message : errore})
    }
}


const newLog = async (req: Request, res: Response) => {
    res.set('Access-Control-Allow-Origin', '*')
    console.log('newLog')
    
    const body = req.body as NewLogBody
    const query = `INSERT INTO logs (data_ora, commento) VALUES (?, ?)`

    try {
        await db.execute<ResultSetHeader>(query, [body.data_ora, body.commento])

        res.status(201).json({ ok: 'true' })
       
    } catch (errore) {
        console.error("Errore durante newLog:", errore)
        res.status(500).json({ 
            ok: 'false', 
            debug: errore instanceof Error ? errore.message : errore })
    }
}

export {fetchLogs, newLog}