import handleAsyncError from "../middleware/handleAsyncError.js";
import User from "../models/userModel.js";
import HandleError from "../utils/handleError.js";
import { sendToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendMail.js";
import crypto from "crypto";
import {v2 as cloudinary} from "cloudinary";
// Register User
export const registerUser = handleAsyncError( async (req, res , next) => {
       const {name, email, password,avatar} = req.body;
       const myCloud = await cloudinary.uploader.upload(avatar, {
           folder: "avatars",
           width: 150,
           crop: "scale"
       })
       const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
       });
       sendToken(user, 201, res);
})

// Login User
export const loginUser = handleAsyncError( async (req, res , next) => {
    const {email, password} = req.body;
    if(!email || !password){
        return next(new HandleError("Please enter email and password", 400))
    }

    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new HandleError("Invalid email or password", 400))
    }
    const isPasswordValid = await user.verifyPassword(password);
    if(!isPasswordValid){
        return next(new HandleError("Invalid email or password", 400))
    }
    sendToken(user, 200, res);
})

// Logout User
export const logoutUser = handleAsyncError( async (req, res , next) => {
     res.cookie("token", null, {
         expires: new Date(Date.now()),
         httpOnly: true
     })
     res.status(200).json({
         success: true,
         message: "Logged out successfully"
     })
})

export const requestPasswordReset = handleAsyncError(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return next(new HandleError("User not found", 404));
    }

    // 1. Declare the variable here so it's accessible everywhere in this function
    let resetToken; 

    try {
        // 2. Assign the value generated from your userModel method
        resetToken = user.generatePasswordResetToken();
        
        await user.save({ validateBeforeSave: false });

        // 3. Move your URL logic inside the success path
        const resetPasswordURL = `${req.protocol}://${req.get("host")}/reset/${resetToken}`;
        // console.log(resetPasswordURL);
        const message = `Your password reset token is :- \n\n ${resetPasswordURL} \n\nIf you have not requested this email then, please ignore it.`;
        try{
            await sendEmail({
                email: user.email,
                subject: "Ecommerce Password Recovery",
                message
            });
            res.status(200).json({
                success: true,
                message: `Email sent to ${user.email} successfully`
            });
        }
        catch(error){
                user.passwordResetToken = undefined;
                user.passwordResetExpires = undefined;
                await user.save({ validateBeforeSave: false });
                return next(new HandleError( "Could not send reset password link", 500));
            }
        // 4. Send the response and RETURN so the function stops here
        return res.status(200).json({
            success: true,
            message: `Token generated successfully`,
            resetToken 
        });

    } catch (error) {
        console.log(error); 
        return next(new HandleError("Could not send reset password link", 400));
    }
});

// reset password 
export const resetPassword = handleAsyncError(async (req, res, next) => {
    // 1. Hash URL token to match database version
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    // 2. Find user with valid token and expiry
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if(!user){
        return next(new HandleError("Password reset token is invalid or has been expired", 400)); //
    }

    // 3. Safety check for req.body to prevent the destructure error
    if (!req.body || !req.body.password || !req.body.confirmPassword) {
        return next(new HandleError("Please provide password and confirm password", 400));
    }

    const { password, confirmPassword } = req.body; //

    // 4. Validate passwords match
    if(password !== confirmPassword){
        return next(new HandleError("Password and confirm password do not match", 400)); //
    }

    // 5. Update user and clear reset fields
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save(); //

    // 6. Log user in automatically
    sendToken(user, 200, res); //
})

// getting user details
export const getUserDetails = handleAsyncError( async (req, res , next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user
    })
})

// Updating Password
export const updatePassword = handleAsyncError( async (req, res , next) => {
    const{oldPassword, newPassword , confirmPassword} = req.body;
    const user = await User.findById(req.user.id).select("+password");
    if(!user){
        return next(new HandleError("User not found", 404))
    }
    const isPasswordCorrect = await user.verifyPassword(oldPassword);
    if(!isPasswordCorrect){
        return next(new HandleError("Old password is incorrect", 400))
    }
    if(newPassword !== confirmPassword){
        return next(new HandleError("Password and confirm password do not match", 400))
    }
    user.password = newPassword;
    await user.save();
    sendToken(user, 200, res);
})

// update Profile
export const updateProfile = handleAsyncError( async (req, res , next) => {
    const {name, email , avatar} = req.body;
    const updateUserDetails={
        name: name,
        email: email
    }
    if(avatar !== ""){
        const user = await User.findById(req.user.id);
        const imageId = user.avatar.public_id;
        await cloudinary.uploader.destroy(imageId);
        const myCloud = await cloudinary.uploader.upload(avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale"
        });
        updateUserDetails.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
    }
    const user = await User.findByIdAndUpdate(req.user.id, updateUserDetails, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    res.status(200).json({
        success: true,
        user
    })
})

// Admin-get All user
export const getUsersList = handleAsyncError( async (req, res , next) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        users
    })
})

// Admin- Get Single User
export const getSingleUser = handleAsyncError( async (req, res , next) => {
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new HandleError("User not found", 404))
    }
    res.status(200).json({
        success: true,
        user
    })
})

// Admin-update user role
export const updateUserRole = handleAsyncError( async (req, res , next) => {
    const {role} = req.body;

    // FIX: Change 'user.findByIdAndUpdate' to 'User.findByIdAndUpdate'
    const user = await User.findByIdAndUpdate(req.params.id, {role}, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    if(!user){
        return next(new HandleError("User not found", 404));
    }

    res.status(200).json({
        success: true,
        message: "User role updated successfully",
        user
    });
})

// admin-Delete User Profile
export const deleteUser = handleAsyncError( async (req, res , next) => {
    let user = await User.findById(req.params.id); 

    if(!user){
        return next(new HandleError("User not found", 404));
    }
    const imageId = user.avatar.public_id;
    await cloudinary.uploader.destroy(imageId);
    user = await User.findByIdAndDelete(req.params.id); 
    res.status(200).json({
        success: true,
        message: "User deleted successfully"
    });
});