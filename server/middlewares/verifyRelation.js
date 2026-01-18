import User from "../models/user.js";
import Conversation from "../models/conversation.js";
import { isValidId } from "../handlers/verifyUserId.js";

export const verifyRelation = async (req, res, next) => {
    const { userId, conversationId } = req.body;

    if (!userId || !conversationId || !isValidId(userId)) {
        return res.status(400).json({ message: "Invalid Request" });
    }

    const user = await User.findOne({ userId });


    if (!user) {
        return res.status(404).json({ message: "Invalid User" });
    }

    const conversation = await Conversation.findById(conversationId).exec();

    if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
    }

    if (conversation.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
    }

    req.user = user;
    req.conversation = conversation;

    next();

}