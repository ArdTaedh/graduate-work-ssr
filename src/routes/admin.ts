import express, {NextFunction, Request, Response} from "express";
import isAuth from "../middlewares/isAuth";
import isAdmin from "../middlewares/isAdmin";
import {User} from "../models/User";
import {Product} from "../models/Product";
import path from "path";
import * as fs from "fs";

export const adminRouter = express.Router()

adminRouter.get('/', isAuth, isAdmin,
    (
        req: Request,
        res: Response
    ) => {
        res.render('admin/index', { user: req.session.user, pageName: null })
})

adminRouter.get('/products', isAuth, isAdmin,
    async (
        req: Request,
        res: Response
    ) => {
        const products = await Product.find({})

        res.render('admin/products', { user: req.session.user, pageName: "products", products: products })
    })

adminRouter.get('/users', isAuth, isAdmin,
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const users = await User.find({})

        res.render('admin/users', { user: req.session.user, pageName: "users", users: users })
    })

adminRouter.post('/product/create', isAuth, isAdmin,
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const newProduct = await Product.create({ name: "New Name" })

        const savedProduct = await newProduct.save()

        res.redirect(`/admin/product/${savedProduct!._id}/edit`)
    })

adminRouter.get('/product/:id/edit', isAuth, isAdmin,
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const product = await Product.findById(req.params.id)

        // res.render('admin/users', { user: req.session.user, pageName: "users", users: users })
        res.render('admin/product-edit', { product: product, user: req.session.user, pageName: "products" })
})

adminRouter.post('/product/:id/edit', isAuth, isAdmin,
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const product = await Product.findById(req.params.id)

        if (!product) {
            res.status(404).send("No Product found")
        }

        product!.name = req.body.name
        product!.brand = req.body.brand
        // product!.image = req.body.image
        product!.category = req.body.category
        product!.description = req.body.description
        product!.price = req.body.price
        product!.countInStock = req.body.countInStock

        await product!.save()

        res.redirect('../../products')
})

adminRouter.post('/product/:id/remove', isAuth, isAdmin,
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const id = req.params.id

        const product = await Product.findById(id)

        if (!product) {
            res.status(404).send("No Product found")
        }

        const directory = path.resolve(`./public/images/${product!.image}`)

        fs.unlink(directory, () => {})

        await product?.deleteOne({ _id: id })

        res.redirect('../../products')
})

adminRouter.post('image/upload', isAuth, isAdmin,
    async(
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

    }
)