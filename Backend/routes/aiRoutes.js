import express from "express";
import {
    generateCart,
    saveAICart,
    getAICartHistory,
    getAICartDetails,
    deleteAICart,
    regenerateCart
} from "../controllers/aiController.js";
import { getReplenishment, getPersonalizedRecommendations } from "../controllers/aiReplenishController.js";
import { getSmartRefillProducts } from "../controllers/aiReplenishController.js";
import { verifyUserAuth } from "../middleware/userAuth.js";

const router = express.Router();

// AI Cart Generation
router.route("/ai/cart").post(verifyUserAuth, generateCart);
router.route("/ai/cart/save").post(verifyUserAuth, saveAICart);
router.route("/ai/cart/regenerate").post(verifyUserAuth, regenerateCart);
router.route("/ai/history").get(verifyUserAuth, getAICartHistory);
router.route("/ai/cart/:id").get(verifyUserAuth, getAICartDetails).delete(verifyUserAuth, deleteAICart);

// Smart Replenishment & Personalized AI
router.route("/ai/replenishment").get(verifyUserAuth, getReplenishment);
router.route("/ai/personalized").get(verifyUserAuth, getPersonalizedRecommendations);
router.route("/ai/smart-refill-products").get(getSmartRefillProducts);

export default router;
