import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Container,
    Divider,
    IconButton,
    Paper,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from "@mui/material";



import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";

import { useCart } from "../context/Cart/CartContext";
import { useState } from "react";

const CartPage = () => {
    const {
        cartItem,
        totalAmount,
        updateItemInCart,
        removeItemFromCart,
        removeCart
    } = useCart();

    // Clear Cart
    const [openDialog, setOpenDialog] = useState(false);

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleClearCart = async () => {
        await removeCart();
        setOpenDialog(false);
    };



    const handleQuantity = (productId: string, quantity: number) => {
        if (quantity < 1) {
            return;
        }
        updateItemInCart(productId, quantity)
    }


    const handleRemoveItem = (productId: string) => {
        removeItemFromCart(productId);
    }


    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>



            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>
                    Clear Shopping Cart
                </DialogTitle>

                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to remove all items from your cart?
                        <br />
                        <strong>This action cannot be undone.</strong>
                    </DialogContentText>
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                    <Button
                        onClick={handleCloseDialog}
                    >
                        Cancel
                    </Button>

                    <Button
                        color="error"
                        variant="contained"
                        startIcon={<DeleteSweepIcon />}
                        onClick={handleClearCart}
                    >
                        Clear Cart
                    </Button>
                </DialogActions>
            </Dialog>


            <Typography variant="h4" gutterBottom>
                My Cart
            </Typography>

            {cartItem.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: "center" }}>
                    <Typography variant="h6">
                        Your cart is empty
                    </Typography>
                </Paper>
            ) : (
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            md: "2fr 1fr",
                        },
                        gap: 3,
                    }}
                >
                    {/* Cart Items */}
                    <Box>
                        {cartItem.map((item) => (
                            <Card
                                key={item.productId}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    p: 2,
                                    mb: 2,
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    image={item.image}
                                    alt={item.title}
                                    sx={{
                                        width: 140,
                                        height: 140,
                                        objectFit: "contain",
                                    }}
                                />

                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6">
                                        {item.title}
                                    </Typography>

                                    <Typography color="text.secondary">
                                        Price per item: ${item.unitPrice}
                                    </Typography>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                            mt: 2,
                                        }}
                                    >
                                        <IconButton
                                            onClick={() => handleQuantity(item.productId, item.quantity - 1)}
                                        >
                                            <RemoveIcon />
                                        </IconButton>

                                        <Typography>
                                            {item.quantity}
                                        </Typography>

                                        <IconButton
                                            onClick={() => handleQuantity(item.productId, item.quantity + 1)}
                                        >
                                            <AddIcon />
                                        </IconButton>
                                    </Box>

                                    <Typography sx={{ mt: 2, fontWeight: "bold" }}>
                                        Total:
                                        {" "}
                                        $
                                        {(item.unitPrice * item.quantity).toFixed(2)}
                                    </Typography>
                                </CardContent>

                                <IconButton
                                    color="error"
                                    onClick={() => handleRemoveItem(item.productId)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Card>
                        ))}
                    </Box>

                    {/* Order Summary */}
                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            height: "fit-content",
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            Order Summary
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 2,
                            }}
                        >
                            <Typography>Total Amount</Typography>

                            <Typography sx={{ fontWeight: "bold" }}>
                                ${totalAmount.toFixed(2)}
                            </Typography>
                        </Box>

                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                        >
                            Checkout
                        </Button>

                        <Button
                            fullWidth
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteSweepIcon />}
                            onClick={handleOpenDialog}
                        >
                            Clear Cart
                        </Button>
                    </Paper>
                </Box>
            )}
        </Container>
    );
};

export default CartPage;