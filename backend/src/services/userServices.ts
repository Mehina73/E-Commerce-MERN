import { userModel } from "../models/userModel";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { orderModel } from "../models/orderModel";
import { sessionModel } from "../models/sessionModel";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import mongoose from "mongoose";
import { createUserSession } from "../utils/session";






// Register a new user
interface IRegisterData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

export const userRegister = async (
    { firstName, lastName, email, password }: IRegisterData,
    ipAddress?: string,
    userAgent?: string) => {

    try {
        const findUser = await userModel.findOne({ email: email });

        if (findUser) {
            return { status: 400, data: "User already exists", };
        }

        const hashedpass = await bcrypt.hash(password, 12);
        const newUser = new userModel({ firstName, lastName, email, password: hashedpass });
        await newUser.save();

        // Create user session and generate tokens
        const tokens = await createUserSession(
            newUser,
            ipAddress,
            userAgent
        );
        return {
            status: 201, data: tokens
        };
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
            return { status: 404, data: "Invalid username or password" };
        }

        const passMatch = await bcrypt.compare(loginData.password, findUser.password)
        if (!passMatch) {
            return { status: 404, data: "Invalid username or password" };
        }

        // Create user session and generate tokens
        const tokens = await createUserSession(
            findUser,
            ipAddress,
            userAgent
        );

        return {
            status: 200, data: tokens
        };

    } catch (err) {
        throw new Error(`Error logging in user: ${err}`);
    }

}


//=======================================================
// Get my orders
export const getMyOrders = async (userID: string) => {

    try {

        const myorders = await orderModel.find({ userID });

        return { status: 200, data: myorders };

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