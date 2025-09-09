export type TRole = "ADMIN" | "STORE_MANAGER" | "CUSTOMER";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  picture: string;
  isDeleted: boolean;
  isActive: string;
  isVerified: boolean;
  role: TRole;
  auths: Auth[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Auth {
  provider: string;
  providerId: string;
}
