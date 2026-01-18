'use client';
import ChatTopBar from "@/app/components/ChatTopBar";
import Chat from "@/app/components/Chat";
import { useWS } from "@/app/hooks/useWS";

import { useRouter } from "next/navigation";


import axios from "axios";

export default function ChatPage() {
    const router = useRouter();

    const { status, retry, sendPrompt } = useWS({
        conversationId: "/",
        handlers: null,
    });

    const handleSendPrompt = (prompt: string) => {
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
        const url = `${baseUrl}/api/newconversation`;
        axios.post(url, {
            userId: localStorage.getItem("userId"),
            prompt,
        })
            .then((response) => {
                const conversationId = response.data.conversationId;
                sendPrompt(prompt);
                router.push(`/chat/${conversationId}`);
            })
            .catch((error) => {
                console.error(error);
            });


    };

    return (
        <section className="w-full flex flex-col">
            <ChatTopBar title="Start a conversation" isLoading={false} status={status} retry={retry} />
            <Chat chatMessages={[]} isLoading={false} sendPrompt={handleSendPrompt} stream={""} sendMessage={() => { }} isStreaming={false} />
        </section>
    );
}