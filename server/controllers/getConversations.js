import Conversation from "../models/conversation.js";
import { isValidId } from "../handlers/verifyUserId.js";


export default async function getConversations(req, res) {
    const { userId } = req.user;

    if (!userId || !isValidId(userId)) {
        return res.status(401).json({ message: "Invalid Request" });
    }

    try {
        const conversations = await Conversation.find({ userId });
        return res.json(conversations);
    } catch (error) {
        return res.status(500).json({ message: "Service Unavailable" });
    }
}



