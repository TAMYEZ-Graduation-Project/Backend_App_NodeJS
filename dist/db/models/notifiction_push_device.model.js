import mongoose from "mongoose";
import ModelsNames from "../../utils/constants/models.names.js";
const notifictionPushDeviceSchema = new mongoose.Schema({
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
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
});
notifictionPushDeviceSchema.virtual("id").get(function () {
    return this._id;
});
