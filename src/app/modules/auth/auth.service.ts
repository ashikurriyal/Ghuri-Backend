import httpStatus from "http-status-codes";
import { User } from "../user/user.model";
import AppError from "../../errorHelpers/AppError";
import bcryptjs from 'bcryptjs';

import { createUserTokens } from "../../utils/userToken";
import { generateToken, verifyToken } from "../../utils/jwt";
import envVars from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { IsActive } from "../user/user.interface";

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
    // const jwtPayload = {
    //     userId: isUserExist._id,
    //     email: isUserExist.email,
    //     role: isUserExist.role
    // }

    // const accessToken = jwt.sign(jwtPayload, 'secret', {
    //     expiresIn: '1d'
    // })

    // const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)

    // const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES);

    const userTokens = createUserTokens(isUserExist);

    // delete isUserExist.password;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pass, ...rest } = isUserExist.toObject();

    return {
        // email: isUserExist.email
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
        user: rest
    }
}

const getNewAccessToken = async (refreshToken: string) => {
    const verifiedRefreshToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload

    const isUserExist = await User.findOne({ email: verifiedRefreshToken.email })

    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User Doesnot Exists");
    }
    if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
        throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`);
    }
    if (isUserExist.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
    }

    //jwt implementation
    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }
    const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)
    
    return {

        accessToken,
    }
}

export const AuthServices = {
    credentialsLogin,
    getNewAccessToken,
}