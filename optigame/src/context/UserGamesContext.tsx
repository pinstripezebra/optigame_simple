import React, { createContext, useState, useContext, useEffect } from "react";
import apiClient from "../services/api-client";
import { useUser } from "./UserContext";

interface UserGamesContextType {
    asins: string[];
    setAsins: (asins: string[]) => void;
    addAsin: (asin: string) => void;
    removeAsin: (asin: string) => void;
}

const UserGamesContext = createContext<UserGamesContextType | undefined>(undefined);

export const UserGamesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [asins, setAsins] = useState<string[]>([]);
    const { username } = useUser();

    // Fetch user's games when username changes
    useEffect(() => {
        const fetchUserGames = async () => {
            if (!username) return;
            try {
                const response = await apiClient.get(`/v1/user_game?username=${username}`);
                // Adjust the response parsing as needed based on your backend's response structure
                setAsins(response.data.map((g: any) => g.asin));
            } catch (err) {
                setAsins([]);
            }
        };
        fetchUserGames();
    }, [username]);

    const addAsin = (asin: string) => setAsins(prev => [...prev, asin]);
    const removeAsin = (asin: string) => setAsins(prev => prev.filter(a => a !== asin));

    return (
        <UserGamesContext.Provider value={{ asins, setAsins, addAsin, removeAsin }}>
            {children}
        </UserGamesContext.Provider>
    );
};

export const useUserGames = (): UserGamesContextType => {
    const context = useContext(UserGamesContext);
    if (!context) {
        throw new Error("useUserGames must be used within a UserGamesProvider");
    }
    return context;
};