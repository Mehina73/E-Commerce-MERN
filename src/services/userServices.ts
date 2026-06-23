import { userModel } from "../models/userModel";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface IRegisterData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

interface ILoginData{
    email: string;
    password: string;
}


// Register a new user
export const userRegister = async ({firstName, lastName, email, password}: IRegisterData) =>{

    try{
        const findUser = await userModel.findOne({email: email});

        if(findUser){
            return { data: "User already exists", status: 400 };
        }

        const hashedpass = await bcrypt.hash(password, 12);
        const newUser = new userModel({firstName, lastName, email, password: hashedpass});
        await newUser.save();
        return { data: generateJWT({firstName, lastName, email}), status: 201 };
    }catch(err){
        throw new Error(`Error registering user: ${err}`);
    }

}



// Login a user
export const userLogin = async (loginData: ILoginData) =>{

    try{
        const findUser = await userModel.findOne({email: loginData.email});

        if(!findUser){
            return {data: "Invalid username or password", status: 404};
        }

        
        const passMatch = await bcrypt.compare(loginData.password, findUser.password)
        if(!passMatch){
            return {data: "Invalid username or password", status: 404};
        }

        return {data: generateJWT({firstName: findUser.firstName, lastName: findUser.lastName, email: findUser.email}), status: 200};     
        
    }catch(err){
        throw new Error(`Error logging in user: ${err}`);
    }

}


const generateJWT = (data: any) =>{
    return jwt.sign(data, process.env.JWT_SECRETE || "", {expiresIn:'24h'})
}