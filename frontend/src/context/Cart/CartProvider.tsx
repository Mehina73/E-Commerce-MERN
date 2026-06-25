import { useEffect, useState, type FC, type PropsWithChildren } from "react";
import { CartContext } from "./CartContext";
import type { CartItem } from "../../types/CartItem";
import { useAuth } from "../Auth/AuthContext";


const CartProvider: FC<PropsWithChildren> = ({ children }) => {
    const { token } = useAuth();
    const [cartItem, setCartItem] = useState<CartItem[]>([]);
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [error, setError] = useState('');






    useEffect(() => {
        if (!token) {
            return;
        }


        const fetchCart = async () => {
            const response = await fetch("http://localhost:3001/mycart", {
                headers: { Authorization: `Bearer ${token}` }
            })


            if (!response.ok) {
                setError("Failed to fetch user cart. Please try again");
                return;
            }

            const cart = await response.json();


            const cartItemsMapped = cart.items.map(
                ({ product, quantity, unitPrice }: { product: any; quantity: number; unitPrice: number }) => ({
                    productId: product._id,
                    title: product.title,
                    image: product.image,
                    quantity,
                    unitPrice
                })
            );


            setCartItem(cartItemsMapped);
            setTotalAmount(cart.total)

        };




        fetchCart();
    }, [token]);





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

            const result = await response.json();
            const cart = result.data;

            if (!cart) {
                setError('Failed to parse cart data')
            }



            const cartItemsMapped = cart.items.map(
                ({ product, quantity }: { product: any, quantity: number, unitPrice: number }) => ({
                    productId: product._id,
                    title: product.title,
                    image: product.image,
                    quantity,
                    unitPrice: product.unitPrice,
                })
            );

            setCartItem(cartItemsMapped);
            setTotalAmount(cart.total)

        } catch (error) {
            console.error(error);
        }




    }



    const updateItemInCart = async (productId: string, quantity: number) => {
        try {
            const response = await fetch('http://localhost:3001/cart/item', {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ productId, quantity })
            })

            if (!response.ok) {
                setError('Failed to update to cart');
            }

            const result = await response.json();
            const cart = result.data;

            if (!cart) {
                setError('Failed to parse cart data')
            }



            const cartItemsMapped = cart.items.map(
                ({ product, quantity, unitPrice }: { product: any, quantity: number, unitPrice: number }) => ({
                    productId: product._id,
                    title: product.title,
                    image: product.image,
                    quantity,
                    unitPrice
                })
            );

            setCartItem(cartItemsMapped);
            setTotalAmount(cart.total)

        } catch (error) {
            console.error(error);
        }




    }





    return (
        <CartContext.Provider value={{ cartItem, totalAmount, addItemToCart, updateItemInCart }}>
            {children}
        </CartContext.Provider>

    );
};

export default CartProvider;