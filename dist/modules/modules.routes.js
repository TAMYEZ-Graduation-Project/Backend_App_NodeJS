import { Router } from "express";
import authRouter from "./auth/auth.controller.js";
const modulesRouter = Router();
modulesRouter.get("/", (req, res) => {
    res.status(200).json({
        message: `Welcome to Our Graduation Project ${process.env.APP_NAME} ❤️ 🎓`,
    });
});
modulesRouter.use("/auth", authRouter);
export default modulesRouter;
