import mongoose from "mongoose";
import bcrypt from "bcrypt";

import { sessionModel } from "../models/sessionModel";
import { generateAccessToken, generateRefreshToken } from "./jwt";

interface IUser {
    _id: mongoose.Types.ObjectId;
    email: string;
}

export const createUserSession = async (
    user: IUser,
    ipAddress?: string,
    userAgent?: string
) => {

    // Create Session ID
    const sessionId = new mongoose.Types.ObjectId();

    // JWT Payload
    const payload = {
        sub: user._id.toString(),
        sid: sessionId.toString(),
    };

    // Generate Tokens
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Hash Refresh Token
    const refreshTokenHash = await bcrypt.hash(
        refreshToken,
        10
    );

    // Save Session
    await sessionModel.create({
        _id: sessionId,
        userId: user._id,
        refreshTokenHash,
        expiresAt: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
        ),
        revoked: false,
        ipAddress: ipAddress ?? "",
        userAgent: userAgent ?? "",
    });

    return {
        accessToken,
        refreshToken,
        username: user.email,
    };
};