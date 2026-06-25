import { createContext, useContext } from "react";
import type { CartItem } from "../../types/CartItem";


interface CartContextType {
    cartItem: CartItem[];
    totalAmount: number;
    addItemToCart: (productId: string) => void;
    updateItemInCart: (productId: string, quantity: number) => void
    
}


export const CartContext = createContext<CartContextType>({
    cartItem: [],
    totalAmount: 0,
    addItemToCart: () => {},
    updateItemInCart: () => {}
});

export const useCart = () => useContext(CartContext);