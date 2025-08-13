import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import { envVars } from "../../config/env";

import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import AppError from "../../errorHelper/AppError";
import { JwtPayload } from "jsonwebtoken";

const createUser = async (payload: Partial<IUser>) => {
  const { phone, email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist");
  }

  const hashedPassword = await bcryptjs.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    phone,
    email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
  });

  return user;
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const isUserExist = await User.findById(userId);
  if (
    decodedToken.role === Role.CUSTOMER ||
    decodedToken.role === Role.STORE_MANAGER
  ) {
    if (userId !== decodedToken.userId) {
      throw new AppError(401, "You are not authorized .");
    }
  }

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Not Found");
  }
  if (
    decodedToken.role === Role.STORE_MANAGER &&
    isUserExist.role === Role.ADMIN
  ) {
    throw new AppError(401, "You are not authorized !");
  }
  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });
  return newUpdatedUser;
};

const getMe = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  return {
    data: user,
  };
};

export const UserServices = {
  createUser,
  updateUser,
  getMe,
};
