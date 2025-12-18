import { Router } from "express";
import RoutePaths from "../../utils/constants/route_paths.constants.js";
import Auths from "../../middlewares/auths.middleware.js";
import firebaseAuthorizationEndpoints from "./firebase.authorization.js";
import validationMiddleware from "../../middlewares/validation.middleware.js";
import FirebaseValidators from "./firebase.validation.js";
import FirebaseService from "./firebase.service.js";
const firebaseRouter = Router();
const firebaseService = new FirebaseService();
firebaseRouter.post(RoutePaths.sendNotification, Auths.combined({
    accessRoles: firebaseAuthorizationEndpoints.sendNotification,
}), validationMiddleware({ schema: FirebaseValidators.sendNotification }), firebaseService.sendFirebaseNotification);
firebaseRouter.post(RoutePaths.sendMultipleNotifications, Auths.combined({
    accessRoles: firebaseAuthorizationEndpoints.sendNotification,
}), validationMiddleware({ schema: FirebaseValidators.sendMultiNotifications }), firebaseService.sendMultipleFirebaseNotifications);
export default firebaseRouter;
