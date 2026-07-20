import jwt from "jsonwebtoken";
import { env } from "../config/env";


const ACCESS_TOKEN_SECRET = env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = env.REFRESH_TOKEN_SECRET;



console.log("ACCESS =", env.ACCESS_TOKEN_SECRET);
console.log("REFRESH =", env.REFRESH_TOKEN_SECRET);


export interface JWTPayload {
    sub: string;
    sid: string;
}

export const generateAccessToken = (payload: JWTPayload): string => {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
        expiresIn: "1m",
        algorithm: "HS256",
    });
};

export const generateRefreshToken = (payload: JWTPayload): string => {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
        expiresIn: "30d",
        algorithm: "HS256",
    });
};

export const verifyAccessToken = (token: string): JWTPayload => {
    return jwt.verify(token, ACCESS_TOKEN_SECRET, {
    algorithms: ["HS256"],
}) as JWTPayload;
};

export const verifyRefreshToken = (token: string): JWTPayload => {
    return jwt.verify(token, REFRESH_TOKEN_SECRET, {
    algorithms: ["HS256"],
}) as JWTPayload;
};