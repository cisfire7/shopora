import express from "express";
import product from "./routes/productRoutes.js";
import user from "./routes/userRoutes.js";
import order from "./routes/orderRoutes.js";
import payment from "./routes/paymentRoutes.js";
import ai from "./routes/aiRoutes.js";
import errorHandleMiddleware from "./middleware/error.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import path from "path";
import { fileURLToPath } from "url";
const app = express();
import dotenv from "dotenv";

const __filename=fileURLToPath(import.meta.url)
const __dirname=path.dirname(__filename)

app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());
app.use(express.urlencoded({extended:true}));
// route
app.use("/api/v1",product);
app.use("/api/v1",user);
app.use("/api/v1",order);
app.use("/api/v1",payment);
app.use("/api/v1",ai);

// serve static file
app.use(express.static(path.join(__dirname,"../Frontend/dist")));
app.use((req, res) => {
  res.sendFile(path.resolve(__dirname, "../Frontend/dist/index.html"));
});



app.use(errorHandleMiddleware);
if(process.env.NODE_ENV !=='PRODUCTION'){
dotenv.config({path:"Backend/config/config.env"});
}



export default app;