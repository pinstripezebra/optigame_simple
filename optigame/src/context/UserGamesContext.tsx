import React, { createContext, useState, useContext } from "react";

interface UserGamesContextType {
    asins: string[];
    setAsins: (asins: string[]) => void;
    addAsin: (asin: string) => void;
    removeAsin: (asin: string) => void;
}

const UserGamesContext = createContext<UserGamesContextType | undefined>(undefined);

export const UserGamesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [asins, setAsins] = useState<string[]>([]);

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