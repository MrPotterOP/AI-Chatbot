import { GoogleGenAI } from '@google/genai';


export default async function getConversationTitle(prompt) {
    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

    const MODEL = 'gemini-2.5-flash-lite';

    const REFINED_PROMPT = `
    You are a conversation title generator.

Your task is to generate a short, clear, and meaningful conversation title based ONLY on the user's initial message.

Rules:
- The title MUST be exactly 3 or 4 words long
- Use simple, natural language understandable by general users
- Do NOT use punctuation, emojis, quotes, or special characters
- Do NOT include filler words like "discussion", "conversation", "chat", or "help"
- Focus on the main intent, emotion, or topic
- If the message is short, vague, or casual, infer the most likely intent safely
- Do NOT assume technical knowledge unless clearly stated
- Return ONLY the title text and nothing else

Examples:

### General curiosity
User: "Why is the sky blue?"
Title: "Why Sky Is Blue"

### Everyday life
User: "I feel tired all the time"
Title: "Constant Feeling Of Tiredness"

### Emotional expression
User: "I'm feeling lost and confused"
Title: "Feeling Lost Confused"

### Advice seeking
User: "How can I improve my focus while studying?"
Title: "Improving Study Focus"

### Casual short input
User: "sleep issues"
Title: "Sleep Related Problems"

### Decision making
User: "Should I switch my career?"
Title: "Career Change Decision"

### Relationship question
User: "My friend ignores me lately"
Title: "Friendship Communication Issue"

### Financial curiosity
User: "How do people save money effectively?"
Title: "Effective Money Saving"

### Health curiosity (non-medical advice)
User: "Why do I get headaches often?"
Title: "Frequent Headaches Reason"

### Learning intent
User: "I want to learn guitar but don't know where to start"
Title: "Learning Guitar Basics"

### Tech question (only when clearly technical)
User: "How does the JavaScript event loop work?"
Title: "JavaScript Event Loop"

### Product or idea
User: "Thinking about starting a small online business"
Title: "Online Business Idea"

### Extremely vague input
User: "life"
Title: "Life Related Questions"

Now generate a title for the following user message.
User: ${prompt}
Title: 
    `;

    try {
        const result = await ai.models.generateContent({
            model: MODEL,
            contents: [{ role: 'user', parts: [{ text: REFINED_PROMPT }] }]
        })

        console.log(result.text)

        if (result.text) {
            return result.text;
        } else {
            return "";
        }

    } catch (error) {
        console.log(error)
        return "";
    }


}
