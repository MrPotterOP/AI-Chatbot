import User from "../models/user.js";
import Conversation from "../models/conversation.js";
import { isValidId } from "../handlers/verifyUserId.js";

export const verifyRelationWS = async (ws, data, next) => {
    try {

        const payload = JSON.parse(data.toString());
        const { conversationId, prompt } = payload;
        const userId = ws.userId;

        if (!userId || !conversationId || !isValidId(userId)) {
            return next(new Error("INVALID_REQUEST"));
        }

        if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
            return next(new Error("INVALID_MESSAGE_PROMPT"));
        }

        if (prompt.length > (process.env.MAX_MESSAGE_LENGTH || 4000)) {
            return next(new Error("MESSAGE_TOO_LONG"));
        }

        const user = await User.findOne({ userId });
        if (!user) {
            return next(new Error("INVALID_USER"));
        }

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return next(new Error("CONVERSATION_NOT_FOUND"));
        }

        if (conversation.userId !== userId) {
            return next(new Error("UNAUTHORIZED"));
        }

        ws.user = user;
        ws.conversation = conversation;
        ws.prompt = prompt;

        next();
    } catch (err) {
        next(new Error("INTERNAL_ERROR"));
    }
};
