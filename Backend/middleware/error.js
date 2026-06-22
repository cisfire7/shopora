import HandleError from "../utils/handleError.js";

export default (error, req, res, next) => {
    // console.log(error);
    error.statusCode = error.statusCode || 500;
    error.message = error.message || "Internal Server Error";
    if(error.name === "CastError"){
        error.message = `Resource not found. Invalid: ${error.path}`;
        error = new HandleError(error.message, 400);
    }
    // Mongodb duplicate key error
    if(error.code === 11000){
        error.message = `This ${Object.keys(error.keyValue)} already exists, Please login to continue.. `;
        error = new HandleError(error.message, 400);
    }
    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
    })
}