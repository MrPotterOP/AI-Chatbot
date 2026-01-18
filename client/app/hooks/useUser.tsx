'use client';
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';

const USER_ID_KEY = 'userId';
const USER_ID_PREFIX = 'User-';
let cachedUserId: string | null = null;

function generateUserId(): string {
    return `${USER_ID_PREFIX}${uuidv4().substring(3, 12)}`;
}

function isValidUserId(id: string | null): id is string {
    return Boolean(id && id.startsWith(USER_ID_PREFIX) && id.length > USER_ID_PREFIX.length);
}

export function useUser() {
    const [user, setUser] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {

        if (cachedUserId) {
            setUser(cachedUserId);
            setIsLoading(false);
            return;
        }

        function initializeUser() {
            try {
                const storedUser = localStorage.getItem(USER_ID_KEY);

                if (isValidUserId(storedUser)) {
                    setUser(storedUser);
                } else {
                    const newUserId = generateUserId();
                    localStorage.setItem(USER_ID_KEY, newUserId);
                    setUser(newUserId);
                }
            } catch (error) {
                setError(error as Error);
            } finally {
                setIsLoading(false);
            }
        }

        initializeUser();
        cachedUserId = user;
    }, []);

    return {
        user,
        isLoading,
        error,
    };
}