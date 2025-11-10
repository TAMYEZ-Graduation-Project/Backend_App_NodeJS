import mongoose from "mongoose";
import type { IUser } from "../interfaces/user.interface.ts";
import {
  GenderEnum,
  ProvidersEnum,
} from "../../utils/constants/enum.constants.ts";

const userSchema = new mongoose.Schema<IUser>(
  {
    firstName: { type: String, required: true, minlength: 2, maxlength: 25 },
    lastName: { type: String, required: true, minlength: 2, maxlength: 25 },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    confirmedAt: { type: Date },
    confirmEmailOtp: {
      code: { type: String, required: true },
      expiresAt: { type: Date, required: true },
      count: { type: Number, default: 0 },
    },

    password: { type: String, required: true },
    forgetPasswordOtp: {
      code: { type: String, required: true },
      expiresAt: { type: Date, required: true },
      count: { type: Number, default: 0 },
    },
    forgetPasswordVerificationExpiresAt: { type: Date },
    lastResetPasswordAt: { type: Date },

    changeCredentialsTime: { type: Date },

    gender: { type: String, enum: Object.values(GenderEnum), required: true },

    authProvider: {
      type: String,
      enum: Object.values(ProvidersEnum),
      default: ProvidersEnum.local,
    },

    phoneNumber: { type: String },

    dateOfBirth: { type: Date },

    profilePicture: {
      url: { type: String, required: true },
      provider: {
        type: String,
        enum: Object.values(ProvidersEnum),
        default: ProvidersEnum.local,
      },
    },

    // Acadamic Info
    education: { type: String },
    skills: { type: [String], default: [] },
    coursesAndCertifications: { type: [String], default: [] },
    careerPathId: { type: mongoose.Schema.Types.ObjectId, ref: "CareerPath" },

    deletedAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const UserModel = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default UserModel;
