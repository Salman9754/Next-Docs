import type { Request, Response, NextFunction } from "express"

// Global MongoDb error middleware

const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    try {
        let error = { ...err }
        error.message = err.message
        console.error(err);

        // Mongoose bad ObjectId
        if (err.name === 'CastError') {
            const message = `Resources not found. Invalid ${err.path}`
            error = new Error(message)
            error.statusCode = 404
        }

        // Mongoose duplicate key
        if (err.code === 11000) {
            const message = "Duplicate field value entered"
            error = new Error(message)
            error.statusCode = 400
        }

        // Mongoose validation error
        if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map((value: any) => value.message).join(', ')
            error = new Error(message)
            error.statusCode = 400
        }

        // general error response
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Server Error'
        })
    } catch (error) {
        next(error)
    }
}

export default errorMiddleware