import dotenv from 'dotenv'
import { env } from "./config/env";
import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';
import cartRoutes from './routes/cartRoutes';
import cors from 'cors';
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const port = 3001;

app.use(express.json());
app.use(cookieParser());

// ============== CORS configuration ==============
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:8000"
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

// ================================================
mongoose.connect(env.DATABASE_URL || "")
.then(()=> console.log("Connected to MongoDB"))
.catch(()=> console.log("Failed to connect to MongoDB"));

app.use(userRoutes);
app.use(productRoutes);
app.use(cartRoutes)

app.listen(port,()=>{
    console.log("Server is running on port " + port)
})