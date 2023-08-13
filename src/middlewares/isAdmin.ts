import {NextFunction, Request, Response} from "express";

const isAdmin =
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        if (req.session.user! && req.session.user?.role === 'admin') {
            next()
        } else {
            res.status(401)
            res.redirect('/auth/login')
        }
    }

export default isAdmin