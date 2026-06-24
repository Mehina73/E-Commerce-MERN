import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { useState } from "react";

const RegisterPage = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({...user, [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (user.password !== user.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: user.password
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("Registration successful");
        console.log(result);
      } else {
        alert(result.message || "Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };




  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
        >
          Register
        </Typography>

        <Box
          component="form"
          onSubmit={handleRegister}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <TextField
            label="First Name"
            name="firstName"
            value={user.firstName}
            onChange={handleChange}
            required
            fullWidth
          />

          <TextField
            label="Last Name"
            name="lastName"
            value={user.lastName}
            onChange={handleChange}
            required
            fullWidth
          />

          <TextField
            label="Email"
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            required
            fullWidth
          />

          <TextField
            label="Password"
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            required
            fullWidth
          />

          <TextField
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={user.confirmPassword}
            onChange={handleChange}
            required
            fullWidth
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
          >
            Register
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;