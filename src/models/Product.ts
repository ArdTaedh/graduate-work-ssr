/*
 id: string
    name: string
    brand: string
    image: string
    category: string
    description: string
    price: string
    countInStock: string
    rating: string
* */

import {model, Schema} from "mongoose";

interface IProduct {
    name: string
    brand: string
    image: string
    category: string
    description: string
    price: number
    countInStock: string
    rating: string
}

const productSchema = new Schema<IProduct>({
    name: { type: String, required: true },
    brand: { type: String },
    image: { type: String },
    category: { type: String },
    description: { type: String },
    price: { type: Number },
    countInStock: { type: String },
    rating: { type: String }
})

export const Product = model<IProduct>('Product', productSchema)