import { Request, Response } from "express";
import { User } from "./user.model";
import httpStatus from "http-status-codes"

const createUser = async (req: Request, res: Response) => {
    try {
        const {name, email} = req.body;
        const user = await User.create({
            name: name,
            email: email
        })
        res.status(httpStatus.CREATED).json({
            message: "User Created Successfully!!",
            user
        })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        console.log(err);
        res.status(httpStatus.BAD_REQUEST).json({
            message: `Something Went Wrong!! ${err.message}`,
            err
        })
    }
}


export const UserControllers = {
    createUser
}