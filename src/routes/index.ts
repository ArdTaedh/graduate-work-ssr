import express, {NextFunction, Request, Response} from "express"
import { Product } from "../models/Product"

export const indexRouter = express.Router()



indexRouter.get('/', async (req: Request, res: Response) => {
    const products = await Product.find({})

    res.render('index', { title: "Index Page", description: "This is a index Page", user: req.session.user, products: products })
})

indexRouter.get('/product/:id', async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id)

    res.render('product', { product: product })
})