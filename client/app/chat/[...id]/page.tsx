'use client';
import ChatTopBar from "@/app/components/ChatTopBar";
import Chat from "@/app/components/Chat";
import { useChatHistory } from "@/app/hooks/useChatHistory";
import { useWS } from "@/app/hooks/useWS";


import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ChatPage() {
    const { id: chatId } = useParams();
    const router = useRouter();

    const [rawStream, setRawStream] = useState<string>("");

    const [isStreaming, setIsStreaming] = useState<boolean>(false);

    const {
        messages,
        title,
        isLoading,
        error,
        setMessages,
    } = useChatHistory(chatId as string);

    const { status, retry, sendPrompt } = useWS({
        conversationId: chatId as string,
        handlers: {
            onStatus({ message, typing }) {
                console.log("Status", message, typing);
            },
            onAssistantStream(msg) {
                setIsStreaming(true);
                setRawStream((prev) => prev + msg);
            },
            onConversationEnd(msg) {
                setIsStreaming(false);
                setMessages((prev) => [...prev, msg[1]]);
            },
            onError(msg) {
                toast.error(msg);
            },
        },
    });


    // Handle fatal errors
    useEffect(() => {
        if (error) {
            toast.error("Unable to load chat");
            router.push("/chat");
        }
    }, [error]);

    // Set title dynamically
    useEffect(() => {
        if (title) document.title = title;
    }, [title]);

    return (
        <section className="w-full flex flex-col">
            <ChatTopBar title={title} isLoading={isLoading} status={status} retry={retry} />
            <Chat chatMessages={messages} isLoading={isLoading} sendPrompt={sendPrompt} stream={rawStream} sendMessage={setMessages} isStreaming={isStreaming} />
        </section>
    );
}