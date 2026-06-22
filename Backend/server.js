import app from "./app.js";
import dotenv from "dotenv";
import { connectMongoDatabase } from "./config/db.js";
import {v2 as cloudinary} from "cloudinary";
import Razorpay from "razorpay";

// dotenv.config({path:"backend/config/config.env"});
// if(process.env.NODE_ENV !=='PRODUCTION'){
dotenv.config({path:"Backend/config/config.env"});
// }
connectMongoDatabase();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})
process.on("uncaughtException", err => {
        console.log(`Error: ${err.message}`);
        console.log('Shutting down the server due to Uncaught Exception');
    
        process.exit(1);
})
const PORT=process.env.PORT || 3000 || 5000 ;

// instance of Razorpay
export const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET
})
const server = app.listen(PORT,()=>{

    console.log(`Server is running on port ${PORT}`);

})
// console.log(name);


process.on('unhandledRejection', err => {
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to Unhandled Promise Rejection');
  
    server.close(() => {
      process.exit(1);
    });
  });