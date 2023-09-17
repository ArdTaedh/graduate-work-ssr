import { NextFunction, Request, Response } from 'express'
const sessionChecker =
    (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        //@ts-ignore
    if (req.session.user! && req.cookies.user_id) {
        res.redirect('/')
    } else {
        next()
    }
}

export default sessionChecker