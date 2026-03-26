"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type UserType = {
    id: string;
    name: string;
    email: string;
    userType?: string;
    status?: string;
    promoSub?: boolean;
    favoriteMovies?: String[];
};

type UserContextType = {
    currentUser: UserType | null;
    setCurrentUser: (user: UserType | null) => void;
    logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    // Initialize from localStorage if available
    const [currentUser, setCurrentUser] = useState<UserType | null>(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("currentUser");
            return saved ? JSON.parse(saved) : null;
        }
        return null;
    });

    // Sync currentUser to localStorage whenever it changes
    useEffect(() => {
        if (currentUser) {
            localStorage.setItem("currentUser", JSON.stringify(currentUser));
        } else {
            localStorage.removeItem("currentUser");
        }
    }, [currentUser]);

    const logout = () => setCurrentUser(null);

    return (
        <UserContext.Provider value={{ currentUser, setCurrentUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be used within UserProvider");
    return context;
};