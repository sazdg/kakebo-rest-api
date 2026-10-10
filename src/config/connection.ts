import dotenv from 'dotenv'
import mysql, {Pool} from 'mysql2/promise'

dotenv.config()

const conn: Pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})


conn.getConnection()
.then( (connection) => {
    console.log("Database connesso con successo!")
    connection.release()
})
.catch((err) => {
    console.error("Errore di connessione al database:", err.message)
    console.log("Hai acceso MAMP?")
})
   

export default conn