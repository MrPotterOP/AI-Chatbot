import { getChatHistory } from "../handlers/chatHistory.js"
import { handleMessage } from "../handlers/message.js";

export default async function postMessageWS(ws, { conversationId, prompt }) {
    try {

        ws.send(JSON.stringify({ type: 'status', message: 'Thinking', typing: true, conversationId }))

        const chatHistory = await getChatHistory(conversationId);
        if (!chatHistory) {
            return ws.send(JSON.stringify({ type: 'error', message: 'Conversation Not Found' }))
        }

        await handleMessage(ws, { conversationId, prompt, chatHistory });

    } catch (error) {
        console.log(error)
        ws.send(JSON.stringify({ type: 'error', message: 'Service Unavailable' }))
    }
}