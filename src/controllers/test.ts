import {Request, Response} from 'express'
import {RowDataPacket, ResultSetHeader} from 'mysql2/promise'
import db from '../config/connection'

const showFeedback = async (req: Request, res: Response) => {
    res.set('Access-Control-Allow-Origin', '*')
    res.status(200).json({ result: 'welcome' })
}


const pong = (req: Request, res: Response) => {
    res.set('Access-Control-Allow-Origin', '*')
    res.status(200).json({ result: 'pong' })
}

export {showFeedback, pong}