import mongoose, {Schema, Document} from "mongoose";



interface IOrderItems extends Document{
    productName: string,
    productImage: string,
    unitPrice: number,
    quantity: number
}

interface IOrder extends Document{
    orderItems: IOrderItems[],
    total: number,
    address: string,
    userID: string | object
}


const OrderItemsSchema = new Schema<IOrderItems>({
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