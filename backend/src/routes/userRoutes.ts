import express from 'express';
import { getMyOrders, updateMyProfile, userLogin, userRegister } from '../services/userServices';
import { validateJWT } from '../middleware/validateJWT';
import { ExtendRequest } from '../types/extendedRequest';
import { verifyRefreshToken } from '../utils/jwt';
import { sessionModel } from '../models/sessionModel';

const router = express.Router();


// Register a new user
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const result = await userRegister({ firstName, lastName, email, password }, req.ip, req.headers['user-agent']);

        if (result.status !== 201) {
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
        throw new Error(`Error registering user: ${err}`);
    }

});




// Login a user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const result = await userLogin({ email, password },
            req.ip,
            req.headers["user-agent"]
        );

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
        throw new Error(`Error Login user: ${err}`);
    }

})



// Logout
router.post('/logout', async (req, res) => {
    try {

        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');

            return res.status(200).json({
                message: 'Logged out successfully'
            });
        }

        try {

            // Verify Refresh Token
            const payload = verifyRefreshToken(refreshToken);

            // Revoke Session
            await sessionModel.findByIdAndUpdate(
                payload.sid,
                {
                    revoked: true,
                }
            );

        } catch {

        }

        res.clearCookie("accessToken", {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
        });

        return res.status(200).json({
            message: 'Logged out successfully'
        });

    } catch (err) {

        return res.status(500).json({
            message: 'Internal Server Error'
        });

    }
});



// Get my orders
router.get('/my-orders', validateJWT, async (req: ExtendRequest, res) => {
    try {
        const userID = req?.user?._id;
        const orders = await getMyOrders(userID);
        res.status(orders.status).json(orders.data);
    } catch (err) {
        res.status(500).send({ message: "Can't find orders" })
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
        res.status(500).send({ message: "Can't find profile" })
    }
})


// UPDATE my profile
router.put("/my-profile", validateJWT, async (req: ExtendRequest, res) => {

    try {

        const result = await updateMyProfile({
            userID: req.user!._id.toString(),
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            ipAddress: req.ip ?? "",
            userAgent: req.headers["user-agent"] ?? "",
        });

        if (result.status != 200) {
            return res.status(result.status).json({
                message: result.data,
            });
        }

        const data = result.data as {
            username: string;
            accessToken: string | null;
            refreshToken: string | null;
            tokensUpdated: boolean;
        };

        if (data.tokensUpdated) {

            res.cookie("accessToken", data.accessToken!, {
                httpOnly: true,
                sameSite: "lax",
                secure: false,
                maxAge: 15 * 60 * 1000,
            });

            res.cookie("refreshToken", data.refreshToken!, {
                httpOnly: true,
                sameSite: "lax",
                secure: false,
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });

        }

        return res.status(200).json({
            username: data.username,
            message: "Profile updated successfully",
        });

    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }

});


export default router;