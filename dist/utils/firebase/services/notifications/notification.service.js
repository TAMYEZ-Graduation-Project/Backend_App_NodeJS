import { firebaseAdmin } from "../../index.js";
class NotificationService {
    sendNotification = async ({ deviceToken, title, body, imageUrl, }) => {
        const message = {
            notification: {
                title,
                body,
            },
            token: deviceToken,
        };
        if (imageUrl)
            message.notification.imageUrl = imageUrl;
        return firebaseAdmin.messaging().send(message);
    };
    sendMultipleNotifications = async ({ deviceTokens, title, body, imageUrl, }) => {
        const message = {
            notification: {
                title,
                body,
            },
            tokens: deviceTokens,
        };
        if (imageUrl)
            message.notification.imageUrl = imageUrl;
        const result = await firebaseAdmin
            .messaging()
            .sendEachForMulticast(message);
        console.log({
            result,
            responses: result.responses,
        });
        return {
            successCount: result.successCount,
            failureCount: result.failureCount,
        };
    };
}
export default NotificationService;
