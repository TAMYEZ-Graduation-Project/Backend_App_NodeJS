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
}
export default FirebaseService;
