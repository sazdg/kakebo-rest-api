const mysql = require('mysql')
const dotenv = require('dotenv')
dotenv.config()

const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})


conn.connect( (err) => {
    if (err) {
        console.log(err)
        console.log("Hai acceso MAMP?")
        process.exit(1)
    } else {
        console.log("Database: connesso")
    }
})

module.exports = conn