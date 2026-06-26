import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Divider,
  Typography,
} from "@mui/material";

import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import { useEffect, useState } from "react";
import { useAuth } from "../context/Auth/AuthContext";

interface OrderItem {
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
}

interface Order {
  _id: string;
  total: number;
  createdAt: string;
  orderItems: OrderItem[];
}

const MyOrdersPage = () => {
  const { token } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch(
        "http://localhost:3001/my-orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      setOrders(data);
    };

    fetchOrders();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
      >
        My Orders
      </Typography>

      {orders.map((order) => (
        <Card
          key={order._id}
          sx={{
            mb: 3,
          }}
        >
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">
                Order #{order._id.slice(-6).toUpperCase()}
              </Typography>

              <Chip
                color="success"
                label="Completed"
              />
            </Box>

            <Typography
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              {order.orderItems.length} Items
            </Typography>

            <Divider sx={{ mb: 2 }} />

            {order.orderItems.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <CardMedia
                  component="img"
                  image={item.productImage}
                  sx={{
                    width: 80,
                    height: 80,
                    objectFit: "contain",
                    mr: 2,
                  }}
                />

                <Box sx={{ flexGrow: 1 }}>
                  <Typography sx={{ fontWeight: "bold" }}>
                    {item.productName}
                  </Typography>

                  <Typography color="text.secondary">
                    Quantity: {item.quantity}
                  </Typography>

                  <Typography>
                    $
                    {(item.quantity * item.unitPrice).toFixed(2)}
                  </Typography>
                </Box>
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
                ${order.total.toFixed(2)}
              </Typography>
            </Box>

            <Typography
              color="text.secondary"
              sx={{
                mt: 2,
                textAlign: "right",
              }}
            >
              {new Date(order.createdAt).toLocaleDateString()}
            </Typography>
          </CardContent>
        </Card>
      ))}

      {orders.length === 0 && (
        <Box
          sx={{
            mt: 8,
            textAlign: "center",
          }}
        >
          <Inventory2RoundedIcon
            sx={{
              fontSize: 70,
              color: "gray",
            }}
          />

          <Typography
            variant="h6"
            sx={{ mt: 2 }}
          >
            You haven't placed any orders yet.
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default MyOrdersPage;