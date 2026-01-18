'use client';

import { ArrowUp02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useEffect, useRef, useState } from 'react';

interface InputBarProps {
    sendPrompt: (prompt: string) => void;
    isLoading: boolean;
    sendMessage: any;
}

export default function InputBar({ sendPrompt, isLoading, sendMessage }: InputBarProps) {
    const inputLimit = Number(process.env.NEXT_PUBLIC_INPUT_LIMIT || 4000);

    const [input, setInput] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!input.trim()) return;
        if (input.length > inputLimit) return;
        if (isLoading) return;

        sendMessage((prev: any) => [
            ...prev,
            {
                _id: new Date().toISOString(),
                role: "user",
                content: input,
            },
        ]);

        sendPrompt(input);
        setInput("");
    };

    return (
        <div className="sticky bottom-0 left-0 pb-2 w-full max-w-4xl bg-(--background) rounded-t-4xl flex flex-col items-center gap-2">
            <form
                onSubmit={handleSubmit}
                className="w-full px-2 flex items-center gap-2 bg-(--clr-gray) rounded-full"
            >
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="How can I help you today?"
                    className="w-full rounded-full px-6 py-4 outline-none"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                />

                <button
                    type="submit"
                    disabled={isLoading}
                    className="rounded-full px-2 py-2 flex items-center justify-center bg-(--clr-white) text-(--clr-gray) disabled:bg-(--clr-white)/50 disabled:cursor-not-allowed hover:bg-(--clr-white)/80 cursor-pointer"
                >
                    <HugeiconsIcon icon={ArrowUp02Icon} strokeWidth={2} size={24} />
                </button>
            </form>

            <p className="text-sm text-(--clr-white)/90">
                {isLoading
                    ? "Chat Disabled"
                    : `Ask anything within ${inputLimit} characters. (${input.length}/${inputLimit})`}
            </p>
        </div>
    );
}
