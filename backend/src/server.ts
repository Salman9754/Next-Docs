import express from "express";
import type { Request, Response } from "express";
import authRouter from "./routes/authRoutes";
import cors from "cors";
import errorMiddleware from "./middlewares/errorMiddleware";
import cookieParser from 'cookie-parser'


const app = express();
app.use(express.json());
app.use(cors());

app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())


app.get("/test", (req: Request, res: Response) => {
  res.send("App working");
});
app.use("/auth", authRouter);

app.use(errorMiddleware)

export default app;
