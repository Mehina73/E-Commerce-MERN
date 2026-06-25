
import { useAuth } from "../context/Auth/AuthContext";
import { Box, Container, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useCart } from "../context/Cart/CartContext";


const CartPage = () => {
    const { token } = useAuth();
    const { cartItem, totalAmount } = useCart();
    const [error, setError] = useState("");



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

