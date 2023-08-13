import {model, Schema} from "mongoose";


interface IProduct {
    name: string
    brand: string
    image: string
    category: string
    description: string
    price: string
    countInStock: string
    rating: string
}

interface ICart {
    userId: Schema.Types.ObjectId,
    items: []
}

const cartSchema = new Schema<ICart>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
      },
    items: [
        {
            productId: String,
            quantity: Number,
            name: String,
            price: Number
        }
    ]
})

export const Cart = model<ICart>('Cart', cartSchema)