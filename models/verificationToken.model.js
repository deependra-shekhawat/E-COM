import mongoose from "mongoose";

const verificationTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    token: { type: String, default: "empty" },
    otp: { type: Number, default: 1234 },
    expireAt: {
      type: Date,
      default: Date.now,
      index: { expires: 4800 },
    },
  },
  { timestamps: true }
);

export const verificationTokenModel = mongoose.model(
  "VerificationToken",
  verificationTokenSchema
);
