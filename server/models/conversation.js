import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            ref: "User",
            required: true,
            index: true
        },

        title: {
            type: String,
            default: "New Chat"
        },

        lastMessageAt: {
            type: Date,
            default: Date.now,
            index: true
        }
    },
    { timestamps: true }
);

export default mongoose.model("Conversation", conversationSchema);
