import { cartModel } from "../models/cartModel"
import { IOrderItem, orderModel } from "../models/orderModel";
import { productModel } from "../models/productModel";
import { Types } from "mongoose";

// Get all carts
export const getAllCarts = async () => {
    const getAllCarts = cartModel.find();
    return { data: getAllCarts, status: 200 }
}

// Delete all carts
export const deleteAllCarts = async () => {
    const getAllCarts = cartModel.findOneAndDelete();
    return { data: getAllCarts, status: 200 }
}

// Get cart
// export const getCart = async()=>{
//     const getAllCarts = cartModel.findOneAndDelete();
//     return {data: getAllCarts, status: 200}
// }


interface ICartForUser {
    userID: string
}

// Create cart for user
export const createCartForUser = async ({ userID }: ICartForUser) => {
    const cart = await cartModel.create({ userID, total: 0 });
    await cart.save();
    return cart;
}


interface GetActiveCartForUser {
    userID: string,
    populateProduct?: boolean
}


// Get active cart
export const getActiveCartForUser = async ({ userID, populateProduct }: GetActiveCartForUser) => {
    let cart;
    if (populateProduct) {
        cart = await cartModel.findOne({ userID, status: "active" }).populate("items.product");
    } else {
        cart = await cartModel.findOne({ userID, status: "active" })
    }


    if (!cart) {
        cart = await createCartForUser({ userID });
        return cart;
    }

    return cart;
}
// ==============================================
// Delete all items feom cart

interface DeleteAll {
    userID: string,
}

export const deleteAllItems = async ({ userID }: DeleteAll) => {
    const cart = await getActiveCartForUser({ userID });
    cart.items = [];
    cart.total = 0;
    const update = await cart.save();
    return { data: update, status: 200 }
}


// ==============================================
// Delete item feom cart

interface Deleteitem {
    userID: string,
    productId: any
}

export const deleteItemFromCart = async ({ userID, productId }: Deleteitem) => {
    const cart = await getActiveCartForUser({ userID });
    console.log("productId =", productId);
    const existsInCart = cart.items.find((p) => p.product.toString() === productId)

    if (!existsInCart) {
        return { data: "Item not exists", status: 400 }
    }

    const otherCartItems = cart.items.filter((p) => p.product.toString() !== productId);

    let total = otherCartItems.reduce((sum, product) => {
        return sum + (product.quantity * product.unitPrice);

    }, 0)

    cart.items = otherCartItems;
    cart.total = total;
    await cart.save();
    return { data: await getActiveCartForUser({ userID, populateProduct: true }), status: 200 }
}


// ==============================================
// Add item in cart 
interface ItemInCart {
    userID: string,
    productId: string,
    quantity: number
}



export const addItemToCart = async ({ userID, productId, quantity }: ItemInCart) => {

    const cart = (await getActiveCartForUser({ userID }));
    const existsInCart = cart.items.find((p) => p.product.toString() === productId)

    if (existsInCart) {
        return { data: "Item aleary exists", status: 400 }
    }

    const product = await productModel.findById(productId)

    if (!product) {
        return { data: "Product not found", status: 400 };
    }

    cart.items.push({
        product: product,
        unitPrice: product.price,
        quantity: quantity
    });

    if (product.stock < quantity) {
        return { data: "Low", status: 400 }
    }
    cart.total += product.price * quantity;

    await cart.save();
    return { data: await getActiveCartForUser({ userID, populateProduct: true }), status: 200 }
}

// ==============================================
// Update item in cart

export const updateItemToCart = async ({ userID, productId, quantity }: ItemInCart) => {

    const cart = await getActiveCartForUser({ userID });
    const existsInCart = cart.items.find((p) => p.product.toString() === productId)

    if (!existsInCart) {
        return { data: "Item not exists", status: 400 }
    }

    const product = await productModel.findById(productId);

    if (!product) {
        return { data: "Product not found", status: 400 };
    }
    if (product.stock < quantity) {
        return { data: "Low", status: 400 }
    }


    const otherCartItems = cart.items.filter((p) => p.product.toString() !== productId);

    let total = otherCartItems.reduce((sum, product) => {
        return sum + (product.quantity * product.unitPrice);

    }, 0)

    existsInCart.quantity = quantity;
    total += existsInCart.quantity * existsInCart.unitPrice;

    cart.total = total;
    await cart.save();
    return { data: await getActiveCartForUser({ userID, populateProduct: true }), status: 200 }

}




interface checkout {
    userID: string,
    address: string
}


export const checkout = async ({ userID, address }: checkout) => {
    const cart = await getActiveCartForUser({ userID });

    const orderItems: IOrderItem[] = [];

    for (const item of cart.items) {
        const product = await productModel.findById(item.product);

        if (!product) {
            return { data: "Product not found", statusCode: 400 }
        }

        const orderItem: IOrderItem = {
            productName: product.title,
            productImage: product.image,
            unitPrice: item.unitPrice,
            quantity: item.quantity
        }

        orderItems.push(orderItem);
    }

    const order = await orderModel.create({ orderItems, total: cart.total, address, userID });
    await order.save();

    cart.status = "completed"
    await cart.save();

    return { data: order, statusCode: 200 }
}
