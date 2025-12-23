import type { Request, Response, NextFunction } from "express"
import { JWT_SECRET } from "../config/env"
import jwt, { JwtPayload } from 'jsonwebtoken'

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.access_token
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Auth token missing"
            })
        }

        if (!JWT_SECRET) {
            throw new Error("JWT secret not defined")
        }

        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
        req.user = decoded
        next()
    } catch (error) {
        next(error)
    }

}