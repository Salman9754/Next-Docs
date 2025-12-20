import { Router } from "express";
import { signUp, verifyOtp } from "../controllers/authController";

const authRouter = Router();

authRouter.post("/sign-up", signUp);
authRouter.post("/verify-otp", verifyOtp);

export default authRouter;
