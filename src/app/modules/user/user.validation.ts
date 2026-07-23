import z from "zod";
import { IsActive, Role } from "./user.interface";

export const createUserZodSchema = z.object({
    body: z.object({
        name: z
            .string({ message: "Name must be a string" })
            .min(3, { message: "Name must be at least 3 characters long" })
            .max(50, { message: "Name cannot exceed 50 characters" }),

        email: z
            .string({
                message: "Email is required",
            })
            .email({ message: "Invalid email address format" }),

        password: z
            .string({
                message: "Password is required",
            })
            .min(8, { message: "Password must be at least 8 characters long" })
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
                {
                    message:
                        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
                },
            ),

        phone: z
            .string()
            .regex(/^(\+8801|01)[0-9]{9}$/, {
                message:
                    "Phone number must be a valid Bangladeshi number (e.g., +8801xxxxxxxxx or 01xxxxxxxxx)",
            })
            .optional(),

        address: z
            .string({ message: "Address must be string" })
            .max(200, { message: "Address cannot exceed 200 characters" })
            .optional()
    }),
});


export const updateUserZodSchema = z.object({
    body: z.object({
        name: z
            .string({ message: "Name must be a string" })
            .min(3, { message: "Name must be at least 3 characters long" })
            .max(50, { message: "Name cannot exceed 50 characters" }).optional(),

        password: z
            .string({
                message: "Password is required",
            })
            .min(8, { message: "Password must be at least 8 characters long" })
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
                {
                    message:
                        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
                },
            ).optional(),

        phone: z
            .string()
            .regex(/^(\+8801|01)[0-9]{9}$/, {
                message:
                    "Phone number must be a valid Bangladeshi number (e.g., +8801xxxxxxxxx or 01xxxxxxxxx)",
            })
            .optional(),


        role: z
            .enum(Object.values(Role) as [string])
            .optional(),
        isActive: z
            .enum(Object.values(IsActive) as [string])
            .optional(),
        isDeleted: z
            .boolean({ message: "isDeleted must be true or false" })
            .optional(),
        isVerified: z
            .boolean({ message: "isVerified must be true or false" })
            .optional(),
        address: z
            .string({ message: "Address must be string" })
            .max(200, { message: "Address cannot exceed 200 characters" })
            .optional()
    }),
});