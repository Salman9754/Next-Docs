import { Router } from "express";
import signUp from "../controllers/authController";

const authRouter = Router();

authRouter.post("/sign-up", signUp);

export default authRouter;
