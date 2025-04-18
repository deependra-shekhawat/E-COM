import jwt from "jsonwebtoken";
import CustomError from "../errors/customError.js";

export const auntheticationMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return next(new CustomError("No token provided, authorization denied", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;

    console.log("decoded user: ", req.user);

    if (!req.user) {
      return next(new CustomError("Token is not valid", 401));
    }

    next();
  } catch (error) {
    return next(new CustomError("Token is not valid", 401));
  }
};