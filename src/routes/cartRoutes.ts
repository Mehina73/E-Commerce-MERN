import express from 'express'
import { getAllCarts, deleteAllCarts, getActiveCartForUser, addItemToCart, updateItemToCart, deleteAllItems } from '../services/cartService'
import { validateJWT } from '../middleware/validateJWT';
import { ExtendRequest } from '../types/extendedRequest';

const router = express.Router();


// // Get all carts
// router.get('/carts', async (req,res)=> {
//     const findall = await getAllCarts();
//     res.send(findall);

// })


// // Delete all carts
// router.delete('/carts', async (req,res)=> {
//     const findall = await deleteAllCarts();
//     res.send(findall);

// })


// Get active cart
router.get('/', validateJWT, async (req: ExtendRequest, res) => {
    // TO DO: get userID from token once loged in
    const userID = req?.user?._id;
    const cart = await getActiveCartForUser({userID});
    res.send(cart);
})


// Add product to cart
router.post('/item', validateJWT, async(req: ExtendRequest,res) => {
    // userID, cartID, productDetails
    const userID = req?.user?._id;
    const {productId, quantity} = req.body;
    const item = await addItemToCart({userID, productId, quantity});
    res.send(item);
}) 

// Update product in cart
router.put('/item', validateJWT, async(req: ExtendRequest,res) => {
    // userID, cartID, productDetails
    const userID = req?.user?._id;
    const {productId, quantity} = req.body;
    const item = await updateItemToCart({userID, productId, quantity});
    res.send(item);
}) 

// Delete all items from cart
router.delete('/cart', validateJWT,async(req: ExtendRequest,res) =>{
    const userID = req?.user?._id;
    const item = await deleteAllItems({userID});
    res.send(item);
})

// // Get cart
// router.get('/cart/:id')

// // Delete cart
// router.delete('/cart/:id')








export default router;