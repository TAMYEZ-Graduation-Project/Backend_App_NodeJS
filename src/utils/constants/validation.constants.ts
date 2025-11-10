import z from "zod";
import StringConstants from "./strings.constants.ts";
import AppRegex from "./regex.constants.ts";

const generalValidationConstants = {
  fullName: z
    .string({ error: StringConstants.PATH_REQUIRED_MESSAGE("fullName") })
    .regex(AppRegex.fullNameRegex, StringConstants.NAME_VALIDATION_MESSAGE),

  password: z
    .string({ error: StringConstants.PATH_REQUIRED_MESSAGE("password") })
    .regex(AppRegex.passwordRegex, StringConstants.PASSWORD_VALIDATION_MESSAGE),

  confirmPasswordChecker: (
    data: { confirmPassword: string; password: String } & Record<string, any>,
    ctx: z.core.$RefinementCtx
  ) => {
    if (data.confirmPassword !== data.password) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: StringConstants.MISMATCH_CONFIRM_PASSWORD_MESSAGE,
      });
    }
  },
};

export default generalValidationConstants;
