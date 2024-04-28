const express = require('express')
const routes = require('./routes/kakebo.js')
const app = express()

const dotenv = require('dotenv')
dotenv.config()


const cors = require('cors')
const moment = require('moment')

//app.use(cors({ origin: `http://localhost:${port}` }))

var port = process.env.PORT

console.log('Environment: ', process.env.ENVIRONMENT)
console.log(process.env.GREETING_MESSAGE)


//the encoding of the request (post) Contet-Type: application/json
// middleware 
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


/* Error handler middleware */
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({ message: err.message });
    return;
});

app.use('/', routes)

app.listen(port, () => console.log(`Server in ascolto: http://localhost:${port}/`));