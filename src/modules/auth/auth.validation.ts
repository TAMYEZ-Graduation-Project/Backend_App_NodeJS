import z from "zod";
import generalValidationConstants from "../../utils/constants/validation.constants.ts";
import type { ZodSchemaType } from "../../utils/types/valdiation_schema.type.ts";
import StringConstants from "../../utils/constants/strings.constants.ts";

class AuthValidator {
  static signUp: ZodSchemaType = {
    body: z
      .strictObject(
        {
          fullName: generalValidationConstants.fullName,
          email: z.email(StringConstants.INVALID_EMAIL_MESSAGE),
          password: generalValidationConstants.password,
          confirmPassword: z.string({
            error: StringConstants.PATH_REQUIRED_MESSAGE("confirmPassword"),
          }),
        },
        { error: StringConstants.BODY_REQUIRED_MESSAGE }
      )
      .superRefine((data, ctx) => {
        generalValidationConstants.confirmPasswordChecker(data, ctx);
      }),
  };
}

export default AuthValidator;
