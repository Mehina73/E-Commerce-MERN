
import { useAuth } from "../context/Auth/AuthContext";
import { Box, Container, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useCart } from "../context/Cart/CartContext";


const CartPage = () => {
    const { token } = useAuth();
    const { cartItem, totalAmount } = useCart();
    const [error, setError] = useState("");

    // useEffect(() => {
    //     if (!token) {
    //         return;
    //     }


    //     const fetchCart = async () => {
    //         const response = await fetch("http://localhost:3001/mycart", {
    //             headers: { Authorization: `Bearer ${token}` }
    //         })


    //         if (!response.ok) {
    //             setError("Failed to fetch user cart. Please try again");
    //             return;
    //         }

    //         const data = await response.json();
    //         setCart(data);

    //     };

    //     fetchCart();
    // }, [token]);

    console.log(cartItem);
    return (
        <Container sx={{ mt: 2 }}>
            <Typography variant="h4">My Cart</Typography>
            {cartItem.map((item) => (
                <Box> {item.title}</Box>
            ))}
        </Container>
    )



}



export default CartPage;

