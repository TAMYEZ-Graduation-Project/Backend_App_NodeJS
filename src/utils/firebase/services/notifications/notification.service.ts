import type {
  BatchResponse,
  MulticastMessage,
  TokenMessage,
} from "firebase-admin/messaging";
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
  }): Promise<Partial<BatchResponse>> => {
    const message: MulticastMessage = {
      notification: {
        title,
        body,
      },
      tokens: deviceTokens,
    };

    if (imageUrl) message.notification!.imageUrl = imageUrl;
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
