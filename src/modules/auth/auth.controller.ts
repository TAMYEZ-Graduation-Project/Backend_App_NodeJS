import { Router } from "express";
import authService from "./auth.service.ts";
import validationMiddleware from "../../middlewares/validation.middleware.ts";
import AuthValidator from "./auth.validation.ts";

const authRouter = Router();

authRouter.post(
  "/sign-up",
  validationMiddleware({ schema: AuthValidator.signUp }),
  authService.signUp
);

export default authRouter;
