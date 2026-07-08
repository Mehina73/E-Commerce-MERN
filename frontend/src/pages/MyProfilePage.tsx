import {
    Avatar,
    Box,
    Button,
    Container,
    Paper,
    TextField,
    Typography,
    Alert,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { useEffect, useState } from "react";
import { useAuth } from "../context/Auth/AuthContext";

interface ProfileData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

const MyProfilePage = () => {
    const { token, login } = useAuth();

    const [profile, setProfile] = useState<ProfileData>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });

    const [form, setForm] = useState<ProfileData>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch("http://localhost:3001/my-profile", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                setProfile({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    password: "",
                });

                setForm({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    password: "",
                });
            } catch (err) {
                console.error(err);
            }
        };

        fetchProfile();
    }, [token]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });

        setError("");
        setSuccess("");
    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:3001/my-profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });

            const result = await response.json();


            if (!response.ok) {
                setError(result.data || "Failed to update profile");
                return;
            }

            // Update AuthContext with new token
            login(form.email, result);

            // Clear password field
            setProfile({
                ...form,
                password: "",
            });

            setForm(prev => ({
                ...prev,
                password: "",
            }));

            setSuccess("Profile updated successfully.");

        } catch (err) {
            console.error(err);
            setError("Something went wrong.");
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    borderRadius: 3,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        mb: 4,
                    }}
                >
                    <Avatar
                        sx={{
                            width: 90,
                            height: 90,
                            mb: 2,
                        }}
                    >
                        <PersonIcon sx={{ fontSize: 45 }} />
                    </Avatar>

                    <Typography variant="h4">
                        My Profile
                    </Typography>

                    <Typography
                        dangerouslySetInnerHTML={{
                            __html: profile.firstName + " " + profile.lastName,
                        }}
                    />
                    {/* {profile.firstName} {profile.lastName} */}
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {success}
                    </Alert>
                )}

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                    }}
                >
                    <TextField
                        label="First Name"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        required
                        fullWidth
                    />

                    <TextField
                        label="Last Name"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        required
                        fullWidth
                    />

                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        fullWidth
                    />

                    <TextField
                        label="New Password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        helperText="Leave blank to keep your current password"
                        fullWidth
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        sx={{ mt: 2 }}
                    >
                        Save Changes
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default MyProfilePage;