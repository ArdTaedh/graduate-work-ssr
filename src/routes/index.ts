import express, {NextFunction, Request, Response} from "express"

export const indexRouter = express.Router()

indexRouter.get('/', (req: Request, res: Response) => {
    //@ts-ignore
    res.render('index', { title: "Index Page", description: "This is a index Page", user: req.session.user })
})

