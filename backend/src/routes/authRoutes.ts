import { Router } from "express";
import { signUp, verifyOtp, signIn, refreshToken, signOut, resendOtp } from "../controllers/authController";

const authRouter = Router();

authRouter.post("/sign-up", signUp);
authRouter.post("/verify-otp", verifyOtp);
authRouter.post('/resend-otp', resendOtp)
authRouter.post('/sign-in', signIn)
authRouter.post('/refresh-token', refreshToken)
authRouter.post('/sign-out', signOut)

export default authRouter;
