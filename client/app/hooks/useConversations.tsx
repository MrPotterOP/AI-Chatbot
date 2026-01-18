import { useState, useEffect } from 'react';
import { useUser } from './useUser';
import axios from 'axios';

interface Conversation {
    _id: string;
    title: string;
}

interface UseConversationsReturn {
    conversations: Conversation[];
    isLoading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

export function useConversations(): UseConversationsReturn {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const { user, isLoading: userLoading, error: userError } = useUser();

    const fetchConversations = async () => {

        setIsLoading(true);
        setError(null);

        const apiLink = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

        axios.post(`${apiLink}/api/conversations`, { userId: user }, { headers: { 'Content-Type': 'application/json', } })
            .then(response => {
                setConversations(response.data);
                setIsLoading(false);
            }).catch(error => {
                setError(error);
                console.error('Error fetching conversations:', error);
                setIsLoading(false);
            })

    };

    useEffect(() => {
        if (user) {
            fetchConversations();
        } else {
            setIsLoading(userLoading);
            setError(userError);
        }
    }, [user]);

    return {
        conversations,
        isLoading,
        error,
        refetch: fetchConversations,
    };
}