import express from 'express';
import { getMyOrders, updateMyProfile, userLogin, userRegister } from '../services/userServices';
import { validateJWT } from '../middleware/validateJWT';
import { ExtendRequest } from '../types/extendedRequest';

const router = express.Router();


// Register a new user
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const result = await userRegister({ firstName, lastName, email, password })
        res.status(result.status).json(result);
    } catch (err) {
        throw new Error(`Error registering user: ${err}`);
    }

});




// Login a user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const result = await userLogin({ email, password });

        if (result.status !== 200) {
            return res.status(result.status).json(result.data);
        }

        const tokens = result.data as {
            accessToken: string;
            refreshToken: string;
            username: string;
        };

        res.status(result.status).cookie("accessToken", tokens.accessToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: false, // true فى HTTPS
            maxAge: 15 * 60 * 1000,
        }).cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: false, // true فى HTTPS
            maxAge: 30 * 24 * 60 * 60 * 1000,
        }).json({
            username: tokens.username
        });
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }

})



// Logout
router.post("/logout", (req, res) => {

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.sendStatus(200);

});



// Get my orders
router.get('/my-orders', validateJWT, async (req: ExtendRequest, res) => {
    try {
        const userID = req?.user?._id;
        const orders = await getMyOrders(userID);
        res.status(orders.status).json(orders.data);
    } catch (err) {
        res.status(500).send("Can't find orders")
    }
})


// Get my profile
router.get('/my-profile', validateJWT, async (req: ExtendRequest, res) => {
    try {
        const userID = req?.user?._id;
        const firstName = req?.user?.firstName;
        const lastName = req?.user?.lastName;
        const email = req?.user?.email;
        //        const profile = await getMyProfile(userID);
        res.status(200).json({ firstName, lastName, email });
    } catch (err) {
        res.status(500).send("Can't find profile")
    }
})


// UPDATE my profile
router.put('/my-profile', validateJWT, async (req: ExtendRequest, res) => {
    try {
        const userID = req?.user?._id;
        const { firstName, lastName, email, password } = req.body;
        const profile = await updateMyProfile({ userID, firstName, lastName, email, password });

        if (profile.status !== 200) {
            return res.status(profile.status).json(profile.data);
        }

        res.status(profile.status).cookie("token", profile.data, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            maxAge: 24 * 60 * 60 * 1000
        }).json({ message: "Profile updated successfully" });

    } catch (err) {
        res.status(500).send("Can't UPDATE profile")
    }
})


export default router;