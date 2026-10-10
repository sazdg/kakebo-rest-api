import express, {Express, Request, Response, NextFunction} from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import routes from './routes/kakebo'
 
 
dotenv.config()


const app: Express = express()
const port: string | undefined = process.env.PORT 

console.log('Environment: ', process.env.ENVIRONMENT)
console.log(process.env.GREETING_MESSAGE)


//the encoding of the request (post) Contet-Type: application/json
// Middleware 
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Routes principali
app.use('/', routes)

interface CustomError extends Error {
    statusCode?: number; // opzionale
}

/* Error handler middleware */
app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
    const statusCode: number = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({ message: err.message }); 
});


app.listen(port, () => console.log(`Server in ascolto: http://localhost:${port}/`));