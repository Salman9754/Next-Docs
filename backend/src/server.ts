import express from "express";
import type { Request, Response } from "express";
import authRouter from "./routes/authRoutes";
import cors from "cors";
import errorMiddleware from "./middlewares/errorMiddleware";
import cookieParser from 'cookie-parser'
import { authMiddleware } from "./middlewares/authMiddleware";
import docRouter from "./routes/documentRoutes";


const app = express();
app.use(express.json());
app.use(cors());

app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())


app.use("/auth", authRouter);
app.use('/document', docRouter)

app.get("/testing", authMiddleware, (req: Request, res: Response) => {
  res.json({
    success: true,
    user: req.user?.id,
    message: "Working"
  });
});

app.use(errorMiddleware)

export default app;
