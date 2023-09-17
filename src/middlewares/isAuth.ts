import {NextFunction, Request, Response} from "express";

const isAuth =
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        if (req.session.user! && req.cookies['connect.sid']) {
            next()
        } else {
            res.status(401)
            res.redirect('/auth/login')
        }
}

export default isAuth