import { cartModel } from "../models/cartModel"
import { productModel } from "../models/productModel";
import { Types } from "mongoose";

// Get all carts
export const getAllCarts = async()=>{
    const getAllCarts = cartModel.find();
    return {data: getAllCarts, status: 200}
}

// Delete all carts
export const deleteAllCarts = async()=>{
    const getAllCarts = cartModel.findOneAndDelete();
    return {data: getAllCarts, status: 200}
}

// Get cart
// export const getCart = async()=>{
//     const getAllCarts = cartModel.findOneAndDelete();
//     return {data: getAllCarts, status: 200}
// }


interface ICartForUser{
    userID: string
}

// Create cart for user
export const createCartForUser = async({userID}: ICartForUser) => {
    const cart = await cartModel.create({userID, total: 0});
    await cart.save();
    return cart;
}

// Get active cart
export const getActiveCartForUser = async( {userID}: ICartForUser) => {
    let cart = await cartModel.findOne({userID, status:"active"})

    if(!cart){
        cart = await createCartForUser({userID});
        return cart;
    }

    return cart;
}


interface ItemInCart{
    userID: string, 
    productId: string, 
    quantity: number
}

export const addItemToCart = async({userID, productId, quantity}: ItemInCart) => {
    
    const cart = (await getActiveCartForUser({userID}));
    const existsInCart = cart.items.find( (p) => p.product.toString() === productId)

    if(existsInCart){
        return {data: "Item aleary exists", status: 400}
    }

    const product = await productModel.findById(productId)

    if(!product){
        return {data: "Product not found", status: 400};
    }

    cart.items.push({
        product: product, 
        unitPrice: product.price, 
        quantity: quantity
    });

    if(product.stock < quantity){
        return {data:"Low", status: 400}
    }
    cart.total += product.price * quantity;

    const upload = await cart.save();
    return upload;

}



export const updateItemToCart = async({userID, productId, quantity}: ItemInCart) => {
    
    const cart = await getActiveCartForUser({userID});
    const existsInCart = cart.items.find( (p) => p.product.toString() === productId)

    if(!existsInCart){
        return {data: "Item not exists", status: 400}
    }

    const product = await productModel.findById(productId);

    if(!product){
        return {data: "Product not found", status: 400};
    }
    if(product.stock < quantity){
        return {data:"Low", status: 400}
    }


    const otherCartItems = cart.items.filter( (p)=> p.product.toString() !== productId);

    let total = otherCartItems.reduce( (sum, product) => {
        return sum + (product.quantity * product.unitPrice);

    },0)

    existsInCart.quantity = quantity;
    total += existsInCart.quantity * existsInCart.unitPrice;

    cart.total = total;
    const update = await cart.save();
    return {data: update, status: 200}


}