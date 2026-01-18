import { useRef, useState, useEffect } from "react";
import { useUser } from "../hooks/useUser";

type MessageHandlers = {
    onStatus?: (status: { message: string; typing: boolean }) => void;
    onAssistantStream?: (message: string) => void;
    onConversationEnd?: (messages: any[]) => void;
    onError?: (message: string) => void;
};

type UseWSChatParams = {
    conversationId: string | null;
    handlers: MessageHandlers | null;
};

type Status = "connecting" | "connected" | "disconnected";

export function useWS({
    conversationId,
    handlers,
}: UseWSChatParams) {
    const wsRef = useRef<WebSocket | null>(null);
    const [status, setStatus] = useState<Status>("disconnected");
    const { user } = useUser();

    function connect() {
        if (wsRef.current?.readyState === WebSocket.OPEN) return;

        setStatus("connecting");

        const ws = new WebSocket(
            `${process.env.NEXT_PUBLIC_WS_URL}?userId=${user}`
        );

        wsRef.current = ws;

        ws.onopen = () => {
            setStatus("connected");
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                // Ignore messages for other conversations
                // if (data.conversationId && data.conversationId !== conversationId) {
                //     return;
                // }

                switch (data.type) {
                    case "status": {
                        // Assistant is thinking / typing
                        handlers?.onStatus?.({
                            message: data.message,
                            typing: data.typing,
                        });
                        break;
                    }

                    case "stream": {
                        // This is the FULL assistant response (not a token)
                        handlers?.onAssistantStream?.(data.message);
                        break;
                    }

                    case "end": {
                        // This contains FINAL persisted messages
                        handlers?.onConversationEnd?.(data.message);
                        break;
                    }

                    case "error": {
                        handlers?.onError?.(data.message);
                        break;
                    }

                    default:
                        console.warn("Unknown WS message type:", data.type);
                        break;
                }
            } catch (err) {
                console.error("WS message parse error", err);
            }
        };

        ws.onclose = () => {
            setStatus("disconnected");
            wsRef.current = null;
        };

        ws.onerror = () => {
            setStatus("disconnected");
            wsRef.current = null;
        };
    }

    function disconnect() {
        wsRef.current?.close();
        wsRef.current = null;
        setStatus("disconnected");
    }

    function retry() {
        disconnect();
        connect();
    }

    function sendPrompt(prompt: string) {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
        wsRef.current.send(
            JSON.stringify({
                conversationId,
                prompt,
            })
        );
    }


    useEffect(() => {

        if (!user) return;
        connect();
    }, [user, conversationId]);

    return {
        status,
        isConnected: status === "connected",
        sendPrompt,
        retry,
    };
}
