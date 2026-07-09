import mongoose = require("mongoose");

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
  GUIDE = "GUIDE",
}

//authProviders = emailpassword, google auth,
export interface IAuthProvider {
  provider: "google" | "credentials"; //Google, Credential
  providerId: string;
}

export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IUser {
  _id ?: mongoose.Types.ObjectId
  name: string;
  email: string;
  password?: string;
  phone?: string;
  picture?: string;
  address?: string;
  isDeleted?: boolean;
  isActive?: IsActive;
  isVerified?: boolean;
  role: Role;
  auths: IAuthProvider[];
  bookings: mongoose.Types.ObjectId[];
  guides?: mongoose.Types.ObjectId[];
}
