import express from 'express';
import { getMyOrders, userLogin, userRegister } from '../services/userServices';
import { validateJWT } from '../middleware/validateJWT';
import { ExtendRequest } from '../types/extendedRequest';

const router = express.Router();


// Register a new user
router.post('/register', async (req,res)=>{
    try{
        const {firstName, lastName, email, password} = req.body;
        const result = await userRegister({firstName, lastName, email, password})
        res.status(result.status).json(result);
    } catch(err){
        throw new Error(`Error registering user: ${err}`);
    }

});




// Login a user
router.post('/login', async (req,res) => {
    try{
        const {email, password}= req.body
        const result = await userLogin({email, password});
        res.status(result.status).json(result);
    }catch(err){
        res.send("Invalid Email or Password")
    }

})



// Get my orders
router.get('/my-orders', validateJWT, async(req: ExtendRequest,res) => {
    try{
        const userID = req?.user?._id;
        const orders = await getMyOrders(userID);
        res.status(orders.status).json(orders.data);
    } catch(err){
        res.status(500).send("Can't find orders")
    }
})

export default router;