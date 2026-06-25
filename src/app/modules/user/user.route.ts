import { NextFunction, Request, Response, Router } from "express";
import { UserControllers } from "./user.controller";
import { createUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { JwtPayload } from 'jsonwebtoken';
import AppError from "../../errorHelpers/AppError";
import { verifyToken } from "../../utils/jwt";
import envVars from "../../config/env";

const router = Router();

const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.headers.authorization;

    if (!accessToken) {
      throw new AppError(403, "No Token Recieved");
    }

    const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload

    // if ((verifiedToken as JwtPayload).role !== Role.ADMIN) {
    //authRoles = ['ADMIN', 'SUPER_ADMIN'].includes('ADMIN')
    if (!authRoles.includes(verifiedToken.role)) {
      throw new AppError(403, "You are not permitted to view this route");
    }

    next();

  } catch (error) {
    next(error)
  }
};

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserControllers.createUser,
);


router.get("/all-users", checkAuth("ADMIN", "SUPER_ADMIN"), UserControllers.getAllUsers);


export const UserRoutes = router;
