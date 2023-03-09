import express, {Express, NextFunction, Request, Response, Errback} from 'express'
import dotenv from 'dotenv'
import path from "path";
import * as mongoose from "mongoose";
import httpErrors from 'http-errors'
import cookieParser from 'cookie-parser'
import session from 'express-session'

import {indexRouter} from "./routes";
import {authRouter} from "./routes/auth";

dotenv.config()

const app: Express = express()
const port = process.env.PORT

//Set up view engine and static files
app.set('view engine', 'ejs' +
    '')
app.set('views', path.join(__dirname, '../../views'))
app.use(express.static(path.join(__dirname, '../../public')))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// Session

app.use(session({
    secret: String(process.env.SECRET),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true
    }
}))

// app.use((
//         req: Request,
//         res: Response,
//         next: NextFunction
//     ) => {
//     //@ts-ignore
//         if (req.session.user! && req.cookies.user_id) {
//             res.redirect('/')
//         }
//
//         next()
//     })



//MongoDB connection
mongoose.set('strictQuery', false);
mongoose.connect(
    String(process.env.MONGODB_URI),
    () => console.log('MongoDB is connected successfully')
)

//Routes
app.use('/', indexRouter)
app.use('/auth', authRouter)

//Error Handling
app.use(( req: Request, res: Response, next: NextFunction) => {
    next(httpErrors.NotFound())
})

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.locals.message = err.message
    res.locals.error = err

    res.status(err.status || 500)
    res.render('error')
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})