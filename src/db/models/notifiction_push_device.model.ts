import mongoose from "mongoose";
import type { INotificationPushDevice } from "../interfaces/notification_push_device.interface.ts";
import ModelsNames from "../../utils/constants/models.names.ts";

const notifictionPushDeviceSchema =
  new mongoose.Schema<INotificationPushDevice>(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: ModelsNames.userModel,
      },
      deviceId: {
        type: String,
        require: true,
      },

      notificationsEnabled: { type: Boolean, default: true },
      fcmToken: { type: String, required: true },
    },
    {
      timestamps: true,
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
      id: false,
    }
  );

notifictionPushDeviceSchema.virtual("id").get(function () {
  return this._id;
});

// export default 