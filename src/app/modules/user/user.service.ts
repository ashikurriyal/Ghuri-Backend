import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import envVars from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const createUser = async (payload: IUser) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { email, auths, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email })

  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exists");
  }

  const hashedPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_AROUND))

  // const isPasswordMatch = await bcryptjs.compare(password as string, hashedPassword)

  // console.log(isPasswordMatch)

  const authProvider: IAuthProvider = { provider: 'credentials', providerId: email as string };

  const user = await User.create({
    email,
    auths: [authProvider],
    password: hashedPassword,
    ...rest
  });

  return user;
};

const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {
  /*
  email - cant update
  name, phone, address
  password - rehashing
  only admin superadmin - role, isDeleted...
  promoting to superadmin - superadmin (admin cant promote superadmin)
  */

  const ifUserExist = await User.findById(userId);

  if(!ifUserExist){
    throw new AppError(httpStatus.NOT_FOUND, 'User Not Found')
  }

  // if(ifUserExist.isDeleted || ifUserExist.isActive === IsActive.BLOCKED){
  //   throw new AppError(httpStatus.FORBIDDEN, 'This user can not be updated')
  // }

  if (payload.role) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized');
    }

    if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
      throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized');
    }
  }

  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized');
    }
  }

  if(payload.password){
    payload.password = await bcryptjs.hash(payload.password, envVars.BCRYPT_SALT_AROUND)
  }

  const newUpdateUser = await User.findByIdAndUpdate(userId, payload, {new: true, runValidators: true})

  return newUpdateUser;
}

const getAllUsers = async () => {
  const users = await User.find({});
  const totalUsers = await User.countDocuments();

  return {
    data: users,
    meta: {
      total: totalUsers,
    },
  };
};

export const UserServices = {
  createUser,
  getAllUsers,
  updateUser
};
