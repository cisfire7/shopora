import handleAsyncError from "../middleware/handleAsyncError.js";
import HandleError from "../utils/handleError.js";
import AICart from "../models/aiCartModel.js";
import AIConversation from "../models/aiConversationModel.js";
import { generateAICart } from "../services/aiService.js";

// Generate AI Cart from prompt
export const generateCart = handleAsyncError(async (req, res, next) => {
    const { prompt } = req.body;

    if (!prompt || prompt.trim().length === 0) {
        return next(new HandleError("Please provide a prompt for AI cart generation", 400));
    }

    if (prompt.length > 500) {
        return next(new HandleError("Prompt is too long. Please keep it under 500 characters", 400));
    }

    // Generate AI cart
    const aiResult = await generateAICart(prompt);

    // Save to database
    const aiCart = await AICart.create({
        user: req.user._id,
        prompt,
        items: aiResult.items,
        totalEstimatedPrice: aiResult.totalEstimatedPrice,
        reasoning: aiResult.reasoning,
        confidenceScore: aiResult.confidenceScore,
        tags: aiResult.tags,
        status: "generated"
    });

    // Save conversation
    await AIConversation.create({
        user: req.user._id,
        messages: [
            { role: "user", content: prompt },
            { role: "assistant", content: aiResult.reasoning }
        ],
        relatedCart: aiCart._id,
        intent: prompt
    });

    res.status(200).json({
        success: true,
        aiCart
    });
});

// Save AI Cart (mark as saved)
export const saveAICart = handleAsyncError(async (req, res, next) => {
    const { cartId } = req.body;

    if (!cartId) {
        return next(new HandleError("Cart ID is required", 400));
    }

    const aiCart = await AICart.findOne({ _id: cartId, user: req.user._id });

    if (!aiCart) {
        return next(new HandleError("AI Cart not found", 404));
    }

    aiCart.status = "saved";
    await aiCart.save();

    res.status(200).json({
        success: true,
        aiCart
    });
});

// Get AI Cart History
export const getAICartHistory = handleAsyncError(async (req, res, next) => {
    const aiCarts = await AICart.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .limit(20);

    res.status(200).json({
        success: true,
        aiCarts
    });
});

// Get single AI Cart
export const getAICartDetails = handleAsyncError(async (req, res, next) => {
    const aiCart = await AICart.findOne({ _id: req.params.id, user: req.user._id });

    if (!aiCart) {
        return next(new HandleError("AI Cart not found", 404));
    }

    res.status(200).json({
        success: true,
        aiCart
    });
});

// Delete AI Cart
export const deleteAICart = handleAsyncError(async (req, res, next) => {
    const aiCart = await AICart.findOne({ _id: req.params.id, user: req.user._id });

    if (!aiCart) {
        return next(new HandleError("AI Cart not found", 404));
    }

    await AICart.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: "AI Cart deleted successfully"
    });
});

// Regenerate AI Cart (new suggestions for same prompt)
export const regenerateCart = handleAsyncError(async (req, res, next) => {
    const { cartId } = req.body;

    if (!cartId) {
        return next(new HandleError("Cart ID is required", 400));
    }

    const existingCart = await AICart.findOne({ _id: cartId, user: req.user._id });

    if (!existingCart) {
        return next(new HandleError("AI Cart not found", 404));
    }

    // Regenerate with same prompt
    const aiResult = await generateAICart(existingCart.prompt);

    // Create new cart
    const newAICart = await AICart.create({
        user: req.user._id,
        prompt: existingCart.prompt,
        items: aiResult.items,
        totalEstimatedPrice: aiResult.totalEstimatedPrice,
        reasoning: aiResult.reasoning,
        confidenceScore: aiResult.confidenceScore,
        tags: aiResult.tags,
        status: "generated"
    });

    res.status(200).json({
        success: true,
        aiCart: newAICart
    });
});
