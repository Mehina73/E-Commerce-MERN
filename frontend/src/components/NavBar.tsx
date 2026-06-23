import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import { Tabs, Tab } from "@mui/material";
import Slide from "@mui/material/Slide";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import CssBaseline from "@mui/material/CssBaseline";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";

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
                  <Tab label="Home" />
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
                <Tooltip title="Cart">
                  <IconButton color="inherit">
                    <ShoppingCartIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Profile">
                  <IconButton sx={{ p: 0 }}>
                    <Avatar alt="profile" src="/profile.jpg" />
                  </IconButton>
                </Tooltip>
              </Box>

            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>
    </>
  );
}

export default ResponsiveAppBar;