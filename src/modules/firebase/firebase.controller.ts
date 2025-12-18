import { Router } from "express";
import RoutePaths from "../../utils/constants/route_paths.constants.ts";
import Auths from "../../middlewares/auths.middleware.ts";
import firebaseAuthorizationEndpoints from "./firebase.authorization.ts";
import validationMiddleware from "../../middlewares/validation.middleware.ts";
import FirebaseValidators from "./firebase.validation.ts";
import FirebaseService from "./firebase.service.ts";

const firebaseRouter = Router();

const firebaseService = new FirebaseService();

firebaseRouter.post(
  RoutePaths.sendNotification,
  Auths.combined({
    accessRoles: firebaseAuthorizationEndpoints.sendNotification,
  }),
  validationMiddleware({ schema: FirebaseValidators.sendNotification }),
  firebaseService.sendFirebaseNotification
);

firebaseRouter.post(
  RoutePaths.sendMultipleNotifications,
  Auths.combined({
    accessRoles: firebaseAuthorizationEndpoints.sendNotification,
  }),
  validationMiddleware({ schema: FirebaseValidators.sendMultiNotifications }),
  firebaseService.sendMultipleFirebaseNotifications
);

export default firebaseRouter;
