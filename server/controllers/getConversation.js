import { getChatHistory } from "../handlers/chatHistory.js";

export default async function getConversations(req, res) {

    const { conversation } = req;

    try {
        const messages = await getChatHistory(conversation._id);
        return res.json({ title: conversation.title, messages });
    } catch (error) {
        return res.status(500).json({ message: "Service Unavailable" });
    }

}