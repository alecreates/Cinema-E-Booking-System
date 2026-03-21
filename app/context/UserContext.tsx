"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type UserType = {
    id: string;
    name: string;
    email: string;
    userType?: string;
    status?: string;
    promoSub?: boolean;
};

type UserContextType = {
    currentUser: UserType | null;
    setCurrentUser: (user: UserType | null) => void;
    logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<UserType | null>(null);

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