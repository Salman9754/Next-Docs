import type { Request, Response, NextFunction } from "express";
import Document from "../models/document.model";
import { logActivity } from "../utils/logActivity";

export const createDocument = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id

        if (!userId) {
            return res.status(401).json({
                success: false,
                data: userId,
                message: "User is not authenticated please login!"
            })
        }

        const { title, content, isPublic } = req.body

        if (!title || !content || !isPublic) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const document = await Document.create({
            title,
            content,
            collaborators: [],
            owner: userId,
            isPublic
        })

        await logActivity({
            documentId: document._id.toString(),
            userId,
            action: "Create",
            details: `Document ${title} Created`
        })

        res.status(201).json({
            success: true,
            message: "Document created successfully",
            data: document
        })
    } catch (error) {
        next(error)
    }

}