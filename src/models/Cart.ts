import {model, Types, Schema, ObjectId} from "mongoose";

interface ICart {
    userId: Schema.Types.ObjectId,
    items: {
        productId: string,
        name: string,
        img: string,
        price: number
        qty: number
    }
}

const cartSchema = new Schema<ICart>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
      },
    items: {
            productId: String,
            name: String,
            img: String,
            price: Number,
            qty: Number,
        }
})

export const Cart = model<ICart>('Cart', cartSchema)