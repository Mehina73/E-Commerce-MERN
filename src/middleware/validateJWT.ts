import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'
import { userModel } from "../models/userModel";
import { ExtendRequest } from "../types/extendedRequest";


export const validateJWT = (req: ExtendRequest,res: Response,next: NextFunction) => {
    const authHeader = req.get('authorization');

    if(!authHeader){
        res.status(401).send("auth header was not exist");
        return; 
    }

    const token = authHeader.split(" ")[1];
    if(!token){
        res.status(401).send("Bearer token was not exist");
        return; 
    }

    jwt.verify(token, process.env.JWT_SECRETE || '', async(err,payload) => {
        if(err){
            res.status(403).send("Invalid Token");
            return;
        }

        if(!payload){
            res.status(403).send("Invalid Token payload");
            return;            
        }

        const userPayload = payload as {
            firstName: string,
            lastName: string
            email: string
        }

        const user = await userModel.findOne({ email: userPayload.email});
        req.user = user;
        next();

    })


}

