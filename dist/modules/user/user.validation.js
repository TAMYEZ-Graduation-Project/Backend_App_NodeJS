import { z } from "zod";
import generalValidationConstants from "../../utils/constants/validation.constants.js";
import fileValidation from "../../utils/multer/file_validation.multer.js";
import StringConstants from "../../utils/constants/strings.constants.js";
import EnvFields from "../../utils/constants/env_fields.constants.js";
import { LogoutFlagsEnum } from "../../utils/constants/enum.constants.js";
class UserValidators {
    static uploadProfilePicture = {
        body: z.strictObject({
            attachment: generalValidationConstants.fileKeys({
                fieldName: StringConstants.ATTACHMENT_FIELD_NAME,
                maxSize: Number(process.env[EnvFields.PROFILE_PICTURE_SIZE]),
                mimetype: fileValidation.image,
            }),
        }),
    };
    static updateProfile = {
        body: z
            .strictObject({
            firstName: generalValidationConstants.name.optional(),
            lastName: generalValidationConstants.name.optional(),
            phoneNumber: generalValidationConstants.phoneNumber.optional(),
        })
            .superRefine((data, ctx) => {
            if (!Object.values(data).length) {
                ctx.addIssue({
                    code: "custom",
                    path: [""],
                    message: "All fields are empty ❌",
                });
            }
        }),
    };
    static changePassword = {
        body: z
            .strictObject({
            currentPassword: generalValidationConstants.password("currentPassword"),
            newPassword: generalValidationConstants.password("newPassword"),
            confirmPassword: generalValidationConstants.password("confirmPassword"),
            flag: z
                .enum(Object.values(LogoutFlagsEnum))
                .optional()
                .default(LogoutFlagsEnum.stay),
        })
            .superRefine((data, ctx) => {
            if (data.currentPassword == data.newPassword) {
                ctx.addIssue({
                    code: "custom",
                    path: ["newPassword"],
                    message: "Current and New passwords shouldn't be the same 🔑☹️"
                });
            }
            generalValidationConstants.confirmPasswordChecker({
                password: data.newPassword,
                confirmPassword: data.confirmPassword,
            }, ctx);
        }),
    };
}
export default UserValidators;
