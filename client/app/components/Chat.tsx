'use client';
import Message from "./Message";
import InputBar from "./InputBar";
import { useEffect, useRef } from "react";


interface ChatMessage {
    _id: string;
    content: string;
    role: string;
}

export default function Chat({ chatMessages, isLoading, sendPrompt, stream, sendMessage, isStreaming }: { chatMessages: ChatMessage[] | null, isLoading: boolean, sendPrompt: (prompt: string) => void, stream: string, sendMessage: (messages: any) => void, isStreaming: boolean }) {

    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: isStreaming ? "auto" : "smooth",
        });
    }, [chatMessages, stream]);

    const MessageSkeleton = () => {
        return (
            <div className="w-full max-w-4xl flex flex-col gap-6 py-4">
                <div className="flex items-start gap-2">
                    <p>Loading...</p>
                </div>
            </div>
        )
    }

    const WelcomeMessage = () => {
        return (
            <div className="w-full max-w-4xl grid place-content-center gap-6 py-4 h-full text-center">
                <p className="text-sm text-(--clr-white)/90">Welcome to the chat! Try sending a message to get started.</p>
            </div>
        )
    }

    return (
        <section className="w-full h-full flex flex-col justify-between items-center px-4 overflow-y-auto">
            {/* Chat Messages Body */}
            <div className="mb-20 w-full max-w-4xl flex flex-col gap-6 py-4">
                {
                    isLoading && (
                        <MessageSkeleton />
                    )
                }
                {
                    !isLoading && chatMessages?.length === 0 && (
                        <WelcomeMessage />
                    )
                }
                {
                    !isLoading && chatMessages?.map((message: ChatMessage) => (
                        <Message key={message._id} role={message.role} message={message.content} isStreaming={false} />
                    ))
                }
                {
                    !isLoading && stream && isStreaming && (
                        <Message key={Date.now()} role="assistant" message={stream} isStreaming={true} />
                    )
                }

                <div ref={bottomRef} />
            </div>

            {/* Chat Input */}
            <InputBar sendPrompt={sendPrompt} isLoading={isLoading} sendMessage={sendMessage} />
        </section>
    );
}