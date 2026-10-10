import {Request, Response} from 'express'
import {RowDataPacket, ResultSetHeader} from 'mysql2/promise'
import db from '../config/connection'


interface Tipologia extends RowDataPacket {
    id_tipo: number;
    tipo: string;
    descrizione: string;
}

interface NewTipologieBody {
    tipo: string;
    descrizione: string;
}

const fetchTipi = async (req: Request, res: Response) => {
    res.set('Access-Control-Allow-Origin', '*')
    console.log('fetchTipi')

    const query: string = "SELECT ks.* FROM kakebo_tipi ks"
    

    try {
        const [rows] = await db.query<Tipologia[]>(query)
        // awway di rows

        res.status(200).json({ ok: 'true', dati: rows })
        // rows contiene oggetti mappati

    } catch (errore) {
        console.error("Errore durante fetchTipi:", query, errore)
        res.status(500).json({
            ok: 'false',
            debug: errore instanceof Error ? errore.message : errore
        })
    }
}



const newTipo = async (req: Request, res: Response) => {
    res.set('Access-Control-Allow-Origin', '*')
    console.log('newTipo')

    var body = req.body as NewTipologieBody
    var query = `INSERT INTO kakebo_tipi (tipo, descrizione) VALUES (?, ?)`

    try {
        await db.execute<ResultSetHeader>(query, [body.tipo, body.descrizione])
         
        res.status(201).json({ ok: 'true' })

    } catch (errore) {
        console.error("Errore durante newTipo:", errore)
        res.status(500).json({
            ok: 'false',
            debug: errore instanceof Error ? errore.message : errore
        })
    }
}

export {fetchTipi, newTipo}