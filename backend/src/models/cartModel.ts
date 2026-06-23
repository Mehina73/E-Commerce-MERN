import mongoose, {Schema, Document, Types } from "mongoose";
import { IProduct } from "./productModel";

const CartStatusEnum = ["active","completed"]

export interface ICartProduct {
    product: Types.ObjectId | IProduct,
    unitPrice: number,
    quantity: number
}

export interface ICart extends Document{
    userID: Object | string,
    items: ICartProduct[],
    total: number,
    status: "active" | "completed"
}




const cartProductSchema = new Schema<ICartProduct>({
    product: {type: Schema.Types.ObjectId, required: true, ref:"Products"},
    unitPrice: {type: Number, required: true},
    quantity: {type: Number, required: true, default: 1}
});

const cartSchema = new Schema<ICart>({
    userID: {type: Schema.Types.ObjectId, required: true, ref:"User"},
    items: [cartProductSchema],
    total: {type: Number, required: true},
    status: {type: String, enum: CartStatusEnum, default: "active"}
});

export const cartModel = mongoose.model<ICart>("Carts",cartSchema) 
