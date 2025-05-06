import React, { createContext, useState, useContext } from "react";

interface UserContextType {
  username: string;
  setUsername: (username: string) => void;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState("");

  const isAuthenticated = !!username; // User is authenticated if username is set

  return (
    <UserContext.Provider value={{ username, setUsername, isAuthenticated }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};