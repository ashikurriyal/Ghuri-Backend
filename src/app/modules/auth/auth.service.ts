import httpStatus from "http-status-codes";
import { User } from "../user/user.model";
import AppError from "../../errorHelpers/AppError";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken'

const credentialsLogin = async (payload: { email: string; password: string }) => {
    const { email, password } = payload;

    const isUserExist = await User.findOne({ email })

    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User Doesnot Exists");
    }

    const isPasswordMatch = await bcryptjs.compare(password as string, isUserExist.password as string)

    if (!isPasswordMatch) {
        throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password");
    }

    //jwt implementation
    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }

    const accessToken = jwt.sign(jwtPayload, 'secret', {
        expiresIn: '1d'
    })

    return {
        // email: isUserExist.email
        accessToken
    }
}

export const AuthServices = {
    credentialsLogin
}