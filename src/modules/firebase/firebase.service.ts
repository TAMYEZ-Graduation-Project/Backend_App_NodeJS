import type { Request, Response } from "express";
import NotificationService from "../../utils/firebase/services/notifications/notification.service.ts";
import successHandler from "../../utils/handlers/success.handler.ts";
import type {
  SendMultipleNotificationsBodyDtoType,
  SendNotificationBodyDtoType,
} from "./firebase.dto.ts";

class FirebaseService {
  private readonly _notificationService = new NotificationService();

  sendFirebaseNotification = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { title, body, imageUrl, fcmToken } =
      req.body as SendNotificationBodyDtoType;

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

  sendMultipleFirebaseNotifications = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { title, body, imageUrl, fcmTokens } =
      req.body as SendMultipleNotificationsBodyDtoType;

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
