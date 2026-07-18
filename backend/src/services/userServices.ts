import { userModel } from "../models/userModel";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { orderModel } from "../models/orderModel";
import { sessionModel } from "../models/sessionModel";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import mongoose from "mongoose";






// Register a new user
interface IRegisterData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

export const userRegister = async ({ firstName, lastName, email, password }: IRegisterData) => {

    try {
        const findUser = await userModel.findOne({ email: email });

        if (findUser) {
            return { data: "User already exists", status: 400 };
        }

        const hashedpass = await bcrypt.hash(password, 12);
        const newUser = new userModel({ firstName, lastName, email, password: hashedpass });
        await newUser.save();
        return { data: generateJWT({ firstName, lastName, email }), status: 201 };
    } catch (err) {
        throw new Error(`Error registering user: ${err}`);
    }

}



//=======================================================
// Login a user
interface ILoginData {
    email: string;
    password: string;
}
// Login a user
export const userLogin = async (
    loginData: ILoginData,
    ipAddress?: string,
    userAgent?: string) => {

    try {
        const findUser = await userModel.findOne({ email: loginData.email });

        if (!findUser) {
            return { data: "Invalid username or password", status: 404 };
        }


        const passMatch = await bcrypt.compare(loginData.password, findUser.password)
        if (!passMatch) {
            return { data: "Invalid username or password", status: 404 };
        }

        // Generate Session ID before saving
        const sessionId = new mongoose.Types.ObjectId();

        const payload = {
            sub: findUser._id.toString(),
            sid: sessionId.toString(),
        };

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        const refreshTokenHash = await bcrypt.hash(
            refreshToken,
            10
        );

        await sessionModel.create({
            _id: sessionId,
            userId: findUser._id,
            refreshTokenHash,
            expiresAt: new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000
            ),
            revoked: false,
            ipAddress: ipAddress ?? "",
            userAgent: userAgent ?? "",
        });


        return {  status: 200, data: {
                accessToken,
                refreshToken,
                username: findUser.email,
            } };

    } catch (err) {
        throw new Error(`Error logging in user: ${err}`);
    }

}


//=======================================================
// Get my orders
export const getMyOrders = async (userID: string) => {

    try {

        const myorders = await orderModel.find({ userID });

        return { data: myorders, status: 200 };

    } catch (err) {
        throw new Error(`Error get orders: ${err}`);
    }

}


//=======================================================
// Update my profile
interface IUpdateProfile {
    userID: string;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
}


export const updateMyProfile = async ({ userID, firstName, lastName, email, password }: IUpdateProfile) => {

    try {
        const user = await userModel.findById(userID);


        if (!user) {
            return {
                status: 404,
                data: "User not found",
            };
        }


        // Check if another user already uses this email
        const emailExists = await userModel.findOne({
            email,
            _id: { $ne: userID }
        });

        if (emailExists) {
            return {
                status: 400,
                data: "Email already exists",
            };
        }

        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;

        if (password && password.trim() !== "") {
            user.password = await bcrypt.hash(password, 12);
        }

        await user.save();

        return {
            status: 200, data: generateJWT({ firstName: user.firstName, lastName: user.lastName, email: user.email })
        };

    } catch (err) {
        throw new Error(`Error updating profile: ${err}`);
    }

}


const generateJWT = (data: any) => {
    return jwt.sign(data, process.env.JWT_SECRETE || "", { expiresIn: '24h' })
}