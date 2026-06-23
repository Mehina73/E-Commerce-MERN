import express from 'express';
import { userLogin, userRegister } from '../services/userServices';

const router = express.Router();


// Register a new user
router.post('/register', async (req,res)=>{
    try{
        const {firstName, lastName, email, password} = req.body;
        const result = await userRegister({firstName, lastName, email, password})
        res.send(result.data).status(result.status)
    } catch(err){
        throw new Error(`Error registering user: ${err}`);
    }

});




// Login a user
router.post('/login', async (req,res) => {
    try{
        const {email, password}= req.body
        const result = await userLogin({email, password});
        res.send(result.data).status(result.status);
    }catch(err){
        res.send("Invalid Email or Password")
    }

})

export default router;