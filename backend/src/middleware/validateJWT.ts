import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'
import { userModel } from "../models/userModel";
import { ExtendRequest } from "../types/extendedRequest";


export const validateJWT = (req: ExtendRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).send("Not authenticated");
    }

    jwt.verify(token, process.env.JWT_SECRETE!, {
        algorithms: ["HS256"],
    }, async (
        err: jwt.VerifyErrors | null,
        payload: string | jwt.JwtPayload | undefined) => {


        if (err) {
            res.status(403).send("Invalid Token");
            return;
        }

        if (!payload || typeof payload === "string") {
            return res.status(401).json({
                message: "Invalid Token",
            });
        }


        const userPayload = payload as {
            firstName: string,
            lastName: string
            email: string
        }

        try {
            const user = await userModel.findOne({ email: userPayload.email }).select("-password");;

            if (!user) {
                return res.status(401).send("User not found");
            }


            req.user = user;
            next();
        } catch (err) {
            res.status(500).send("Internal Server Error");
        }

    })


}

