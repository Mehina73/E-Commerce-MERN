import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'
import { userModel } from "../models/userModel";
import { ExtendRequest } from "../types/extendedRequest";


export const validateJWT = (req: ExtendRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).send("Not authenticated");
    }

    jwt.verify(token, process.env.JWT_SECRETE!, async (
        err: jwt.VerifyErrors | null,
        payload: string | jwt.JwtPayload | undefined) => {

            
        if (err) {
            res.status(403).send("Invalid Token");
            return;
        }


        const userPayload = payload as {
            firstName: string,
            lastName: string
            email: string
        }

        const user = await userModel.findOne({ email: userPayload.email });
        req.user = user;
        next();

    })


}

