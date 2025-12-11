import type { TokenMessage } from "firebase-admin/messaging";
import { firebaseAdmin } from "../../index.ts";


class NotificationService {
  sendNotification = async ({
    deviceToken,
    title,
    body,
    imageUrl,
  }: {
    deviceToken: string;
    title: string;
    body: string;
    imageUrl?: string | undefined;
  }) => {
    const message: TokenMessage = {
      notification: {
        title,
        body,
      },
      token: deviceToken,
    };

    if (imageUrl) message.notification!.imageUrl = imageUrl;
    return firebaseAdmin.messaging().send(message);
  };

  sendMultipleNotifications = async ({
    deviceTokens,
    title,
    body,
    imageUrl,
  }: {
    deviceTokens: string[];
    title: string;
    body: string;
    imageUrl?: string | undefined;
  }) => {
    const message: TokenMessage[] = deviceTokens.map((token) => {
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
