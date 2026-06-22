import mongoose from "mongoose";

const aiConversationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    messages: [
        {
            role: {
                type: String,
                enum: ["user", "assistant"],
                required: true
            },
            content: {
                type: String,
                required: true
            },
            timestamp: {
                type: Date,
                default: Date.now
            }
        }
    ],
    relatedCart: {
        type: mongoose.Schema.ObjectId,
        ref: "AICart"
    },
    intent: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

aiConversationSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("AIConversation", aiConversationSchema);
