import z from "zod";
import generalValidationConstants from "../../utils/constants/validation.constants.js";
import StringConstants from "../../utils/constants/strings.constants.js";
class AuthValidator {
    static signUp = {
        body: z
            .strictObject({
            fullName: generalValidationConstants.fullName,
            email: z.email(StringConstants.INVALID_EMAIL_MESSAGE),
            password: generalValidationConstants.password,
            confirmPassword: z.string({
                error: StringConstants.PATH_REQUIRED_MESSAGE("confirmPassword"),
            }),
        }, { error: StringConstants.BODY_REQUIRED_MESSAGE })
            .superRefine((data, ctx) => {
            generalValidationConstants.confirmPasswordChecker(data, ctx);
        }),
    };
}
export default AuthValidator;
