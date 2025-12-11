import { z } from "zod";
import FirebaseValidators from "./firebase.validation.ts";

export type SendNotificationBodyDtoType = z.infer<
  typeof FirebaseValidators.sendNotification.body
>;
