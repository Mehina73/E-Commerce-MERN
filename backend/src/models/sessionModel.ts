import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './userModel';

export interface ISession extends Document {
    userId: mongoose.Types.ObjectId | IUser;
    refreshTokenHash: string;
    expiresAt: Date;
    revoked: boolean;
    lastUsedAt: Date;
    ipAddress?: string;
    userAgent?: string;
}


const sessionSchema = new Schema<ISession>(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true},
        refreshTokenHash: { type: String, required: true},
        expiresAt: { type: Date, required: true},
        revoked: { type: Boolean, default: false },
        lastUsedAt: { type: Date,  default: Date.now },
        ipAddress: { type: String, default: "" },
        userAgent: { type: String,  default: ""},
    },
    {
        timestamps: true,
    }
);

export const sessionModel = mongoose.model<ISession>("Session", sessionSchema);