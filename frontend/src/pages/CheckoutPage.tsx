import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useCart } from "../context/Cart/CartContext";
import { Navigate, useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItem, totalAmount, checkout } = useCart();
  const [address, setAddress] = useState("");
  



  
  const handleCheckout = async () => {
    if (!address.trim()) {
      alert("Please enter your shipping address.");
      return;
    }

    await checkout(address);
    navigate('/cart/success')

  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>

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
        {/* Shipping Address */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Shipping Address
          </Typography>

          <TextField
            fullWidth
            multiline
            minRows={5}
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </Paper>

        {/* Order Summary */}
        <Paper sx={{ p: 3, height: "fit-content" }}>
          <Typography variant="h6">
            Order Summary
          </Typography>

          <Divider sx={{ my: 2 }} />

          {cartItem.map((item) => (
            <Box
              key={item.productId}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography>
                {item.title} × {item.quantity}
              </Typography>

              <Typography>
                $
                {(item.unitPrice * item.quantity).toFixed(2)}
              </Typography>
            </Box>
          ))}

          <Divider sx={{ my: 2 }} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography sx={{ fontWeight: "bold" }}>
              Total
            </Typography>

            <Typography sx={{ fontWeight: "bold" }}>
              ${totalAmount.toFixed(2)}
            </Typography>
          </Box>

          <Button
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3 }}
            onClick={handleCheckout}
          >
            Place Order
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default CheckoutPage;