import mongoose, {Schema, Document} from "mongoose";



export interface IOrderItem {
    productName: string,
    productImage: string,
    unitPrice: number,
    quantity: number
}

export interface IOrder extends Document{
    orderItems: IOrderItem[],
    total: number,
    address: string,
    userID: string | object
}


const OrderItemsSchema = new Schema<IOrderItem>({
    productName: { type: String, required: true },
    productImage: { type: String, required: true },
    unitPrice: { type: Number, required: true },
    quantity:   { type: Number, required: true }  
})


const OrderSchema = new Schema<IOrder>({
    orderItems: [OrderItemsSchema],
    total: { type: Number, required: true },
    address: { type: String, required: true },
    userID:   {type: Schema.Types.ObjectId,  ref:"User", required: true,}  
})

export const orderModel = mongoose.model<IOrder>('Order', OrderSchema);