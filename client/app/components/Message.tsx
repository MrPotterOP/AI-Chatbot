'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { Copy01Icon, Tick02Icon, AiMagicIcon } from '@hugeicons/core-free-icons';

import Markdown from 'react-markdown';
import moment from 'moment';


export default function Message({ role, message, isStreaming, createdAt }: { role: string, message: string, isStreaming: boolean, createdAt: string }) {


    const handleCopyClick = (message: string, e: React.MouseEvent) => {
        navigator.clipboard.writeText(message);
        const button = e.currentTarget;
        button.classList.add('copied');

        setTimeout(() => {
            button.classList.remove('copied');
        }, 2000);
    }


    const markdownComponents = {
        // Code blocks
        code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');

            return !inline && match ? (
                <div className="relative max-w-[200px] xs:max-w-[250px] md:max-w-[400px] lg:max-w-[600px] group my-4 bg-(--foreground) rounded-lg border border-(--clr-gray)">
                    <div className="px-4 py-2 flex items-center justify-between rounded-t-lg border-b border-(--clr-gray)">
                        <span className="text-xs">{match[1]}</span>
                        <button className="cursor-pointer copy-button" onClick={(e) => handleCopyClick(children, e)}>
                            <HugeiconsIcon icon={Copy01Icon} size={14} className="copy-icon" />
                            <HugeiconsIcon icon={Tick02Icon} size={14} className="tick-icon" />
                        </button>
                    </div>
                    <pre className="mt-0 px-4 py-2 rounded-t-none overflow-x-auto">
                        <code className={className} {...props}>
                            {children}
                        </code>
                    </pre>
                </div>
            ) : (
                <code className="bg-(--foreground) text-(--clr-white) px-1.5 py-0.5 rounded-lg text-sm" {...props}>
                    {children}
                </code>
            );
        },
        // Paragraphs
        p({ children }: any) {
            return <p className="mb-4 last:mb-0 leading-7">{children}</p>;
        },
        // Headers
        h1({ children }: any) {
            return <h1 className="text-2xl font-bold mb-4 mt-6">{children}</h1>;
        },
        h2({ children }: any) {
            return <h2 className="text-xl font-bold mb-3 mt-5">{children}</h2>;
        },
        h3({ children }: any) {
            return <h3 className="text-lg font-bold mb-2 mt-4">{children}</h3>;
        },
        // Lists
        ul({ children }: any) {
            return <ul className="list-disc list-inside mb-4 space-y-2 ml-4">{children}</ul>;
        },
        ol({ children }: any) {
            return <ol className="list-decimal list-inside mb-4 space-y-2 ml-4">{children}</ol>;
        },
        li({ children }: any) {
            return <li className="leading-7">{children}</li>;
        },
        // Blockquotes
        blockquote({ children }: any) {
            return (
                <blockquote className="border-l-4 border-(--foreground) pl-4 py-2 my-4 italic bg-(--clr-gray) rounded-r">
                    {children}
                </blockquote>
            );
        },
        // Links
        a({ href, children }: any) {
            return (
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-(--clr-white)/80 hover:text-(--clr-white) underline"
                >
                    {children}
                </a>
            );
        },
    };

    const Profile = ({ role }: { role: string }) => {
        return (
            <div className="w-10 h-10 flex shrink-0 items-center justify-center gap-2 rounded-full border border-(--clr-gray)">
                {
                    role === 'user' ? (
                        <span>U</span>
                    ) : (
                        <span>
                            <HugeiconsIcon icon={AiMagicIcon} size={18} />
                        </span>
                    )
                }
            </div>
        )
    }

    const UserMsg = () => {
        return (
            <div className="self-end max-w-[86%] md:max-w-[76%] flex flex-col gap-1">
                <div className="flex items-start gap-2">
                    <div className="rounded-xl px-3 py-2 bg-(--clr-gray)">
                        <p>{message}</p>
                    </div>
                    <Profile role={role} />
                </div>

                <div className="self-end mr-12 flex items-center gap-2 text-sm text-(--clr-white)/80">
                    <span>{moment(createdAt).format('hh:mm A')}</span>
                    <button className="cursor-pointer copy-button" onClick={(e) => handleCopyClick(message, e)}>
                        <HugeiconsIcon icon={Copy01Icon} size={14} className="copy-icon" />
                        <HugeiconsIcon icon={Tick02Icon} size={14} className="tick-icon" />
                    </button>
                </div>
            </div>
        )
    }

    const AssistantMsg = () => {
        return (
            <div className="mb-10 self-start max-w-[96%] md:max-w-[86%] flex flex-col gap-1">
                <div className="flex flex-row-reverse items-baseline gap-2">
                    <div className="rounded-xl px-3 py-2">
                        <Markdown
                            components={markdownComponents}
                        >{message}</Markdown>
                        {
                            isStreaming && (
                                <span className="text-xs text-(--clr-white)/80 animate-pulse" >|</span>
                            )
                        }
                    </div>
                    <Profile role={role} />
                </div>

                <div className="self-start ml-14 flex flex-row-reverse items-center gap-2 text-sm text-(--clr-white)/80">
                    <span>{moment(createdAt).format('hh:mm A')}</span>
                    <button className="cursor-pointer copy-button" onClick={(e) => handleCopyClick(message, e)}>
                        <HugeiconsIcon icon={Copy01Icon} size={14} className="copy-icon" />
                        <HugeiconsIcon icon={Tick02Icon} size={14} className="tick-icon" />
                    </button>
                </div>
            </div>
        )
    }

    return (
        <>
            {role === 'user' ? <UserMsg /> : <AssistantMsg />}
        </>
    );
}