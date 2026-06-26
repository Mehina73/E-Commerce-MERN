import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import { Tabs, Tab, Button } from "@mui/material";
import Slide from "@mui/material/Slide";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import CssBaseline from "@mui/material/CssBaseline";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import { useAuth } from "../context/Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import Badge from "@mui/material/Badge";

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
  console.log("From nav", { username, token })
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
  navigate('/cart')
}

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
                    <Tooltip title="Cart">
                      <IconButton color="inherit" onClick={handleCart}>
                        <Badge badgeContent={3} color="error">
                          <ShoppingCartIcon />
                        </Badge>

                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Profile">
                      <>
                        <Typography>{username}</Typography>
                        <IconButton sx={{ p: 0 }}>
                          <Avatar alt="profile" src="/profile.jpg" />

                        </IconButton>
                        <Button color="inherit" onClick={handleLogout}>Logout</Button>
                      </>
                    </Tooltip>
                  </>) : (
                  <Button onClick={handleLogin}>Login</Button>
                )}

              </Box>

            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>
    </>
  );
}

export default ResponsiveAppBar;