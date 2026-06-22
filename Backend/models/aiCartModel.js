import mongoose from "mongoose";

const aiCartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    prompt: {
        type: String,
        required: [true, "Please provide a prompt"]
    },
    items: [
        {
            product: {
                type: mongoose.Schema.ObjectId,
                ref: "Product"
            },
            name: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            },
            reason: {
                type: String
            },
            category: {
                type: String
            },
            image: {
                type: String
            }
        }
    ],
    totalEstimatedPrice: {
        type: Number,
        default: 0
    },
    reasoning: {
        type: String
    },
    confidenceScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    tags: [String],
    status: {
        type: String,
        enum: ["generated", "saved", "added_to_cart", "ordered"],
        default: "generated"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

aiCartSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("AICart", aiCartSchema);
