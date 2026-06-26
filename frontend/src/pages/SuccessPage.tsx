import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
} from "@mui/material";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";

import { useNavigate } from "react-router-dom";

const SuccessPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper
        elevation={4}
        sx={{
          p: 5,
          textAlign: "center",
          borderRadius: 3,
        }}
      >
        <CheckCircleRoundedIcon
          color="success"
          sx={{
            fontSize: 90,
            mb: 2,
          }}
        />

        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 'bold' }}
        >
          Order Placed Successfully!
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          Thank you for shopping with us.
          <br />
          Your order has been received and is now being processed.
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Button
            variant="contained"
            size="large"
            startIcon={<ShoppingBagRoundedIcon />}
            onClick={() => navigate("/my-orders")}
          >
            View My Orders
          </Button>

          <Button
            variant="outlined"
            size="large"
            startIcon={<HomeRoundedIcon />}
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default SuccessPage;