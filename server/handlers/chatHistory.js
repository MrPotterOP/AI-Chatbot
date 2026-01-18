import Message from "../models/message.js";

export async function getChatHistory(conversationId) {

    try {
        const messages = await Message.find({ conversationId: conversationId }).sort({ _id: 1 });
        return messages;
    } catch (error) {
        throw error;
    }

}