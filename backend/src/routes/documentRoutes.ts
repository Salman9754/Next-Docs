import { Router } from "express";
import { createDocument } from "../controllers/documentController";
import { authMiddleware } from "../middlewares/authMiddleware";


const docRouter = Router()


docRouter.post('/create', authMiddleware, createDocument)

export default docRouter