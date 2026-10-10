
import { Request, Response } from 'express'
import { RowDataPacket, ResultSetHeader } from 'mysql2'
import db from '../config/connection'
import moment, {Moment} from 'moment'


interface SpesaViaggio extends RowDataPacket {
    id_spesa: number;
    data_ora: Date; // moment(rows[i].data_ora).utcOffset(120)
    spesa: number;
    id_tipo: number;
    descrizione: string;
    tipo_movimento: number;
    is_regalo: number;
    metodo: number;
    prezzo_pieno: number;
    sconto: number;
    id_viaggio: number;
    descrizione_tipo: string;
}

interface Viaggio extends RowDataPacket {
    id_viaggio: number;
    da_quando: Date;
    a_quando: Date;
    descrizione: string;
}

interface NewViaggiBody {
    data_da: Date;
    data_a: Date;
    descrizione: string;
}


const fetchViaggi = async (req: Request, res: Response) => {
    res.set('Access-Control-Allow-Origin', '*')
    console.log('fetchViaggi')

    const query: string = "SELECT * FROM viaggi ORDER BY da_quando ASC"

    try {

        const [rows] = await db.query<Viaggio[]>(query)
        // array di rows

        res.status(200).json({ ok: 'true', dati: rows })


    } catch (errore) {
        console.error("Errore durante newLog:", errore)
        res.status(500).json({
            ok: 'false',
            debug: errore instanceof Error ? errore.message : errore
        })
    }
}


const newViaggio = async (req: Request, res: Response) => {
    res.set('Access-Control-Allow-Origin', '*')
    console.log('newViaggio') 

    var body = req.body as NewViaggiBody
    var data_da: string = ""
    var data_a: string = ""
    
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
    const query: string = `INSERT INTO viaggi (da_quando, a_quando, descrizione) VALUES (?, ?, ?)` 

    try {
        await db.execute<ResultSetHeader>(query, [data_da, data_a, body.descrizione])
   
        res.status(201).json({ ok: 'true' })
    } catch (errore) {
        console.error("Errore durante newLog:", errore)
        res.status(500).json({
            ok: 'false',
            debug: errore instanceof Error ? errore.message : errore
        })
    }
}


const deleteViaggio = async (req: Request, res: Response) => {
    res.set('Access-Control-Allow-Origin', '*')
    console.log('deleteViaggio')

    const query = `DELETE FROM viaggi WHERE id_viaggio = ? `
    try {

        const [result] = await db.execute<ResultSetHeader>(query, [req.body.id])

        res.status(200).json({ ok: 'true' })

    } catch (errore) {
        console.error("Errore durante newLog:", errore)
        res.status(500).json({
            ok: 'false',
            debug: errore instanceof Error ? errore.message : errore
        })
    }
}

const fetchSpeseViaggio = async (req: Request, res: Response) => {
    res.set('Access-Control-Allow-Origin', '*')
    console.log('fetchSpeseViaggio')

    var body = req.body
    console.log(body)

    if (body === undefined){
        res.status(400).json({ ok: 'false', dati: [] })
        console.log(res)
        return
    }
    
    const query = `SELECT ks.id_spese AS id_spesa, ks.descrizione AS descrizione_spesa, ks.*, kt.tipo AS descrizione_tipo 
                FROM kakebo.kakebo_spese ks 
                JOIN kakebo.viaggi v ON ( v.id_viaggio = ${body.id_viaggio} )
                LEFT JOIN kakebo.kakebo_tipi kt ON ( kt.id_tipo = ks.id_tipo )
                WHERE ks.data_ora >= v.da_quando AND ks.data_ora <= DATE_ADD(v.a_quando, INTERVAL 1 DAY)
                UNION 
                SELECT ks.id_spese AS id_spesa, ks.descrizione AS descrizione_spesa, ks.*, kt.tipo AS descrizione_tipo 
                FROM kakebo.kakebo_spese ks 
                LEFT JOIN kakebo.kakebo_tipi kt ON ( kt.id_tipo = ks.id_tipo )
                WHERE ks.id_viaggio  = ${body.id_viaggio} 
                ORDER BY data_ora ASC`

    try {


        console.log('fooooooo')
        console.log(query)
        const [rows] = await db.query<SpesaViaggio[]>(query)
console.log(rows)
        res.status(200).json({ ok: 'true', dati: rows })

    } catch (errore) {
        console.error("Errore durante newLog:", errore)
        res.status(500).json({
            ok: 'false',
            debug: errore instanceof Error ? errore.message : errore
        })
    }

}


export { fetchViaggi, newViaggio, deleteViaggio, fetchSpeseViaggio }
