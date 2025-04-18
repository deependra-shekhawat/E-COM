import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

import { encryptPassword } from "../utils/encryptPassword.js";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide your name"],
        validate: {
            validator: validator.isAlpha,
            message: 'Name can only contain alphabets',
        },
    },
    email: {
        type: String,
        required: [true, "Please provide your email"],
        validate: {
            validator: validator.isEmail,
            message: 'Please provide valid email',
          },
        unique: [true, 'Email already in use'],
    },
    password: {
        type: String,
        //required: [true, "Please provide your password"]
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    isVerified: {
        type: Boolean,
        default: false
    }
    }, 
{timestamps: true});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await encryptPassword(this.password);
    next();
});

userSchema.methods.comparePassword = async function (canditatePassword) {
    const isMatch = await bcrypt.compare(canditatePassword, this.password);
    return isMatch;
};

const userModel = mongoose.model("User", userSchema);

export default userModel;