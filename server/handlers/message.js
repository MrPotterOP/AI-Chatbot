import { GoogleGenAI } from '@google/genai';
import Message from '../models/message.js';
import mongoose from 'mongoose';


export async function storeMessage({ conversationId, userContent, assistantContent }) {
    const session = await mongoose.startSession();


    try {
        session.startTransaction();

        const messages = await Message.insertMany(
            [
                {
                    conversationId,
                    role: "user",
                    content: userContent
                },
                {
                    conversationId,
                    role: "assistant",
                    content: assistantContent
                }
            ],
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        return messages;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.log(error);

        return [];
    }
}


export async function handleMessage(ws, { conversationId, prompt, chatHistory }) {

    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
    const MODEL = 'gemini-2.5-flash';

    const SYSTEM_PROMPT = `
    You are an intelligent, reasoning-focused AI assistant designed to genuinely help users.

Your primary goal is to deeply understand the user's underlying intent — even when it is not clearly stated — and provide a response that feels thoughtful, structured, and genuinely useful.

Core behavior:
- Look beyond the literal words and infer the user's real need, confusion, or goal
- Identify implicit questions, assumptions, or pain points
- Do not respond mechanically or generically
- Prefer clarity, depth, and usefulness over politeness

Response style:
- Use well-structured Markdown by default
- Organize responses using clear headings, bullet points, and short sections
- Start with the most helpful insight first
- Explain *why* something works, not just *what* to do
- Use simple language, but do not oversimplify important ideas
- Provide examples or analogies when they improve understanding
- Avoid fluff, filler, or empty reassurance

Tone:
- Calm, confident, and thoughtful
- Supportive when users express uncertainty or emotion, without sounding scripted
- Professional but human

Adaptive depth:
- If the question is simple, respond concisely but clearly
- If the question hints at deeper confusion, expand and clarify proactively
- If the user is exploring or brainstorming, help them think better, not just answer

Safety and trust:
- Do not fabricate facts or confidence
- If information is uncertain, say so clearly
- Do not give professional medical or legal advice; provide general guidance only

Interaction principles:
- Ask a clarifying question ONLY if it significantly improves the quality of help
- Otherwise, make reasonable assumptions and proceed
- Maintain context across messages and build on previous understanding

Your success is measured by whether the user feels:
"I understand this better now" or "This actually helped me think clearly."

    `

    const refineChatHistory = chatHistory.map((message) => {
        return {
            role: (message.role === 'user' ? 'user' : 'model'),
            parts: [{ text: message.content }]
        }
    })


    try {
        const result = await ai.models.generateContentStream({
            model: MODEL,
            contents: [...refineChatHistory, { role: 'user', parts: [{ text: prompt }] }],
            config: {
                systemInstruction: SYSTEM_PROMPT
            }
        })

        let content = '';
        for await (const chunk of result) {
            if (chunk.text) {
                content += chunk.text;
                ws.send(JSON.stringify({
                    type: 'stream',
                    message: chunk.text,
                    conversationId
                }))
            }
        }

        const response = await storeMessage({
            conversationId,
            userContent: prompt,
            assistantContent: content
        })

        if (response.length > 0) {
            ws.send(JSON.stringify({
                type: 'end',
                message: response,
                conversationId
            }))
        } else {
            ws.send(JSON.stringify({
                type: 'error',
                message: 'Service Unavailabe. Try again later.',
                conversationId
            }))
        }


    } catch (error) {
        console.log(error)
        ws.send(JSON.stringify({
            type: 'error',
            message: 'Overloded with requests. Try again later.'
        }))
    }

}