import express from 'express'
import { getAllProducts, createNewProduct, getProductById, updateProduct, deleteProduct } from '../services/productService';

const router = express.Router();


// Retreive all products
router.get('/products', async (req, res) => {
    try {
        const result = await getAllProducts()
        res.send(result);
    } catch (error) {
        res.send("Something went wrong").status(500)
    }


})


// Create new product
router.post('/products', async (req, res) => {
    try {
        const data = req.body
        const result = await createNewProduct(data);
        res.send(result)
    } catch (error) {
        res.send("Something went wrong").status(500)
    }


});


// Get Product by ID
router.get('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await getProductById(id)
        res.send(result);
    } catch (error) {
        res.send("Something went wrong").status(500)
    }


})


// Update Product
router.put('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const result = await updateProduct(id, data)
        res.send(result);
    } catch (error) {
        res.send("Something went wrong").status(500)
    }


})


// Delete Product
router.delete('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deleteProduct(id)
        res.send(result);

    } catch (error) {
        res.send("Something went wrong").status(500)
    }

})




export default router;