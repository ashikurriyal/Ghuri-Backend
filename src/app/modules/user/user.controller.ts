//controller works for req res handling between server

import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes"
import { UserServices } from "./user.service";
import AppError from "../../errorHelpers/AppError";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        throw new AppError(httpStatus.BAD_REQUEST, "fake error", '')
        const user = await UserServices.createUser(req.body)
        
        res.status(httpStatus.CREATED).json({
            message: "User Created Successfully!!",
            user
        })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        console.log(err);
        // res.status(httpStatus.BAD_REQUEST).json({
        //     message: `Something Went Wrong!! ${err.message} from user controller`,
        //     err
        // })
        next(err);
    }
}


export const UserControllers = {
    createUser
}


//Route matching => Controller => service => model => DB