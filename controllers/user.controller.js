import crypto from "crypto";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import userModel from "../models/user.model.js";
import { verificationTokenModel } from "../models/verificationToken.model.js";
import CustomError from "../errors/customError.js";
import { sendMail } from "../utils/sendmail.js";
import VerifyMail from "../views/Verifymail.js";
import ResetPassword from "../views/ResetPassword.js";
import { generateSixDigitCode } from "../utils/genrateSixDigitCode.js";

export const signup = async (req, res, next) => {
  const { name, email, password, role } = req.body;

  try {
    //create new user
    const user = await userModel.create({ name, email, password, role });

    //if password is not provided
    if(!password){
      throw new CustomError("Password is required", 400);
    }
    

    // generate verification token
    const verificationToken = crypto.randomBytes(40).toString("hex");
    console.log(
      "verification token for user " + user._id + ":  " + verificationToken
    );

    // save verification token
    await verificationTokenModel.create({
      user: user._id,
      token: verificationToken,
    });

    // send verification email
    await sendMail(
      email,
      `Welcome ${name} to our ${process.env.APP_NAME}`,
      VerifyMail(user._id, verificationToken)
    );

    const jwtToken = jwt.sign({user: { id: user._id, name: user.name, email: user.email }}, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.cookie("token", jwtToken, { httpOnly: true });
    // send response
    res.status(201).json({
      success: true,
      message: "A email verification is sent to your registered email please verify your email it will expire in 2 mins",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    next(error);
  }
};


export const verifyMailAfterExpiration = async (req, res, next) => {
  const { email } = req.body;

  try {
    //create new user
    const user = await userModel.findOne({ email });

    if (!user) {
      throw new CustomError("User not found", 404);
    }else if(user.isVerified){
      throw new CustomError("User already verified", 400);
    }

    // generate verification token
    const verificationToken = crypto.randomBytes(40).toString("hex");
    console.log(
      "verification token for user " + user._id + ":  " + verificationToken
    );

    // save verification token
    await verificationTokenModel.create({
      user: user._id,
      token: verificationToken,
    });

    // send verification email
    await sendMail(
      email,
      `Welcome ${name} to our ${process.env.APP_NAME}`,
      VerifyMail(user._id, verificationToken)
    );

    const jwtToken = jwt.sign({user: { id: user._id, name: user.name, email: user.email }}, process.env.JWT_SECRET, { expiresIn: "1d" });

    // send response
    res.status(201).json({
      success: true,
      message: "A email verification is sent to your registered email please verify your email it will expire in 5 mins",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    next(error);
  }
};


export const verifyMail = async (req, res, next) => {
  const { user, verificationToken } = req.query;

  // Convert user to ObjectId
  const userId = new mongoose.Types.ObjectId(user);

  try {
    if(verificationToken === "empty"){
      throw new CustomError("Invalid Tokem", 400);
    }
    //find token associated with user
    const token = await verificationTokenModel.findOne({
      user: userId,
      token: verificationToken,
    });

    //console.log("userId: " + userId + " token user.id: " + token.user);
    //check if token is present
    if (!token) {
      throw new CustomError("Invalid Token", 400);
    }
    //check if token is expired
    const userDetail = await userModel.findById(user);
    if (!userDetail) {
      throw new CustomError("User not found", 404);
    }

    //set user as verified
    userDetail.isVerified = true;
    await userDetail.save();

    //delete token
    await token.deleteOne();

    //send response
    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      throw new CustomError("User not found", 404);
    } else if (!(await user.comparePassword(password))) {
      throw new CustomError("Incorrect Password", 401);
    }

    const jwtToken = jwt.sign({user: { id: user._id, name: user.name, email: user.email }}, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.cookie("token", jwtToken, { httpOnly: true });

    res.status(200).json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      throw new CustomError("User not found", 404);
    }

    //delete all previous verification tokens
    await verificationTokenModel.deleteMany({ user: user._id });

    //generate new otp
    const otp = generateSixDigitCode();

    //save new otp
    await verificationTokenModel.create({ user: user._id, otp });

    //send otp to user
    await sendMail(
      email,
      `Reset Password for ${process.env.APP_NAME}`,
      ResetPassword(email, otp)
    );

    //send response
    res.status(200).json({
      success: true,
      message:
        "A email is sent to your registered email with a 6 digit code to reset your password",
    });
  } catch (error) {
    next(error);
  }
};

export const resetPasswordUsingOtp = async (req, res, next) => {
  let { email, otp, password } = req.body;

  //console.log("otp: " + otp);
  try {
    // find user if present
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new CustomError("User not found", 404);
    }
    // find otp if present for the associated user
    console.log("user id: " + user._id + " otp: " + otp);
    const UserOtp = await verificationTokenModel.findOne({
      user: user._id,
      otp,
    });
    if (!UserOtp) {
      throw new CustomError("Invalid OTP", 400);
    }
    // update password
    user.password = password;
    user.isVerified = true;
    await user.save();
    // delete otp
    await UserOtp.deleteOne();
    // send response
    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const signout = async (req, res, next) => {
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "Signout successfully",
  });
}