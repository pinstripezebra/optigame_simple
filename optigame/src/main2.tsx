import { ChakraProvider } from "@chakra-ui/react";
import { ThemeProvider } from "next-themes";
import React from "react";
import ReactDOM from "react-dom/client";
import { UserProvider } from "./context/UserContext";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import Login from "./pages/LoginSignup/Login2";

import ProtectedRoute from "./pages/LoginSignup/ProtectedRoute";
import { UserGamesProvider } from "./context/UserGamesContext";


const router = createBrowserRouter([
  {
    path: "/Login",
    element: <Login />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
    errorElement: <NotFoundPage />,
  },


]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider>
      <ThemeProvider attribute="class" disableTransitionOnChange>
        <UserProvider>
          <UserGamesProvider>
            <RouterProvider router={router} />
          </UserGamesProvider>
        </UserProvider>
      </ThemeProvider>
    </ChakraProvider>
  </React.StrictMode>
);
