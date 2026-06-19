import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';

const app = express();
const port = 3001;

app.use(express.json());

mongoose.connect("mongodb://localhost:27017/ecommerce")
.then(()=> console.log("Connected to MongoDB"))
.catch(()=> console.log("Failed to connect to MongoDB"));

app.use(userRoutes);
app.use(productRoutes);


app.listen(port,()=>{
    console.log("Server is running on port " + port)
})