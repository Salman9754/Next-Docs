import type { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import { generateOtp } from "../utils/generateOtp";
import sendEmail from "../services/sendEmail";
import { signToken } from "../utils/jwtTokens";
import { JWT_SECRET } from "../config/env";
import jwt, { JwtPayload } from "jsonwebtoken"


export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  // Removed the testing atmoic operations in auth controllers no need! 
  // const session = await mongoose.startSession()
  // session.startTransaction()
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User Alreday Exists",
      });
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPass = await bcrypt.hash(password, salt);
    const otp = generateOtp()

    const user = await User.create({
      name,
      email,
      password: hashedPass,
      refreshToken: null,
      otpCode: otp,
      isVerified: false
    });

    try {
      sendEmail(name, email, otp);
    } catch (err) {
      console.error("Email failed:", err);
    }
    res.status(201).json({
      success: true,
      message: "Account Created Successfully. Verify your Otp via email",
      user_id: user._id,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {

  try {

    const { email, otp } = req.body

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found"
      })
    }
    if (user?.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Already verified!"
      })
    }

    if (user.otpCode !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid otp"
      })
    }

    user.otpCode = null
    user.isVerified = true
    await user.save()

    res.status(200).json({
      success: true,
      message: "User verified successfully"
    })


  } catch (error) {
    next(error)
  }
}

export const resendOtp = async (req: Request, res: Response, next: NextFunction) => {

  try {

    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User already verified"
      })
    }

    const newOtp = generateOtp()
    user.otpCode = newOtp
    await user.save()

    try {
      sendEmail(user.name, email, newOtp)
    } catch (error) {
      console.error("Email sending failed", error)
    }

  } catch (error) {
    next(error)
  }

}

export const signIn = async (req: Request, res: Response, next: NextFunction) => {

  try {

    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found!"
      })
    }

    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User is not verified"
      })
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid password"
      })
    }

    const accessToken = signToken({ id: user._id }, "15m")
    const refreshToken = signToken({ id: user._id }, "7d")

    user.refreshToken = refreshToken
    await user.save()

    res.cookie("access_token", accessToken, { httpOnly: true, maxAge: 15 * 60 * 1000 })
    res.cookie("refresh_token", refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
    res.status(200).json({ message: "Signed in succcessfully" })

  } catch (error) {
    next(error)
  }
}

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const refreshToken = req.cookies.refresh_token

    if (!refreshToken) {
      return res.status(404).json({
        success: false,
        message: "No refresh token found"
      })
    }
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined")
    }
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as JwtPayload

    const user = await User.findById(decoded.id)
    if (!user || refreshToken !== user.refreshToken) {
      return res.status(403).json({
        success: false,
        message: "Invalid refresh token"
      })
    }

    const newAccess = signToken({ id: user._id }, "15m")
    const newRefresh = signToken({ id: user._id }, "7d")

    user.refreshToken = newRefresh
    await user.save()


    res.cookie("access_token", newAccess, { httpOnly: true, maxAge: 15 * 60 * 1000 })
    res.cookie("refresh_token", newRefresh, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
    res.status(200).json({ message: "Tokens refreshed successfully" })

  } catch (error) {
    next(error)
  }
}

export const signOut = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const refreshToken = req.cookies.refresh_token

    if (refreshToken) {
      const user = await User.findOne({ refreshToken })
      if (user) {
        user.refreshToken = null
        await user.save()
      }
    }

    res.clearCookie("access_token", { httpOnly: true })
    res.clearCookie("refresh_token", { httpOnly: true })
    res.status(200).json({ message: "User signed out successfully" })

  } catch (error) {
    next(error)
  }

}