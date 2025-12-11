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
        const message = deviceTokens.map((token) => {
            if (imageUrl)
                return {
                    notification: {
                        title,
                        body,
                        imageUrl,
                    },
                    token,
                };
            else
                return {
                    notification: {
                        title,
                        body,
                    },
                    token,
                };
        });
        return firebaseAdmin.messaging().sendEach(message);
    };
}
export default NotificationService;
