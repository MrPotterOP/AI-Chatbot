'use client';
import { useEffect, useState } from "react";
import axios from "axios";

import { useUser } from "./useUser";

type Message = {
    _id: string;
    role: "user" | "assistant";
    content: string;
    createdAt: string;
};

export function useChatHistory(chatId: string) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [title, setTitle] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const { user, isLoading: userLoading, error: userError } = useUser();

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000";

    useEffect(() => {
        if (!chatId) return;

        if (!user) {
            setError(userError);
            setIsLoading(userLoading);
            return;
        }

        async function fetchChat() {
            setIsLoading(true);
            setError(null);
            setMessages([]);

            axios.post(`${baseUrl}/api/chat`, { userId: user, conversationId: chatId }, { headers: { "Content-Type": "application/json" } })
                .then((res) => {
                    setTitle(res.data.title);
                    setMessages(res.data.messages);
                })
                .catch((err) => {
                    setError(err);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }

        fetchChat();
    }, [chatId, user]);

    return {
        messages,
        title,
        isLoading,
        error,
        setMessages,
    };
}
