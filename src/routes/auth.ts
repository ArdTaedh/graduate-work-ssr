import express, {NextFunction, Request, Response} from "express"
import {body, check, validationResult} from 'express-validator'
import { hash, compare } from 'bcryptjs'

import {User} from "../models/User";

export const authRouter = express.Router()

authRouter.get('/login', (req: Request, res: Response) => {
    if (req.session.user! && req.cookies['connect.sid']) {
        res.redirect('../')
    } else {
        res.render('login')
    }
})

authRouter.get('/register', (req: Request, res: Response) => {
    res.render('register', )
})

authRouter.get('/logout', (req: Request, res: Response) => {
    //@ts-ignore
    if (req.session.user! && req.cookies['connect.sid']) {
        res.clearCookie("connect.sid")
        res.redirect('../')
    }
})

authRouter.post(
    '/login',
    [
        check('email').exists().isEmail().withMessage('Email must be valid'),
        check('password').exists().isLength({
            min: 6,
            max: 15
        }).withMessage('Password must not be less than 6 character long')
    ],
    async (
        req: Request<never, never, { email: string, password: string }>,
        res: Response,
        next: NextFunction
    ) => {
        const {email, password} = req.body

        const validationErrors = validationResult(req)

        const errors = validationErrors.array()

        let errorsObj = {}

        errors.map((item) => {
            const id = item.param
            //@ts-ignore
            delete item.param
            //@ts-ignore
            errorsObj[id] = item
        })

        if (validationErrors.isEmpty()) {
            const candidate = await User.findOne({ email: email })

            let userErrorObj = { user: {  msg: "Email or password are incorrect" }}

            if (!candidate) {
                return res.render('login', { userError: userErrorObj, err: errorsObj });
            }

            const comparePasswords = await compare(password, candidate.password)

            if (!comparePasswords) {
                return res.render('login', { userError: userErrorObj, err: errorsObj })
            }

            // const tokenIsAliveDuration = 60 * 60 * 24
            // sign(
            //     { id: candidate._id },
            //     String(process.env.SECRET),
            //     { expiresIn: tokenIsAliveDuration * 2 },
            //     (error, token) => {
            //         res.cookie("token", token, { maxAge: tokenIsAliveDuration * 3, httpOnly: true })
            //         res.redirect('/')
            //     })

            //@ts-ignore
            req.session.user = { id: candidate._id, email: candidate.email, role: candidate.role }

            if (req.session.user) {
                res.redirect('../')
            }

        } else {
            return res.render('login', { err: errorsObj });
        }
    })

authRouter.post('/register',
    [
        check('email').exists().isEmail().withMessage('Email must be valid'),
        check('password').exists().isLength({
            min: 6,
            max: 15
        }).withMessage('Password must not be less than 6 character long')
    ],
    async (
        req: Request<never, never, { email: string, password: string }>,
        res: Response,
        next: NextFunction
    ) => {
        const {email, password} = req.body

        const validationErrors = validationResult(req)

        const errors = validationErrors.array()

        let errorsObj = {}

        errors.map((item) => {
            const id = item.param
            //@ts-ignore
            delete item.param
            //@ts-ignore
            errorsObj[id] = item
        })

        if (validationErrors.isEmpty()) {
            try {
                const candidate = await User.findOne({ email: email })

                let userErrorObj = { user: {  msg: "User is already exists with this email" }}

                if (candidate) {
                    return res.render('register', { userError: userErrorObj, err: errorsObj });
                }

                const hashPassword = await hash(password, 8)

                await User.create({ email: email, password:  hashPassword})

                return res.redirect('/auth/login')

            } catch (err) {
                console.log(err)
            }
        } else {
            return res.render('register', { err: errorsObj });
        }
    })