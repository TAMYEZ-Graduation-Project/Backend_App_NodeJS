import NotificationService from "../../utils/firebase/services/notifications/notification.service.js";
import successHandler from "../../utils/handlers/success.handler.js";
class FirebaseService {
    _notificationService = new NotificationService();
    sendFirebaseNotification = async (req, res) => {
        const { title, body, imageUrl, fcmToken } = req.body;
        await this._notificationService.sendNotification({
            title,
            body,
            imageUrl,
            deviceToken: fcmToken,
        });
        return successHandler({
            res,
            message: "Notification Sent Successfully 🔔",
        });
    };
    sendMultipleFirebaseNotifications = async (req, res) => {
        const { title, body, imageUrl, fcmTokens } = req.body;
        const response = await this._notificationService.sendMultipleNotifications({
            title,
            body,
            imageUrl,
            deviceTokens: fcmTokens,
        });
        return successHandler({
            res,
            message: "Notification Sent Successfully 🔔",
            body: { response },
        });
    };
}
export default FirebaseService;
