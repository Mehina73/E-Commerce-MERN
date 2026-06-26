
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
} from "@mui/material";
import { useState } from "react";
import { useAuth } from "../context/Auth/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [user, setUser] = useState({
        email: "",
        password: ""
    });


    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser({
            ...user, [e.target.name]: e.target.value,
        });
    };

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();


        if (!user.email || !user.password) {
            alert("Please Enter All Data")
            return;
        }

        try {
            const response = await fetch("http://localhost:3001/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: user.email,
                        password: user.password
                    }),
                }
            );

            const result = await response.json();

            console.log(result);

            if (!response.ok) {
                alert(result.data);
                return;
            }



            login(user.email, result.data);
            navigate('/')



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
                    Login
                </Typography>

                <Box
                    component="form"
                    onSubmit={handleLogin}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                    }}
                >

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

                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                    >
                        Login
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default LoginPage;