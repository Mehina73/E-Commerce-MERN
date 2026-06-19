import express from 'express'
import {getAllProducts, createNewProduct, getProductById, updateProduct, deleteProduct} from '../services/productService';

const router = express.Router();


// Retreive all products
router.get('/products', async(req,res)=>{

    const result = await getAllProducts()
    res.send(result);

})


// Create new product
router.post('/products', async(req,res)=>{

    const data = req.body
    const result = await createNewProduct(data);
    res.send(result)

});


// Get Product by ID
router.get('/products/:id', async(req,res)=>{
    const {id} = req.params;
    const result = await getProductById(id)
    res.send(result);

})


// Update Product
router.put('/products/:id', async(req,res)=>{
    const {id} = req.params;
    const data = req.body;
    const result = await updateProduct(id, data)
    res.send(result);

})


// Delete Product
router.delete('/products/:id', async(req,res)=>{
    const {id} = req.params;
    const result = await deleteProduct(id)
    res.send(result);

})




export default router;