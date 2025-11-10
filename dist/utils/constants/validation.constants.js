import z from "zod";
import StringConstants from "./strings.constants.js";
import AppRegex from "./regex.constants.js";
const generalValidationConstants = {
    fullName: z
        .string({ error: StringConstants.PATH_REQUIRED_MESSAGE("fullName") })
        .regex(AppRegex.fullNameRegex, StringConstants.NAME_VALIDATION_MESSAGE),
    password: z
        .string({ error: StringConstants.PATH_REQUIRED_MESSAGE("password") })
        .regex(AppRegex.passwordRegex, StringConstants.PASSWORD_VALIDATION_MESSAGE),
    confirmPasswordChecker: (data, ctx) => {
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
