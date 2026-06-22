import express from "express";
import { allMyOrders, createOrder, deleteOrder, getAllOrders, getSingleOrder, updateOrderStatus } from "../controllers/orderController.js";
import { roleBasedAcces, verifyUserAuth } from "../middleware/userAuth.js";

const router = express.Router();


router.route("/new/order").post(verifyUserAuth,createOrder);
router.route("/admin/order/:id").put(verifyUserAuth,roleBasedAcces("admin"),updateOrderStatus).delete(verifyUserAuth,roleBasedAcces("admin"),deleteOrder);
router.route("/admin/orders").get(verifyUserAuth,roleBasedAcces("admin"),getAllOrders);
router.route("/orders/user").get(verifyUserAuth,allMyOrders);

router.route("/order/:id").get(verifyUserAuth,getSingleOrder);
export default router;