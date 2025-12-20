import { Router } from "express";
import { signUp, verifyOtp, signIn } from "../controllers/authController";

const authRouter = Router();

authRouter.post("/sign-up", signUp);
authRouter.post("/verify-otp", verifyOtp);
authRouter.post('/sign-in', signIn)

export default authRouter;
