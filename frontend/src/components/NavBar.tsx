import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import { Tabs, Tab, Button, Divider, ListItemIcon, MenuItem, Badge } from "@mui/material";
import Slide from "@mui/material/Slide";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import CssBaseline from "@mui/material/CssBaseline";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../context/Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/Cart/CartContext";
import Menu from "@mui/material/Menu";

function HideOnScroll(props: { children: React.ReactElement }) {


  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

function ResponsiveAppBar(props: any) {
  const { username, token, isAuthenticated, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const { cartItem } = useCart();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login')
  }

  const handleLogout = () => {
    logout();
    navigate('/login')
  }


  const handleHome = () => {
    navigate('/')
  }

  const handleCart = () => {
    navigate('/mycart')
  }


  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };


  const handleOrders = () => {
    handleMenuClose();
    navigate("/my-orders");
  };

  const handleMyCart = () => {
    handleMenuClose();
    navigate("/mycart");
  };




  return (
    <>
      <CssBaseline />

      <HideOnScroll {...props}>
        <AppBar
          position="sticky"
          elevation={2}
          sx={{
            bgcolor: "#121212",
          }}
        >
          <Container maxWidth="xl">
            <Toolbar disableGutters>

              {/* Logo + Brand */}
              <Button sx={{ color: "#ffff" }} onClick={() => navigate('/')}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mr: 5,
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: "white",
                      color: "primary.main",
                      mr: 1,
                    }}
                  >
                    <LaptopMacIcon />
                  </Avatar>

                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      letterSpacing: 1,
                    }}
                  >
                    Tech Laptop
                  </Typography>
                </Box>
              </Button>

              {/* Navigation */}
              <Box sx={{ flexGrow: 1 }}>
                <Tabs
                  textColor="inherit"
                  indicatorColor="secondary"
                  value={false}
                >
                  <Tab onClick={handleHome} label="Home" />
                  <Tab label="Products" />
                  <Tab label="Categories" />
                  <Tab label="Offers" />
                </Tabs>
              </Box>

              {/* Right Side */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                {isAuthenticated ? (
                  <>
                    <Tooltip title="Cart">{<IconButton color="inherit" onClick={handleCart}><Badge badgeContent={cartItem.length} color="error"><ShoppingCartIcon /></Badge></IconButton>}</Tooltip>
                    <Typography>{username}</Typography>

                    <Tooltip title="Account">
                      <IconButton
                        sx={{ p: 0 }}
                        onClick={handleMenuOpen}
                      >
                        <Avatar alt={username ?? ""} src="/profile.jpg" />
                      </IconButton>
                    </Tooltip>

                    <Menu
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleMenuClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      sx={{
                        '& .MuiPaper-root': {
                          mt: 1,
                          minWidth: 220,
                          borderRadius: 2,
                          boxShadow: 4,
                        },
                      }}
                    >
                      <Box sx={{ px: 2, py: 1 }}>
                        <Typography sx={{ fontWeight: 'bold' }}>
                          {username}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          My Account
                        </Typography>
                      </Box>

                      <Divider />

                      <MenuItem onClick={handleOrders}>
                        <ListItemIcon>
                          <ReceiptLongIcon fontSize="small" />
                        </ListItemIcon>

                        My Orders
                      </MenuItem>

                      <MenuItem onClick={handleMyCart}>
                        <ListItemIcon>
                          <ShoppingCartCheckoutIcon fontSize="small" />
                        </ListItemIcon>

                        My Cart
                      </MenuItem>

                      <Divider />

                      <MenuItem onClick={handleLogout}>
                        <ListItemIcon>
                          <LogoutIcon color="error" fontSize="small" />
                        </ListItemIcon>

                        Logout
                      </MenuItem>
                    </Menu>
                  </>) : (
                  <Button onClick={handleLogin}>Login</Button>
                )}

              </Box>

            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll >
    </>
  );
}

export default ResponsiveAppBar;