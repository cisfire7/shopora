import handleAsyncError from "./handleAsyncError.js";
import User from "../models/userModel.js";
import HandleError from "../utils/handleError.js";
import jwt from "jsonwebtoken";

export const verifyUserAuth = handleAsyncError( async (req, res , next) => {
    const {token} = req.cookies;
    if(!token){
        return next(new HandleError("Please login to access this resource", 400))
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decodedData);

    req.user = await User.findById(decodedData.id);
    // console.log(req.user);
    next();
})

export const roleBasedAcces = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(new HandleError("You are not allowed to access this resource", 400))
        }
        next();
    }
}