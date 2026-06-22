import express from "express";
import { createProducts, createReviewForProduct, deleteProduct, deleteReview, getAdminProducts, getAllProducts, getProductDetails, getProductReviews, updateProduct } from "../controllers/productController.js";
import { roleBasedAcces, verifyUserAuth } from "../middleware/userAuth.js";
import { get } from "http";
const router = express.Router();

router.route("/products").get(getAllProducts);
router.route("/review").put(verifyUserAuth,createReviewForProduct);
router.route("/reviews").get(getProductReviews).delete(verifyUserAuth,deleteReview);
router.route("/admin/products").get(verifyUserAuth,roleBasedAcces("admin"),getAdminProducts);
router.route("/admin/product/create").post(verifyUserAuth,roleBasedAcces("admin"), createProducts);
router.route("/admin/product/:id").put(verifyUserAuth,roleBasedAcces("admin"),updateProduct).delete(verifyUserAuth,roleBasedAcces("admin"),deleteProduct);
router.route("/product/:id").get(getProductDetails);

export default router;