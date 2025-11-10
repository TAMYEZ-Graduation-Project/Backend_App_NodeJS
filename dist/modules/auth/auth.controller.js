import { Router } from "express";
import authService from "./auth.service.js";
import validationMiddleware from "../../middlewares/validation.middleware.js";
import AuthValidator from "./auth.validation.js";
const authRouter = Router();
authRouter.post("/sign-up", validationMiddleware({ schema: AuthValidator.signUp }), authService.signUp);
export default authRouter;
