import express, {NextFunction, Request, Response} from "express"

import {Cart} from "../models/Cart";
import { Product } from "../models/Product";
import { ObjectId } from "mongoose";

export const cartRouter = express.Router()

cartRouter.get('/', async (req: Request, res: Response) => {
    //@ts-ignore
    const userInfo = req.session.user as any

    if (userInfo === undefined) {
        res.redirect('/auth/login')
        return
    }

    const cartItems = await Cart.find({ userId: userInfo.id })

    const sum = cartItems.reduce((a, b) => a + (b.items?. qty! * b.items?.price!), 0)

    res.render('cart', { cartItems, total: sum, user: req.session.user })
})

cartRouter.post('/add', async (req: Request<never, never, { productId: string }>, res: Response,) => {
    const { productId } = req.body

    //@ts-ignore
    const userInfo = req.session.user as any

    if (userInfo === undefined) {
        res.redirect('/auth/login')
        return
    }
    
    const cartItemExists = await Cart.findOne({ userId: userInfo.id, 'items.productId': productId })

    if (!cartItemExists) {
        const product = await Product.findById(productId)

        const newCatItem = await Cart.create(
            { 
                userId: userInfo.id, 
                items: { 
                    productId: productId, 
                    name: product?.name,
                    img: product?.image,
                    price: product?.price,
                    qty: 1 
                }
            }
        )

        await newCatItem.save()
        res.redirect('/cart')
        return
    }

    const updateQuantityOfItem = await Cart.findOneAndUpdate(
        { userId: userInfo.id, 'items.productId': productId },
        { $inc: { 'items.qty': 1 } }
    )

    await updateQuantityOfItem?.save()

    res.redirect('/cart')
})

cartRouter.post('/remove', async (req: Request<never, never, { productId: string }>, res: Response,) => {
    const { productId } = req.body

    //@ts-ignore
    const userInfo = req.session.user as any

    if (userInfo === undefined) {
        res.redirect('/auth/login')
        return
    }
    
    const cart = await Cart.findOne({ userId: userInfo.id, 'items.productId': productId })

    if (cart?.items.qty! > 1) { 
        const removeQuantityOfItem = await Cart.findOneAndUpdate(
            { userId: userInfo.id, 'items.productId': productId },
            { $inc: { 'items.qty': -1 } }
        )
    
        await removeQuantityOfItem?.save()
        res.redirect('/cart')
    } else if (cart?.items.qty! === 1 ) {
        await cart?.remove()
        res.redirect('/cart')
    }



})