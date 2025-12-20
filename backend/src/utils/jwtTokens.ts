import { JWT_SECRET } from "../config/env";
import jwt, { SignOptions } from "jsonwebtoken"


export const signToken = (payload: object, expiresIn: SignOptions["expiresIn"]) => {
    if (!JWT_SECRET) {
        throw new Error("Jwt secret not defined")
    }
    return jwt.sign(payload, JWT_SECRET, { expiresIn })
}