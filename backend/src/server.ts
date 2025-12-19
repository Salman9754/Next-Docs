import express from "express";
import type { Request, Response } from "express";
import authRouter from "./routes/authRoutes";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/test", (req: Request, res: Response) => {
  res.send("App working");
});
app.use("/auth", authRouter);

export default app;
