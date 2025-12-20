import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import User from "../models/user.modal";
import bcrypt from "bcryptjs";
import { generateOtp } from "../utils/generateOtp";
import sendEmail from "../services/sendEmail";

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });
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

    await session.commitTransaction();
    await session.endSession();

    sendEmail(name, email, otp)
    res.status(201).json({
      success: true,
      message: "Account Created Successfully. Verify your Otp via email",
      user_id: user._id,
    });
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    next(error);
  }
};

export const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
  const session = await mongoose.startSession()
  session.startTransaction()
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

    await session.commitTransaction()
    await session.endSession()

    res.status(200).json({
      success: true,
      message: "User verified successfully"
    })


  } catch (error) {
    await session.abortTransaction()
    await session.endSession()
    next(error)
  }
}


