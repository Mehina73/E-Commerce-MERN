import express from 'express'
import { getAllProducts, createNewProduct, getProductById, updateProduct, deleteProduct } from '../services/productService';

const router = express.Router();


// Retreive all products
router.get('/products', async (req, res) => {
    try {
        const result = await getAllProducts()
        res.send(result);
    } catch (error) {
        res.status(500).send({message: "Something went wrong"})
    }


})


// Create new product
router.post('/products', async (req, res) => {
    try {
        const data = req.body
        const result = await createNewProduct(data);
        res.send(result)
    } catch (error) {
        res.status(500).send({message: "Something went wrong"})
    }


});


// Get Product by ID
router.get('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await getProductById(id)
        res.send(result);
    } catch (error) {
        res.status(500).send({message: "Something went wrong"})
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
        res.status(500).send({message: "Something went wrong"})
    }


})


// Delete Product
router.delete('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deleteProduct(id)
        res.send(result);

    } catch (error) {
        res.status(500).send({message: "Something went wrong"})
    }

})




export default router;