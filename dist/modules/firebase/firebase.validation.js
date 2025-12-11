import { z } from "zod";
import AppRegex from "../../utils/constants/regex.constants.js";
import StringConstants from "../../utils/constants/strings.constants.js";
class FirebaseValidators {
    static sendNotification = {
        body: z.strictObject({
            title: z.string({ error: StringConstants.PATH_REQUIRED_MESSAGE("title") }).min(3).max(200),
            body: z.string({ error: StringConstants.PATH_REQUIRED_MESSAGE("body") }).min(5).max(1000),
            imageUrl: z.url().optional(),
            fcmToken: z
                .string({ error: StringConstants.PATH_REQUIRED_MESSAGE("fcmToken") })
                .regex(AppRegex.fcmTokenRegex, { error: "Invalid FCM Token" }),
        }),
    };
}
export default FirebaseValidators;
