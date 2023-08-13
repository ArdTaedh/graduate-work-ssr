import express, {NextFunction, Request, Response} from "express"

import {Cart} from "../models/Cart";

export const cartRouter = express.Router()

cartRouter.post('/add', async (req: Request, res: Response) => {
    const info = req.body

    console.log('add to cart', info)
})