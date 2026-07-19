import { Request, Response, NextFunction } from "express";
import { sessionModel } from "../models/sessionModel";
import { verifyAccessToken } from "../utils/jwt";
import { userModel } from "../models/userModel";
import { ExtendRequest } from "../types/extendedRequest";


export const validateJWT = async (req: ExtendRequest, res: Response, next: NextFunction) => {

    try {
        const accessToken = req.cookies.accessToken;

        if (!accessToken) {
            return res.status(401).send("Authentication required");
        }

        const payload = verifyAccessToken(accessToken);

        const session = await sessionModel.findById(payload.sid).populate({ path: "userId", select: "-password" });

        // Check if the session is valid
        if (
            !session ||
            session.revoked ||
            session.expiresAt < new Date()
        ) {
            return res.status(401).json({
                message: "Session expired",
            });
        }

        // Check if the user exists
        req.user = session.userId;
        if (!req.user) {
            return res.status(401).json({
                message: "User not found",
            });
        }

        next();
    } catch (err) {
        res.status(401).send("Invalid access token");
    }

}



