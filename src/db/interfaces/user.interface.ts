import type { HydratedDocument, Types } from "mongoose";
import type {
  ProvidersEnum,
  GenderEnum,
} from "../../utils/constants/enum.constants.ts";

export interface IUser {
  id?: Types.ObjectId; // virtual

  fullName?: string;
  firstName: string;
  lastName: string; // vitual

  email: string;
  confirmEmailOtp?: {
    code: string;
    expiresAt: Date;
    count?: number;
  };
  confirmedAt?: Date;

  password: string;
  forgetPasswordOtp?: {
    code: string;
    expiresAt: Date;
    count?: number;
  };
  forgetPasswordVerificationExpiresAt?: Date;
  lastResetPasswordAt?: Date;

  changeCredentialsTime?: Date;

  gender: GenderEnum;
  authProvider: ProvidersEnum;

  phoneNumber?: string;

  dateOfBirth?: Date;

  profilePicture: {
    url: string;
    provider: ProvidersEnum;
  };

  // Acadamic Info
  education?: string;
  skills?: string[];
  coursesAndCertifications?: string[];
  careerPathId?: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export type HIUserType = HydratedDocument<IUser>;
