import type { Request, Response } from "express";
import NotificationService from "../../utils/firebase/services/notifications/notification.service.ts";
import successHandler from "../../utils/handlers/success.handler.ts";
import type { SendNotificationBodyDtoType } from "./firebase.dto.ts";

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
}

export default FirebaseService;
