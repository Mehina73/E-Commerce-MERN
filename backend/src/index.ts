import dotenv from 'dotenv'
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

app.use(cors({
    origin: true,
    credentials: true,
}));

mongoose.connect(process.env.DATABASE_URL || "")
.then(()=> console.log("Connected to MongoDB"))
.catch(()=> console.log("Failed to connect to MongoDB"));

app.use(userRoutes);
app.use(productRoutes);
app.use(cartRoutes)

app.listen(port,()=>{
    console.log("Server is running on port " + port)
})