'use client';
import Link from "next/link";
import { HugeiconsIcon } from '@hugeicons/react';
import { SquareArrowHorizontalIcon, CommentAdd01Icon, Delete03Icon } from '@hugeicons/core-free-icons';
import { usePathname } from "next/navigation";
import { toast } from "sonner";

import { useConversations } from "../hooks/useConversations";
import { useUser } from "../hooks/useUser";

import { useState } from "react";

import axios from "axios";

export default function Sidebar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathName = usePathname();

    const { conversations, isLoading, error, refetch } = useConversations();
    const { user, isLoading: userLoading, error: userError } = useUser();

    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

    //Handlers
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

    const handleDeleteAll = () => {
        axios.post(`${baseUrl}/api/deleteconversations`, { userId: user }, { headers: { "Content-Type": "application/json" } })
            .then((res) => {
                toast.success(res.data?.message || "Conversations deleted successfully");
                refetch();
            })
            .catch((error) => {
                toast.error(error.response?.data?.message || "Failed to delete conversations");
            })
    }

    const handleDeleteChat = (id: string) => {
        axios.post(`${baseUrl}/api/deletechat`, { userId: user, conversationId: id }, { headers: { "Content-Type": "application/json" } })
            .then((res) => {
                toast.success(res.data?.message || "Chat deleted successfully");
                refetch();
            })
            .catch((error) => {
                toast.error(error.response?.data?.message || "Failed to delete chat");
            })
    }

    const CoversationItem = ({ id, title }: { id: string; title: string }) => {
        const isActive = pathName === `/chat/${id}`;
        return (
            <Link href={`/chat/${id}`} className={`group flex justify-between gap-2 hover:bg-(--clr-gray) rounded-xl px-3 py-2 ${isActive ? 'bg-(--clr-gray)/70' : ''}`}>
                <span className="max-w-[24ch] md:max-w-[28ch] overflow-hidden text-ellipsis whitespace-nowrap">{title}</span>

                <button onClick={() => { handleDeleteChat(id) }} className="hidden p-1 group-hover:block hover:bg-(--clr-red) rounded-full cursor-pointer">
                    <HugeiconsIcon icon={Delete03Icon} size={14} />
                </button>
            </Link>
        )
    }

    const ConversationItemSkeleton = () => {
        return (
            <div className="flex justify-between items-center gap-1 px-3 py-2 rounded-xl animate-pulse">
                <div className="w-full h-6 bg-(--clr-gray) rounded-md"></div>
            </div>
        );
    }


    const UserProfile = ({ user }: { user: string }) => {
        return (
            <button className="bg-(--foreground) px-5 py-4 w-full flex items-center gap-2">
                <div className="rounded-full bg-(--clr-gray) w-10 h-10 grid place-items-center">
                    <span className="text-xl text-(--clr-white)/80">U</span>
                </div>
                <span className="text-base text-(--clr-white)/90">{user}</span>
            </button>
        )
    }

    const UserProfileSkeleton = () => {
        return (
            <div className="flex items-center gap-2 px-5 py-4">
                <div className="w-10 h-10 bg-(--clr-gray) rounded-full animate-pulse"></div>
                <div className="w-24 h-4 bg-(--clr-gray) rounded animate-pulse"></div>
            </div>
        )
    }

    return (
        <>
            <section className={`w-64 md:w-70 bg-(--foreground) h-screen absolute md:static top-0 z-10 flex flex-col shrink-0 transition-discrete duration-300 ease-in-out ${isSidebarOpen ? 'left-0' : '-left-64'} h-100vh overflow-y-auto`}>
                <div className="bg-(--foreground) flex flex-col px-2 pb-0 py-4 gap-4  sticky top-0">
                    {/* Logo */}
                    <div className="flex justify-between px-3">
                        <Link href="/">
                            <h1 className="text-xl ">Chat AI</h1>
                        </Link>

                        <button className="md:hidden" onClick={toggleSidebar}>
                            <HugeiconsIcon icon={SquareArrowHorizontalIcon} />
                        </button>
                    </div>

                    <div>
                        <Link href="/chat" className="flex items-center gap-2 hover:bg-(--clr-gray) rounded-xl px-3 py-2">
                            <HugeiconsIcon icon={CommentAdd01Icon} size={22} />
                            <span>New Chat</span>
                        </Link>
                    </div>

                    <div className="px-3 py-2 flex justify-between">
                        <span className="text-sm text-(--clr-white)/90">Recent Chats</span>
                        {
                            conversations.length > 0 && (
                                <button onClick={() => { handleDeleteAll() }} className="cursor-pointer text-sm text-(--clr-white)/90 underline hover:text-(--clr-red)/90">
                                    Clear all
                                </button>
                            )
                        }
                    </div>
                </div>


                <div className="h-full px-2 mb-3 flex flex-col">

                    {isLoading && (
                        [1, 2, 3, 4, 5].map((item) => (
                            <ConversationItemSkeleton key={item} />
                        ))
                    )}

                    {error && (
                        <div className="flex flex-col items-center justify-center h-full">
                            <span className="text-(--clr-red)/90">Error fetching conversations</span>
                            <button className="text-sm font-semibold text-(--clr-white)/90 underline cursor-pointer" onClick={() => { refetch() }}>Retry</button>
                        </div>
                    )}

                    {!isLoading && !error && conversations.map((conversation) => (
                        <CoversationItem key={conversation._id} id={conversation._id} title={conversation.title} />
                    ))}
                </div>

                <div className="sticky bottom-0 left-0 border-t border-(--clr-gray)">
                    {
                        userLoading && (
                            <UserProfileSkeleton />
                        )
                    }
                    {
                        user && (
                            <UserProfile user={user} />
                        )
                    }
                    {
                        userError && (
                            <div className="flex items-center justify-center h-full">
                                <span className="text-(--clr-red)/90">Error Setting User</span>
                            </div>
                        )
                    }
                </div>
            </section>

            <button onClick={toggleSidebar} className={`md:hidden fixed top-6 left-4 ${isSidebarOpen ? 'hidden' : 'block'}`}>
                <HugeiconsIcon icon={SquareArrowHorizontalIcon} />
            </button>
        </>
    );
}