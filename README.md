# AI Chatbot Application | Powered by GeminiLLM

This is a Full Stack Application built using Next.js Node.js/Express. It is a chatbot application that uses GeminiLLM to generate responses to user queries while maintaining a conversations, context history and stream the responses in real-time using Web Sockets. 

---

## Local Setup Guide (Instructions)

1.  Clone the repository.

### (Node.js Setup - Server)

2.  Navigate to the Node.js project directory - `/server`.
3.  Install dependencies: `npm install`
4.  Copy `.env.example` to `.env` and configure the database connection (change the urls according to your local setup).
5.  You will need Gemini API Key (can get it from Google AI Studio), MongoDB connection string (can get it from MongoDB Atlas) and a Port number (default is 8000).
6.  Start the Node.js development server: `npm run dev` or `node index.js`.


### (Next.js Setup - Client)

2.  Navigate to the Frontend project directory - `/client`.
3.  Install dependencies: `npm install`
4.  Copy `.env.example` to `.env` and configure the database connection (change the urls according to your local setup).
5.  Start the Frontend development server: `npm run dev`.

---

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS, TypeScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **LLM:** GenAI SDK
- **Web Sockets:** WebSocket


## Libraries Used

- Axios (Client Side Requests)
- Sonner (Toaster. Alert Messages)
- Mongoose (MongoDB ODM)
- Ulid (Unique ID Generator. For better sorting of Messages History)
- React Markdown (Markdown Renderer)
- UUID (Unique ID Generator. For User ID)
- HugeIcons (Icons)
- Cors (CORS Middleware)
- Dotenv (Environment Variables)

---

## Features Checklist

### Message Display
- [x] Chat message list showing user and AI messages
- [x] Chat creation & persistence
- [x] AI message streaming
- [x] Markdown support in messages
- [x] Timestamps for messages

### Input Area
- [x] Text input field with send button
- [x] Enter key to send message
- [x] Disable input while AI is responding
- [x] Character limit indicator 

### Basic Styling
- [x] Clean, readable layout (Inspired from ChatGPT)
- [x] Responsive design (mobile-friendly)
- [x] Use Tailwind CSS for quick styling

### Connection Management
- [x] WebSocket connection on component mount
- [x] Handle connection/disconnection states
- [x] Display connection status indicator
- [x] Basic reconnection logic

### Message Flow
- [x] Send user messages via WebSocket
- [x] Receive streaming AI responses
- [x] Handle connection errors gracefully

### Real-Time Display
- [x] Display AI response as it streams (token by token or chunk by chunk)
- [ ] Show typing indicator while waiting for first chunk
- [x] Handle streaming completion

### LLM Integration
- [x] Use any LLM API that supports streaming - Gemini LLM

### Message History
- [x] Store conversation messages
- [x] Maintain message order
- [x] Handle loading states

### UI States
- [x] Loading indicator
- [x] Error states
- [x] Connection status
- [x] Input disabled state

### Additional Features
- [x] Message persistence (localStorage or database)
- [x] Clear chat functionality
- [x] Copy message to clipboard
- [x] Markdown rendering in AI responses
- [ ] Typing indicator animation
- [ ] Dark/light theme toggle


### Key Details
- Skeleton Loading
- Converations. (Having Multiple Chat Conversations with context history. Inspired from ChatGPT)
- UI Inspired from ChatGPT
- Dynamic Conversations Title Generation (Backed by Gemini LLM LTE model)
- Copyable Code Blocks
- ChatGPT Styled Code Blocks
- System Prompt for Gemini LLM to understand users needs and add details to his responses

---

## Time Spent
- Approximately 3 Days (Sums up to 26-30 hours)


---

## Live Demo

- [Demo](https://youtu.be/jhKurp-CFRM)






