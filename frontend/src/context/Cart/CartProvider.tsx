import { useState, type FC, type PropsWithChildren } from "react";
import { CartContext } from "./CartContext";
import type { CartItem } from "../../types/CartItem";
import { useAuth } from "../Auth/AuthContext";


const CartProvider: FC<PropsWithChildren> = ({ children }) => {
    const { token } = useAuth();
    const [cartItem, setCartItem] = useState<CartItem[]>([]);
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [error, setError] = useState('');

    const addItemToCart = async (productId: string) => {
        try {
            const response = await fetch('http://localhost:3001/cart/item', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ productId, quantity: 1 })
            })

            if (!response.ok) {
                setError('Failed to add to cart');
            }

            const cart = await response.json();

            if (!cart) {
                setError('Failed to parse cart data')
            }


            const cartItemsMapped = cart.items.map(
                ({ product, quantity }: any) => ({
                    productId: product._id,
                    title: product.title,
                    image: product.image,
                    quantity,
                    unitPrice: product.unitPrice,
                })
            );

            setCartItem(cartItemsMapped);
            setTotalAmount(cart.totalAmount)

        } catch (error) {
            console.error(error);
        }



        
    }


    return (
        <CartContext.Provider value={{ cartItem, totalAmount, addItemToCart }}>
            {children}
        </CartContext.Provider>

    );
};

export default CartProvider;